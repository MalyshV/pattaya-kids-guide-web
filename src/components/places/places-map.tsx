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

/// Цвет пина по типу точки. Насыщенные тона палитры — читаются и на светлых,
/// и на тёмных тайлах (белая обводка отделяет от фона).
const PIN_COLOR: Record<MapPointKind, string> = {
  place: "#c96f4a", // терракота (accent)
  event: "#d38b2c", // янтарь
  activity: "#5f8368", // шалфей
};

/// Каждый тип — своя форма пина (различимы и цветом, и силуэтом): место —
/// игрушечный мишка, занятие — лампочка, событие — воздушный шарик. Белая
/// обводка отделяет фигуру от тайлов; своя «нога» (anchor) стоит на координате.
type PinShape = {
  html: (color: string) => string;
  size: [number, number];
  /** точка SVG, попадающая на координату (низ фигуры) */
  anchor: [number, number];
  /** смещение попапа над фигурой */
  popup: [number, number];
};

const SVG_OPEN = (w: number, h: number): string =>
  `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;

/// Место — сидящий игрушечный мишка: голова с ушами, тело, лапки.
function bearPin(color: string): string {
  return (
    SVG_OPEN(32, 44) +
    `<circle cx="9" cy="10.5" r="4" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>` +
    `<circle cx="23" cy="10.5" r="4" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>` +
    `<circle cx="9.5" cy="37" r="3" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>` +
    `<circle cx="22.5" cy="37" r="3" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>` +
    `<ellipse cx="16" cy="31" rx="9.5" ry="8.5" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>` +
    `<circle cx="16" cy="15" r="9" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>` +
    `<ellipse cx="16" cy="17.5" rx="4" ry="3.2" fill="#ffffff" opacity="0.9"/>` +
    `<circle cx="16" cy="16.4" r="1.2" fill="${color}"/>` +
    "</svg>"
  );
}

/// Занятие — лампочка «включённая»: лучики цветом пина, колба с петлёй-нитью,
/// цоколь с резьбой. Лучики рисуются первыми (сзади) — колба скрывает их
/// внутренние концы, наружу торчат короткие штрихи.
function bulbPin(color: string): string {
  return (
    SVG_OPEN(30, 36) +
    `<path d="M15 3.5V0.5M22.4 6.3l2-2.3M7.6 6.3l-2-2.3M25.7 12.4l3-1M4.3 12.4l-3-1" ` +
    `stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<circle cx="15" cy="15" r="9.5" fill="${color}" stroke="#ffffff" stroke-width="2"/>` +
    `<path d="M11.4 15q3.6 4.6 7.2 0" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round"/>` +
    `<rect x="10" y="23" width="10" height="9" rx="1.8" fill="${color}" stroke="#ffffff" stroke-width="2"/>` +
    `<path d="M12 26.5h6M12 29h6" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>` +
    "</svg>"
  );
}

/// Событие — воздушный шарик, облегчённый: тонкая обводка, блик, узелок,
/// волнистая ниточка-указатель (её кончик — координата).
function balloonPin(color: string): string {
  return (
    SVG_OPEN(30, 46) +
    `<path d="M15 30q3.4 4.6 0 8t0 6" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/>` +
    `<path d="M12.8 29.6 15 26.8l2.2 2.8z" fill="${color}"/>` +
    `<ellipse cx="15" cy="15" rx="10.5" ry="13" fill="${color}" stroke="#ffffff" stroke-width="2"/>` +
    `<ellipse cx="10.8" cy="9.5" rx="2.4" ry="4" fill="#ffffff" opacity="0.55"/>` +
    "</svg>"
  );
}

const PIN_SHAPE: Record<MapPointKind, PinShape> = {
  place: { html: bearPin, size: [32, 44], anchor: [16, 41], popup: [0, -38] },
  activity: { html: bulbPin, size: [30, 36], anchor: [15, 33], popup: [0, -30] },
  event: { html: balloonPin, size: [30, 46], anchor: [15, 44], popup: [0, -40] },
};

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

      // иконка на каждый тип — своя форма (мишка/лампочка/шарик), создаём
      // один раз, переиспользуем
      const iconByKind = new Map<MapPointKind, ReturnType<typeof L.divIcon>>();
      const iconFor = (kind: MapPointKind): ReturnType<typeof L.divIcon> => {
        const cached = iconByKind.get(kind);
        if (cached) {
          return cached;
        }
        const shape = PIN_SHAPE[kind];
        const icon = L.divIcon({
          className: "map-pin",
          html: shape.html(PIN_COLOR[kind]),
          iconSize: shape.size,
          iconAnchor: shape.anchor,
          popupAnchor: shape.popup,
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
            {/* та же фигура, что и пин на карте — легенда учит форме, не
                только цвету (текст рядом остаётся для доступности) */}
            <span
              className="map-legend-icon"
              aria-hidden="true"
              dangerouslySetInnerHTML={{
                __html: PIN_SHAPE[kind].html(PIN_COLOR[kind]),
              }}
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
