"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import type { GeoPoint } from "@/lib/geo/distance";
import { spreadOverlapping } from "@/lib/geo/spread-points";
import type { MapPointKind } from "@/dto/map-point.dto";

/**
 * Карта. Обёртка над движком: снаружи проект знает только маркеры, точку «вы
 * здесь» и basePath — захотим сменить Leaflet на Google Maps, поменяются
 * только внутренности этого файла.
 *
 * Один маркер = одна точка любого типа (место/событие/занятие): цвет пина по
 * kind, ссылка по href. Без kind/href маркер ведёт себя как место (каталог
 * мест передаёт только места) — обратная совместимость.
 *
 * Leaflet загружается динамически в эффекте: ему нужен window, на сервере
 * компонент рендерит только пустой контейнер.
 */

export type PlaceMapMarker = {
  id: string;
  name: string;
  /** slug места — для fallback-ссылки, если href не задан (каталог мест) */
  slug?: string;
  latitude: number;
  longitude: number;
  /** тип точки — цвет пина; без него «место» (терракота) */
  kind?: MapPointKind;
  /** готовая ссылка; без неё строится ссылка на место по slug */
  href?: string;
  /** «≈ 800 м» в режиме «Рядом со мной» */
  distanceLabel?: string;
  /** обложка — фото в попапе (null = только название) */
  imageUrl?: string | null;
};

/// Цвет купола пина по типу точки. Насыщенные тона палитры — читаются и на
/// светлых, и на тёмных тайлах (белая обводка отделяет от фона).
const PIN_COLOR: Record<MapPointKind, string> = {
  place: "#c96f4a", // терракота (accent)
  event: "#d38b2c", // янтарь
  activity: "#5f8368", // шалфей
};

/// Пин-маркер в стиле нашего шарика: купол с белой обводкой, узелок и
/// ниточка-указатель к точке (её кончик — iconAnchor). Тот же мотив, что у
/// заглушки обложек и кнопки-закрывашки лайтбокса.
function pinSvg(color: string): string {
  return (
    '<svg viewBox="0 0 30 40" width="30" height="40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    `<ellipse cx="15" cy="14" rx="11.5" ry="13" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>` +
    `<path d="M11.6 26.2 15 23l3.4 3.2z" fill="${color}" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/>` +
    `<path d="M15 26.4q3 4.4 0 6.2t0 5" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>` +
    "</svg>"
  );
}

type PlacesMapProps = {
  markers: PlaceMapMarker[];
  /** позиция пользователя (только с его согласия) — точка «вы здесь» */
  userPoint: GeoPoint | null;
  basePath: string;
  /** какие типы показать в легенде; без него легенды нет (каталог мест) */
  legendKinds?: MapPointKind[];
};

/// спокойные тайлы CARTO поверх данных OpenStreetMap: светлые и тёмные —
/// подбираются под тему при создании карты (см. эффект ниже)
const TILE_URL_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_URL_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

