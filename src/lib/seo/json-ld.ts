/**
 * Сборщики JSON-LD (schema.org) — чистые функции, без БД и запросов.
 *
 * Решения по моделированию (аудит 07.2026, пакет «structured data»):
 *  - Место — LocalBusiness: у Google есть карточки Local Business (адрес, часы,
 *    телефон, priceRange); TouristAttraction валиден, но карточек не даёт.
 *  - Событие — Event: право на event rich results (дата, место).
 *  - BreadcrumbList на детальных страницах (раздел → карточка).
 *  - WebSite на корне города БЕЗ SearchAction: поиск у нас клиентский,
 *    URL страницы результатов не существует — обещать его Google нельзя.
 *  - Принцип продукта «нет данных → молчим» действует и здесь: пустые поля
 *    не выдумываются, а опускаются (compact).
 */

export type JsonLdObject = Record<string, unknown>;

/**
 * Безопасная сериализация для <script type="application/ld+json">:
 * «<» экранируется в <, чтобы значение вида «</script>…» из данных
 * не могло закрыть тег и вставить разметку (стандартный приём Next/React).
 */
export function serializeJsonLd(data: JsonLdObject): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Убирает null/undefined/пустые массивы — JSON-LD без «мусорных» полей. */
function compact(obj: JsonLdObject): JsonLdObject {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (value === null || value === undefined) {
        return false;
      }
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }
      return true;
    }),
  );
}

// enum DayOfWeek БД → schema.org dayOfWeek
const DAY_TO_SCHEMA: Record<string, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

export type ScheduleRow = {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

/**
 * schedules БД → openingHoursSpecification. Дни с одинаковыми часами
 * группируются в один спец (dayOfWeek-массив) — так разметка компактнее и
 * так её показывает документация Google. Выходные (isClosed) и дни с
 * неизвестным enum пропускаются: отсутствие дня = закрыто.
 */
export function openingHoursSpecification(schedules: ScheduleRow[]): JsonLdObject[] {
  const byHours = new Map<string, { days: string[]; opens: string; closes: string }>();

  for (const row of schedules) {
    const day = DAY_TO_SCHEMA[row.day];
    if (!day || row.isClosed) {
      continue;
    }
    const key = `${row.openTime}–${row.closeTime}`;
    const group = byHours.get(key) ?? {
      days: [],
      opens: row.openTime,
      closes: row.closeTime,
    };
    group.days.push(day);
    byHours.set(key, group);
  }

  return [...byHours.values()].map((group) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: group.days,
    opens: group.opens,
    closes: group.closes,
  }));
}

/**
 * priceRange из известных цен входа: «60–135 ฿» или «100 ฿». Пустой список —
 * null (поле опустится): отсутствие цены честнее выдуманного диапазона.
 */
export function priceRange(prices: number[], currency: string): string | null {
  if (prices.length === 0) {
    return null;
  }
  const symbol = currency === "THB" ? "฿" : currency;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `${min} ${symbol}` : `${min}–${max} ${symbol}`;
}

export type PlaceJsonLdInput = {
  name: string;
  description: string | null;
  /** абсолютный канонический URL страницы */
  url: string;
  /** абсолютный URL обложки */
  image: string | null;
  streetAddress: string;
  cityName: string;
  latitude: number | null;
  longitude: number | null;
  telephone: string | null;
  schedules: ScheduleRow[];
  prices: number[];
  currency: string;
  inLanguage: string;
};

export function placeJsonLd(input: PlaceJsonLdInput): JsonLdObject {
  const geo =
    input.latitude != null && input.longitude != null
      ? {
          "@type": "GeoCoordinates",
          latitude: input.latitude,
          longitude: input.longitude,
        }
      : null;

  return compact({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.image,
    address: compact({
      "@type": "PostalAddress",
      streetAddress: input.streetAddress,
      addressLocality: input.cityName,
      addressCountry: "TH",
    }),
    geo,
    telephone: input.telephone,
    openingHoursSpecification: openingHoursSpecification(input.schedules),
    priceRange: priceRange(input.prices, input.currency),
    inLanguage: input.inLanguage,
  });
}

export type EventJsonLdInput = {
  name: string;
  description: string | null;
  url: string;
  image: string | null;
  /** ISO-строки как в DTO (UTC-инстант) */
  startDate: string;
  endDate: string | null;
  locationName: string | null;
  address: string | null;
  cityName: string;
  inLanguage: string;
};

export function eventJsonLd(input: EventJsonLdInput): JsonLdObject {
  // location обязателен для rich results; когда нет ни названия площадки, ни
  // адреса — поле опускается целиком (событие остаётся валидным Event)
  const locationLabel = input.locationName ?? input.address;
  const location = locationLabel
    ? compact({
        "@type": "Place",
        name: locationLabel,
        address: compact({
          "@type": "PostalAddress",
          streetAddress: input.address,
          addressLocality: input.cityName,
          addressCountry: "TH",
        }),
      })
    : null;

  return compact({
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.image,
    startDate: input.startDate,
    endDate: input.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    location,
    inLanguage: input.inLanguage,
  });
}

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export type WebsiteJsonLdInput = {
  name: string;
  url: string;
  inLanguage: string;
};

export function websiteJsonLd(input: WebsiteJsonLdInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    inLanguage: input.inLanguage,
  };
}

/** Относительный путь (/images/…) → абсолютный URL; готовый https остаётся. */
export function absoluteUrl(siteUrl: string, path: string | null): string | null {
  if (!path) {
    return null;
  }
  return /^https?:\/\//.test(path) ? path : `${siteUrl}${path}`;
}
