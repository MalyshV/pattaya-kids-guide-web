"use client";

import { useEffect, useRef } from "react";
import {
  BASEMAP_ERRORS_BEFORE_FALLBACK,
  OSM_BASEMAP,
  pickBasemap,
  type Basemap,
} from "@/lib/map/basemap";
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
  /** тип точки — цвет и форма пина; без него «место» */
  kind?: MapPointKind;
  /** готовая ссылка; без неё строится ссылка на место по slug */
  href?: string;
  /** «≈ 800 м» в режиме «Рядом со мной» */
  distanceLabel?: string;
  /** короткая пометка под названием — у события «Начало 28 сент.»/«Уже прошло» */
  note?: string;
  /** обложка — фото в попапе (null = только название) */
  imageUrl?: string | null;
  /** закрытое место — тусклый пин */
  muted?: boolean;
};

/// Цвет пина по типу точки — те же три краски, что у точек в календаре и
/// афише: читаются на светлых тайлах (белая обводка отделяет от фона).
const PIN_COLOR: Record<MapPointKind, string> = {
  place: "#26323b", // тушь
  event: "#c98a3e", // охра
  activity: "#1f5f78", // море
};

/// Каждый тип — своя форма пина (различимы и цветом, и силуэтом), все три —
/// из образа «Тушь и вода»: место — капля туши, занятие — круги на воде,
/// событие — морская звезда. Фигуры маленькие и плоские: в центре города
/// точек сотни, крупные пины слипались в одно пятно. Светлая обводка
/// отделяет фигуру от тайлов.
type PinShape = {
  html: (color: string) => string;
  size: [number, number];
  /** точка SVG, попадающая на координату */
  anchor: [number, number];
  /** смещение попапа над фигурой */
  popup: [number, number];
};

const PIN_OUTLINE = "#ffffff";