export function PlacesMap({
  markers,
  userPoint,
  basePath,
  legendKinds,
}: PlacesMapProps): React.ReactElement {
  const dict = useDictionary();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Ключи-примитивы вместо объектов в deps: массив маркеров пересоздаётся
  // на каждом рендере родителя, а перестраивать карту нужно только когда
  // реально изменился состав точек.
  const markersKey = JSON.stringify(markers);
  const userKey = userPoint ? `${userPoint.latitude},${userPoint.longitude}` : "";
  const youAreHereLabel = dict.places.mapYouAreHere;

  useEffect(() => {
    let map: LeafletMap | undefined;
    let themeObserver: MutationObserver | undefined;
    let cancelled = false;

    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) {
        return;
      }

      const rawMarkers = JSON.parse(markersKey) as PlaceMapMarker[];
      // пины в одной точке (место + его занятия/события) раздвигаем, чтобы
      // не сливались; попап и ссылка у каждого свои
      const parsedMarkers = spreadOverlapping(rawMarkers);

      map = L.map(containerRef.current, {
        // колесо мыши не перехватываем: страница должна скроллиться спокойно
        scrollWheelZoom: false,
      });

      // тема приходит из data-theme на <html> (его ведут theme-script и
      // кнопка в шапке); наблюдатель ниже живьём меняет тайлы при переключении
      const tileUrlForTheme = (): string =>
        document.documentElement.dataset.theme === "dark"
          ? TILE_URL_DARK
          : TILE_URL_LIGHT;
      const tiles = L.tileLayer(tileUrlForTheme(), {
        attribution: TILE_ATTRIBUTION,
        maxZoom: 19,
      }).addTo(map);
      themeObserver = new MutationObserver(() => {
        tiles.setUrl(tileUrlForTheme());
      });
      themeObserver.observe(document.documentElement, {
        attributeFilter: ["data-theme"],
      });

      // иконка на каждый тип — создаём один раз, переиспользуем
      const iconByKind = new Map<MapPointKind, ReturnType<typeof L.divIcon>>();
      const iconFor = (kind: MapPointKind): ReturnType<typeof L.divIcon> => {
        const cached = iconByKind.get(kind);
        if (cached) {
          return cached;
        }
        const icon = L.divIcon({
          className: "map-pin",
          html: pinSvg(PIN_COLOR[kind]),
          iconSize: [30, 40],
          // кончик ниточки указывает на координату; попап — над куполом
          iconAnchor: [15, 38],
          popupAnchor: [0, -34],
        });
        iconByKind.set(kind, icon);
        return icon;
      };

      const bounds: Array<[number, number]> = [];

      for (const marker of parsedMarkers) {
        const position: [number, number] = [marker.latitude, marker.longitude];
        bounds.push(position);
        const kind: MapPointKind = marker.kind ?? "place";

        // Попап собираем DOM-узлами: textContent сам экранирует название
        const popup = document.createElement("div");
        popup.className = "map-popup";
        if (marker.imageUrl) {
          const photo = document.createElement("img");
          photo.className = "map-popup-photo";
          photo.src = marker.imageUrl;
          photo.alt = "";
          photo.loading = "lazy";
          popup.appendChild(photo);
        }
        const link = document.createElement("a");
        link.href = marker.href ?? `${basePath}/places/${marker.slug}`;
        link.textContent = marker.name;
        popup.appendChild(link);
        if (marker.distanceLabel) {
          const distance = document.createElement("div");
          distance.className = "map-popup-distance";
          distance.textContent = marker.distanceLabel;
          popup.appendChild(distance);
        }

        L.marker(position, { icon: iconFor(kind), title: marker.name })
          .addTo(map)
          .bindPopup(popup);
      }

      if (userKey) {
        const [lat, lng] = userKey.split(",").map(Number);
        const userIcon = L.divIcon({
          className: "map-user-dot",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker([lat, lng], { icon: userIcon, title: youAreHereLabel })
          .addTo(map)
          .bindTooltip(youAreHereLabel, { direction: "top", offset: [0, -8] });
        bounds.push([lat, lng]);
      }

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [32, 32] });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 15);
      } else {
        // совсем без точек не бывает (страница мест), но на всякий — Паттайя
        map.setView([12.9276, 100.8771], 12);
      }
    });

    return () => {
      cancelled = true;
      themeObserver?.disconnect();
      map?.remove();
    };
  }, [markersKey, userKey, basePath, youAreHereLabel]);

  const legend =
    legendKinds && legendKinds.length > 0 ? (
      <ul className="map-legend" aria-label={dict.places.mapLegend.title}>
        {legendKinds.map((kind) => (
          <li key={kind} className="map-legend-item">
            <span
              className="map-legend-dot"
              style={{ background: PIN_COLOR[kind] }}
              aria-hidden="true"
            />
            {dict.places.mapLegend[kind]}
          </li>
        ))}
      </ul>
    ) : null;

  // region + имя: скринридер объявляет «Карта» и может её пропустить —
  // доступная альтернатива та же (список с теми же фильтрами)
  return (
    <div className="places-map-wrap">
      <div
        ref={containerRef}
        className="places-map-shell"
        role="region"
        aria-label={dict.places.mapRegionLabel}
      />
      {legend}
    </div>
  );
}
