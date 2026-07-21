"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import type { GeoPoint } from "@/lib/geo/distance";

/**
 * Карта мест. Обёртка над движком: снаружи проект знает только маркеры,
 * точку «вы здесь» и basePath — захотим сменить Leaflet на Google Maps,
 * поменяются только внутренности этого файла.
 *
 * Leaflet загружается динамически в эффекте: ему нужен window, на сервере
 * компонент рендерит только пустой контейнер.
 */

export type PlaceMapMarker = {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  /** «≈ 800 м» в режиме «Рядом со мной» */
  distanceLabel?: string;
  /** обложка места — фото в попапе (null = только название) */
  imageUrl?: string | null;
};

/// Пин-маркер в стиле нашего шарика: терракотовый купол с белой обводкой,
/// узелок и ниточка-указатель к точке (её кончик — iconAnchor). Тот же мотив,
/// что у заглушки обложек и кнопки-закрывашки лайтбокса.
const PIN_SVG =
  '<svg viewBox="0 0 30 40" width="30" height="40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<ellipse cx="15" cy="14" rx="11.5" ry="13" fill="#c96f4a" stroke="#ffffff" stroke-width="2.5"/>' +
  '<path d="M11.6 26.2 15 23l3.4 3.2z" fill="#c96f4a" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/>' +
  '<path d="M15 26.4q3 4.4 0 6.2t0 5" fill="none" stroke="#c96f4a" stroke-width="2" stroke-linecap="round"/>' +
  "</svg>";

type PlacesMapProps = {
  markers: PlaceMapMarker[];
  /** позиция пользователя (только с его согласия) — точка «вы здесь» */
  userPoint: GeoPoint | null;
  basePath: string;
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

      const parsedMarkers = JSON.parse(markersKey) as PlaceMapMarker[];

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

      const placeIcon = L.divIcon({
        className: "map-pin",
        html: PIN_SVG,
        iconSize: [30, 40],
        // кончик ниточки указывает на координату; попап — над куполом
        iconAnchor: [15, 38],
        popupAnchor: [0, -34],
      });

      const bounds: Array<[number, number]> = [];

      for (const marker of parsedMarkers) {
        const position: [number, number] = [marker.latitude, marker.longitude];
        bounds.push(position);

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
        link.href = `${basePath}/places/${marker.slug}`;
        link.textContent = marker.name;
        popup.appendChild(link);
        if (marker.distanceLabel) {
          const distance = document.createElement("div");
          distance.className = "map-popup-distance";
          distance.textContent = marker.distanceLabel;
          popup.appendChild(distance);
        }

        L.marker(position, { icon: placeIcon, title: marker.name })
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

  // region + имя: скринридер объявляет «Карта мест» и может её пропустить —
  // доступная альтернатива та же (список с теми же фильтрами)
  return (
    <div
      ref={containerRef}
      className="places-map-shell"
      role="region"
      aria-label={dict.places.mapRegionLabel}
    />
  );
}
