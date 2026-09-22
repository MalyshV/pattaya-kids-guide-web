import type { GeoPoint } from "@/lib/geo/distance";

/**
 * Разбор ссылки Google Карт, которую родитель вставил в форму «Предложить
 * своё». Чистые функции без сети (раскрытие коротких ссылок — отдельно, на
 * сервере: resolve-maps-link.ts).
 *
 * Где в ссылке точка места — важно для проверки на дубли:
 *  - `!3d<lat>!4d<lng>` в data= — ПИН места (берём последнюю пару: в data
 *    бывают вложенные блоки поискового «мусора»);
 *  - `?q=<lat>,<lng>` / `?query=<lat>,<lng>` — тоже точная точка;
 *  - короткая ссылка «Поделиться» с телефона раскрывается в ?q=<название +
 *    адрес>&ftid=… — БЕЗ координат: для неё работает только сравнение по
 *    названию (проверено на реальной ссылке 22.09);
 *  - `@<lat>,<lng>` — лишь ЦЕНТР окна карты: на реальных ссылках он уходит
 *    от пина на 170–280 м, больше порога дубля (150 м), поэтому только
 *    запасной «слабый» сигнал.
 */

export type MapsLink = {
  /** короткая ссылка (maps.app.goo.gl, goo.gl/maps) — точка будет только
      после раскрытия на сервере */
  isShort: boolean;
  /** название из /maps/place/<NAME>/ или /maps/search/<TEXT>/ */
  name: string | null;
  /** точная точка места */
  pin: GeoPoint | null;
  /** центр окна карты (@lat,lng) — неточно */
  viewport: GeoPoint | null;
};

/**
 * Хост полной ссылки Google Карт: google.com / google.co.th / google.ru /
 * google.com.ua … (+ www., maps.). Шаблон якорный и перечисляет только формы
 * доменов Google, поэтому google.evil.com или x.google.co.th.attacker.net не
 * проходят (важно: по таким ссылкам сервер ходит при раскрытии коротких).
 */
const GOOGLE_MAPS_HOST =
  /^(?:www\.|maps\.)?google\.(?:com|co\.[a-z]{2}|com\.[a-z]{2}|[a-z]{2})$/;

export function isGoogleMapsHost(hostname: string): boolean {
  return GOOGLE_MAPS_HOST.test(hostname);
}

/** Хосты коротких ссылок «Поделиться» с телефона */
export const SHORT_MAPS_HOSTS: ReadonlySet<string> = new Set([
  "maps.app.goo.gl",
  "goo.gl",
]);

// ссылка внутри текста: «Play Barn https://maps.app.goo.gl/…» — так часто
// вставляют из «Поделиться», где перед ссылкой стоит название
const URL_IN_TEXT = /(https?:\/\/\S+|(?:maps\.app\.goo\.gl|goo\.gl)\/\S+)/i;

function toUrl(raw: string): URL | null {
  const found = raw.trim().match(URL_IN_TEXT)?.[1] ?? raw.trim();
  const trimmed = found.trim();
  if (!trimmed || /\s/.test(trimmed)) {
    return null;
  }
  // «maps.app.goo.gl/abc» без схемы — частый случай при копировании
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withScheme);
  } catch {
    return null;
  }
}

function point(lat: string | undefined, lng: string | undefined): GeoPoint | null {
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180 ||
    (latitude === 0 && longitude === 0)
  ) {
    return null;
  }
  return { latitude, longitude };
}

const COORDS_PAIR = /^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/;

function decodeSegment(segment: string): string | null {
  try {
    // '+' = пробел в сегменте, литеральный '+' приходит как %2B — порядок важен
    const text = decodeURIComponent(segment.replace(/\+/g, " ")).trim();
    return text || null;
  } catch {
    return null;
  }
}

/** Ссылка ли это на Google Карты (полная или короткая) — по хосту. */
export function isMapsUrl(url: URL): boolean {
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return false;
  }
  // нестандартный порт — не ссылка «Поделиться», сервер туда не ходит
  if (url.port !== "" || url.username !== "" || url.password !== "") {
    return false;
  }
  if (isGoogleMapsHost(url.hostname)) {
    return url.pathname.startsWith("/maps") || url.searchParams.has("q");
  }
  if (url.hostname === "maps.app.goo.gl") {
    return url.pathname.length > 1;
  }
  // goo.gl — только старые ссылки Карт вида goo.gl/maps/…
  return url.hostname === "goo.gl" && url.pathname.startsWith("/maps/");
}

/**
 * Текст из поля «Где» → разбор ссылки Карт; не ссылка Карт (адрес текстом,
 * чужой сайт) → null.
 */
export function parseMapsLink(raw: string): MapsLink | null {
  const url = toUrl(raw);
  if (!url || !isMapsUrl(url)) {
    return null;
  }

  if (SHORT_MAPS_HOSTS.has(url.hostname)) {
    return { isShort: true, name: null, pin: null, viewport: null };
  }

  const nameMatch = url.pathname.match(/\/maps\/(?:place|search)\/([^/]+)/);
  const name = nameMatch?.[1] ? decodeSegment(nameMatch[1]) : null;

  // пин: последняя пара !3d…!4d… в data= (путь может быть в pathname целиком)
  let full = url.pathname + url.search;
  try {
    full = decodeURIComponent(full);
  } catch {
    // битая %-последовательность — ищем пин в сыром виде
  }
  const pins = [...full.matchAll(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/g)];
  const last = pins.at(-1);
  let pin = last ? point(last[1], last[2]) : null;

  if (!pin) {
    const query = url.searchParams.get("q") ?? url.searchParams.get("query");
    const pair = query?.match(COORDS_PAIR);
    if (pair) {
      pin = point(pair[1], pair[2]);
    }
  }

  const at = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  const viewport = at ? point(at[1], at[2]) : null;

  // ?q=Название — только текст (название для сравнения по имени)
  const queryName =
    !name && !pin ? (url.searchParams.get("q") ?? url.searchParams.get("query")) : null;

  return {
    isShort: false,
    name: name ?? (queryName?.trim() || null),
    pin,
    viewport,
  };
}

/** Сама ссылка Карт из поля «Где» (даже если вокруг неё текст); не Карты — null. */
export function mapsUrlFrom(raw: string): string | null {
  const url = toUrl(raw);
  return url && isMapsUrl(url) ? url.toString() : null;
}

/** Похоже ли содержимое поля «Где» на ссылку (любую), а не на адрес текстом. */
export function looksLikeUrl(raw: string): boolean {
  const trimmed = raw.trim();
  return (
    /^https?:\/\//i.test(trimmed) || /^(maps\.app\.goo\.gl|goo\.gl)\//i.test(trimmed)
  );
}
