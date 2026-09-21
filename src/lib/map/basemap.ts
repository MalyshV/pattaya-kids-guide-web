/**
 * Подложка карты (плитки под пинами).
 *
 * Основная — спокойные CARTO light/dark поверх данных OpenStreetMap. С
 * сентября 2026 CARTO без ключа рисует на каждой плитке «API KEY REQUIRED»,
 * поэтому нужен бесплатный ключ (NEXT_PUBLIC_CARTO_KEY, ограничен доменом
 * прод-сайта — задаётся только для Production в Vercel).
 *
 * Запасная — стандартные плитки OpenStreetMap, приглушённые CSS-фильтром
 * (.map-tiles-osm в globals.css; тёмная — инверсия): ключа нет (локальная
 * разработка, превью PR) или CARTO отвечает отказами (ключ отозван, чужой
 * адрес). Условия OSM публичному сайту это разрешают, атрибуция обязательна.
 */

export type Basemap = {
  id: "carto" | "osm";
  /** адрес плиток под текущую тему */
  url: (dark: boolean) => string;
  attribution: string;
  /** класс контейнера слоя (для CSS-фильтра запасной подложки) */
  className?: string;
  subdomains?: string;
};

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const OSM_BASEMAP: Basemap = {
  id: "osm",
  // одна и та же плитка для обеих тем — тёмную делает CSS-фильтр
  url: () => "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: OSM_ATTRIBUTION,
  className: "map-tiles-osm",
};

export function cartoBasemap(key: string): Basemap {
  const query = `?key=${encodeURIComponent(key)}`;
  return {
    id: "carto",
    url: (dark) =>
      `https://{s}.basemaps.cartocdn.com/${dark ? "dark_all" : "light_all"}/{z}/{x}/{y}{r}.png${query}`,
    attribution: `${OSM_ATTRIBUTION} &copy; <a href="https://carto.com/attributions">CARTO</a>`,
    subdomains: "abcd",
  };
}

/** Есть ключ — CARTO, нет — запасная подложка. */
export function pickBasemap(cartoKey: string | undefined): Basemap {
  const key = cartoKey?.trim();
  return key ? cartoBasemap(key) : OSM_BASEMAP;
}

/**
 * Сколько ошибок загрузки плиток CARTO подряд терпим, прежде чем уйти на
 * запасную подложку (одна-две — обычная сетевая случайность).
 */
export const BASEMAP_ERRORS_BEFORE_FALLBACK = 3;