const SVG_OPEN = (w: number, h: number): string =>
  `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;

/// Место — капля туши остриём вниз (остриё стоит на координате), внутри —
/// светлая точка, как блик на мокрой туши.
function dropPin(color: string): string {
  return (
    SVG_OPEN(24, 31) +
    `<path d="M12 29.6C12 29.6 3 19.2 3 11.6a9 9 0 0 1 18 0C21 19.2 12 29.6 12 29.6z" ` +
    `fill="${color}" stroke="${PIN_OUTLINE}" stroke-width="1.6" stroke-linejoin="round"/>` +
    `<circle cx="12" cy="11.6" r="3" fill="${PIN_OUTLINE}"/>` +
    "</svg>"
  );
}

/// Занятие — круги на воде: круг с тонким кольцом и точкой в центре
/// (центр круга — координата).
function ripplePin(color: string): string {
  return (
    SVG_OPEN(24, 24) +
    `<circle cx="12" cy="12" r="10" fill="${color}" stroke="${PIN_OUTLINE}" stroke-width="1.6"/>` +
    `<circle cx="12" cy="12" r="5.6" fill="none" stroke="${PIN_OUTLINE}" stroke-width="1.3" opacity="0.9"/>` +
    `<circle cx="12" cy="12" r="1.7" fill="${PIN_OUTLINE}"/>` +
    "</svg>"
  );
}

/// Событие — морская звезда: тот же контур дважды — широкий светлый (обводка)
/// и поверх цветной со скруглёнными лучами (центр звезды — координата).
const STAR_PATH =
  "M13.0 4.3L15.5 10.2L21.9 10.8L17.1 15.0L18.5 21.3L13.0 18.0L7.5 21.3L8.9 15.0L4.1 10.8L10.5 10.2z";

function starPin(color: string): string {
  return (
    SVG_OPEN(26, 26) +
    `<path d="${STAR_PATH}" fill="${PIN_OUTLINE}" stroke="${PIN_OUTLINE}" stroke-width="5.4" stroke-linejoin="round"/>` +
    `<path d="${STAR_PATH}" fill="${color}" stroke="${color}" stroke-width="2.4" stroke-linejoin="round"/>` +
    `<circle cx="13" cy="13.7" r="1.5" fill="${PIN_OUTLINE}"/>` +
    "</svg>"
  );
}

const PIN_SHAPE: Record<MapPointKind, PinShape> = {
  place: { html: dropPin, size: [24, 31], anchor: [12, 30], popup: [0, -28] },
  activity: { html: ripplePin, size: [24, 24], anchor: [12, 12], popup: [0, -12] },
  event: { html: starPin, size: [26, 26], anchor: [13, 14], popup: [0, -13] },
};

/** Подпись-ссылка на карте — соседний район на странице района. */
export type MapLabel = {
  id: string;
  /** «Джомтьен» */
  name: string;
  /** тихая пометка после названия — число мест */
  hint?: string;
  href: string;
  latitude: number;
  longitude: number;
};

/** Вершина границы: [широта, долгота]. */
type MapLatLng = [number, number];

/// Район в фокусе: всё ВНЕ его границы накрыто лёгкой вуалью, сам район
/// остаётся чистым листом. Цвет вуали — цвет воды основной подложки (CARTO:
/// 212/218/221): суша вне района заметно сереет, а море не меняется вовсе —
/// поэтому граница района, грубо уходящая в воду, на море не видна, и
/// рисовать берег не нужно. (На запасной подложке OSM вода другого цвета —
/// там полоса района на море слегка заметна.) Край вуали размыт
/// (.map-district-mask), как край акварельной заливки: границы районов
/// условны, жёсткая линия обещала бы точность, которой у них нет.
/// Обычное наложение, без mix-blend-mode: режим darken дал бы тот же эффект
/// на любой подложке, но его нельзя проверить в Safari — выбрана надёжность.
const DISTRICT_MASK_COLOR = "#d4dadd";
const DISTRICT_MASK_OPACITY = 0.78;
/// Поля кадра вокруг района — доля меньшей стороны карты. Район не должен
/// занимать весь кадр: тогда вуали не видно совсем и непонятно, что выделено.
const DISTRICT_FRAME_MARGIN = 0.16;
const WORLD_RING: MapLatLng[] = [
  [-85, -180],
  [-85, 180],
  [85, 180],
  [85, -180],
];

/**
 * Фигура пина вне карты — в легенде и у переключателей страницы района:
 * та же форма и цвет, что на карте (учит форме, а не только цвету).
 */
export function MapPinIcon({ kind }: { kind: MapPointKind }): React.ReactElement {
  return (
    <span
      className="map-legend-icon"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: PIN_SHAPE[kind].html(PIN_COLOR[kind]) }}
    />
  );
}

type PlacesMapProps = {
  markers: PlaceMapMarker[];
  /** позиция пользователя (только с его согласия) — точка «вы здесь» */
  userPoint: GeoPoint | null;
  basePath: string;
  /** какие типы показать в легенде; без него легенды нет (каталог мест) */
  legendKinds?: MapPointKind[];
  /** имя региона для скринридера; без него «Карта мест» */
  regionLabel?: string;
  /** граница района в фокусе — всё вне её приглушается */
  focusBoundary?: MapLatLng[];
  /** точки, которые должны попасть в кадр вместе с пинами (суша района) */
  frame?: MapLatLng[];
  /** подписи-ссылки (соседние районы); в кадр не входят */
  labels?: MapLabel[];
  /** доп. класс обёртки — своя высота карты на странице района */
  className?: string;
};

export function PlacesMap({
  markers,
  userPoint,
  basePath,
  legendKinds,
  regionLabel,
  focusBoundary,
  frame,
  labels,
  className,
}: PlacesMapProps): React.ReactElement {
  const dict = useDictionary();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Ключи-примитивы вместо объектов в deps: массив маркеров пересоздаётся
  // на каждом рендере родителя, а перестраивать карту нужно только когда
  // реально изменился состав точек.
  const markersKey = JSON.stringify(markers);
  const userKey = userPoint ? `${userPoint.latitude},${userPoint.longitude}` : "";
  const focusKey = JSON.stringify(focusBoundary ?? []);
  const frameKey = JSON.stringify(frame ?? []);
  const labelsKey = JSON.stringify(labels ?? []);
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

      // Подложка: CARTO с ключом, иначе — запасная OSM (см. lib/map/basemap).
      // Тема приходит из data-theme на <html> (его ведут theme-script и
      // кнопка в шапке); наблюдатель ниже живьём меняет плитки при переключении.
      const isDark = (): boolean => document.documentElement.dataset.theme === "dark";
      let basemap = pickBasemap(process.env.NEXT_PUBLIC_CARTO_KEY);
      const layerFor = (next: Basemap): ReturnType<typeof L.tileLayer> =>
        L.tileLayer(next.url(isDark()), {
          attribution: next.attribution,
          maxZoom: 19,
          ...(next.className ? { className: next.className } : {}),
          ...(next.subdomains ? { subdomains: next.subdomains } : {}),
        });
      let tiles = layerFor(basemap).addTo(map);

      // ключ отозван или адрес не из разрешённых — CARTO отвечает 403 на
      // каждую плитку; после нескольких ошибок уходим на запасную подложку,
      // чтобы карта не осталась серой
      if (basemap.id === "carto") {
        let failures = 0;
        tiles.on("tileerror", () => {
          failures += 1;
          if (failures === BASEMAP_ERRORS_BEFORE_FALLBACK && map) {
            map.removeLayer(tiles);
            basemap = OSM_BASEMAP;
            tiles = layerFor(basemap).addTo(map);
          }
        });
      }

      themeObserver = new MutationObserver(() => {
        tiles.setUrl(basemap.url(isDark()));
      });
      themeObserver.observe(document.documentElement, {
        attributeFilter: ["data-theme"],
      });

      // район в фокусе: вуаль на всём, кроме него (см. DISTRICT_MASK_COLOR)
      const focus = JSON.parse(focusKey) as MapLatLng[];
      if (focus.length >= 3) {
        map.createPane("districtMask").classList.add("map-district-mask");
        L.polygon([WORLD_RING, focus], {
          pane: "districtMask",
          stroke: false,
          fillColor: DISTRICT_MASK_COLOR,
          fillOpacity: DISTRICT_MASK_OPACITY,
          interactive: false,
        }).addTo(map);
      }

      // подписи соседних районов — ссылки поверх вуали, под пинами
      for (const label of JSON.parse(labelsKey) as MapLabel[]) {
        const link = document.createElement("a");
        link.className = "map-district-label";
        link.href = label.href;
        link.textContent = label.name;
        if (label.hint) {
          const hint = document.createElement("span");
          hint.className = "map-district-label-hint";
          hint.textContent = label.hint;
          link.appendChild(hint);
        }
        L.marker([label.latitude, label.longitude], {
          icon: L.divIcon({
            className: "map-district-label-anchor",
            html: link,
            iconSize: [0, 0],
          }),
          // ссылка внутри сама фокусируется; маркеру второй фокус не нужен
          keyboard: false,
          zIndexOffset: -1000,
        }).addTo(map);
      }

      // иконка на каждый тип — своя форма (капля/круги/звезда), создаём
      // один раз, переиспользуем
      const iconByKind = new Map<string, ReturnType<typeof L.divIcon>>();
      const iconFor = (
        kind: MapPointKind,
        muted: boolean,
      ): ReturnType<typeof L.divIcon> => {
        const cacheKey = `${kind}:${muted ? "muted" : "live"}`;
        const cached = iconByKind.get(cacheKey);
        if (cached) {
          return cached;
        }
        const shape = PIN_SHAPE[kind];
        const icon = L.divIcon({
          className: muted ? "map-pin map-pin-muted" : "map-pin",
          html: shape.html(PIN_COLOR[kind]),
          iconSize: shape.size,
          iconAnchor: shape.anchor,
          popupAnchor: shape.popup,
        });
        iconByKind.set(cacheKey, icon);
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
        if (marker.note) {
          const note = document.createElement("div");
          note.className = "map-popup-note";
          note.textContent = marker.note;
          popup.appendChild(note);
        }
        if (marker.distanceLabel) {
          const distance = document.createElement("div");
          distance.className = "map-popup-distance";
          distance.textContent = marker.distanceLabel;
          popup.appendChild(distance);
        }

        L.marker(position, {
          icon: iconFor(kind, marker.muted === true),
          title: marker.name,
        })
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

      // суша района входит в кадр вместе с пинами: район виден целиком,
      // даже если мест в нём два и оба в одном углу
      for (const vertex of JSON.parse(frameKey) as MapLatLng[]) {
        bounds.push(vertex);
      }

      if (bounds.length > 1) {
        const size = map.getSize();
        const padding =
          focus.length >= 3
            ? Math.max(32, Math.round(Math.min(size.x, size.y) * DISTRICT_FRAME_MARGIN))
            : 32;
        map.fitBounds(bounds, { padding: [padding, padding] });
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
  }, [markersKey, userKey, basePath, youAreHereLabel, focusKey, frameKey, labelsKey]);

  const legend =
    legendKinds && legendKinds.length > 0 ? (
      <ul className="map-legend" aria-label={dict.places.mapLegend.title}>
        {legendKinds.map((kind) => (
          <li key={kind} className="map-legend-item">
            <MapPinIcon kind={kind} />
            {dict.places.mapLegend[kind]}
          </li>
        ))}
      </ul>
    ) : null;

  // region + имя: скринридер объявляет «Карта» и может её пропустить —
  // доступная альтернатива та же (список с теми же фильтрами)
  return (
    <div className={`places-map-wrap${className ? ` ${className}` : ""}`}>
      <div
        ref={containerRef}
        className="places-map-shell"
        role="region"
        aria-label={regionLabel ?? dict.places.mapRegionLabel}
      />
      {legend}
    </div>
  );
}
