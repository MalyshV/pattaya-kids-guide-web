/**
 * Чистое ядро движка данных: Google Place → «скелет» нашего места.
 *
 * Скелет — это только проверяемые у Google факты (название/адрес/координаты/
 * часы/телефон/сайт). Уникальную ценность (описание, tri-state признаки,
 * советы, цены, Thai-price) движок НЕ выдумывает — она остаётся ручной
 * (см. docs/DATA_ENGINE.md): AI ~70% скелета, человек ~30% ценности.
 * Всё здесь — чистые функции без сети и БД, покрыты vitest.
 */

import type { DayOfWeek } from "@prisma/client";
import type { GoogleOpeningPeriod, GooglePlace } from "./google-places-types";

/// Google нумерует дни 0=воскресенье … 6=суббота
const GOOGLE_DAY_TO_ENUM: readonly DayOfWeek[] = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

export type SkeletonSchedule = {
  day: DayOfWeek;
  openTime: string;
  closeTime: string;
  isClosed: false;
};

export type SkeletonContact = {
  type: "phone" | "website";
  value: string;
};

/// «скелет» места: только то, что Google знает достоверно.
/// Ничего про описание/признаки/цены — их заполняет человек.
export type PlaceSkeleton = {
  googlePlaceId: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
  schedules: SkeletonSchedule[];
  contacts: SkeletonContact[];
  /// подсказка модератору, в наши категории не мапится
  googleTypes: string[];
};

function formatTime(hour: number, minute: number): string {
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Периоды Google → строки нашего PlaceSchedule.
 * Поддержано: несколько интервалов в день (у нас разрешено уникальностью
 * [placeId, day, openTime]); круглосуточно (Google шлёт один период с open
 * day=0 00:00 БЕЗ close → все 7 дней 00:00–23:59); интервал через полночь
 * честно приписывается дню открытия (закрытие «01:00» останется строкой —
 * для детских мест это редкость, модератор увидит и поправит).
 * Дубли (день, время открытия) схлопываются — иначе упрётся в unique-индекс.
 */
export function openingHoursToSchedules(
  periods: GoogleOpeningPeriod[] | undefined,
): SkeletonSchedule[] {
  if (!periods || periods.length === 0) {
    return [];
  }

  // круглосуточный режим: единственный период без close
  if (periods.length === 1 && periods[0] && !periods[0].close) {
    return GOOGLE_DAY_TO_ENUM.map((day) => ({
      day,
      openTime: "00:00",
      closeTime: "23:59",
      isClosed: false as const,
    }));
  }

  const seen = new Set<string>();
  const schedules: SkeletonSchedule[] = [];

  for (const period of periods) {
    const open = period.open;
    const close = period.close;
    if (!open || !close) {
      // одиночный open без close вне кейса 24/7 — некорректные данные, пропускаем
      continue;
    }
    const day = GOOGLE_DAY_TO_ENUM[open.day];
    if (!day) {
      continue;
    }
    const openTime = formatTime(open.hour, open.minute);
    const key = `${day}-${openTime}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    schedules.push({
      day,
      openTime,
      closeTime: formatTime(close.hour, close.minute),
      isClosed: false,
    });
  }

  // стабильный порядок: по дню недели, затем по времени открытия
  return schedules.sort((a, b) => {
    const dayDiff = GOOGLE_DAY_TO_ENUM.indexOf(a.day) - GOOGLE_DAY_TO_ENUM.indexOf(b.day);
    return dayDiff !== 0 ? dayDiff : a.openTime.localeCompare(b.openTime);
  });
}

/**
 * Базовый slug из названия: NFKD-свёртка диакритики (Café → cafe), апострофы
 * удаляются (Kids' → kids), остальное не-[a-z0-9] → дефис. Не-латиница
 * (тайский/кириллица) выпадает; если после чистки пусто — fallback "place"
 * (занятость и суффиксы -2/-3 решает вызывающий код по базе).
 */
export function slugifyPlaceName(name: string): string {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "place";
}

export type MapsUrlQuery = {
  /// человекочитаемое название места из сегмента /maps/place/<NAME>/
  query: string;
  latitude: number | null;
  longitude: number | null;
};

/**
 * Ссылка на карточку Google Maps (какие Вероника собирает по чек-листу) →
 * поисковый запрос + координаты для locationBias. Place ID в таких ссылках
 * не лежит (там внутренний FTID), поэтому идём через Text Search.
 * Не похоже на ссылку карточки → null.
 */
export function parseGoogleMapsUrl(url: string): MapsUrlQuery | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!/(^|\.)google\.[a-z.]+$/.test(parsed.hostname)) {
    return null;
  }
  const match = parsed.pathname.match(/\/maps\/place\/([^/]+)/);
  if (!match || !match[1]) {
    return null;
  }
  let query: string;
  try {
    query = decodeURIComponent(match[1]).replace(/\+/g, " ").trim();
  } catch {
    return null;
  }
  if (!query) {
    return null;
  }

  const coords = parsed.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  const latitude = coords?.[1] ? Number(coords[1]) : null;
  const longitude = coords?.[2] ? Number(coords[2]) : null;

  return { query, latitude, longitude };
}

/**
 * Google Place → скелет. Обязательный минимум — id и название (без них
 * запись бессмысленна: нечем дедупить/нечего показать) → null.
 * Телефон: приоритет национальному формату (так пишем контакты в каталоге,
 * напр. «087 834 4455»), fallback — международный.
 */
export function mapGooglePlaceToSkeleton(place: GooglePlace): PlaceSkeleton | null {
  const id = place.id?.trim();
  const name = place.displayName?.text?.replace(/\s+/g, " ").trim();
  if (!id || !name) {
    return null;
  }

  const contacts: SkeletonContact[] = [];
  const phone = place.nationalPhoneNumber || place.internationalPhoneNumber;
  if (phone) {
    contacts.push({ type: "phone", value: phone.trim() });
  }
  if (place.websiteUri) {
    contacts.push({ type: "website", value: place.websiteUri.trim() });
  }

  return {
    googlePlaceId: id,
    name,
    address: place.formattedAddress?.trim() || null,
    latitude: place.location?.latitude ?? null,
    longitude: place.location?.longitude ?? null,
    googleMapsUrl: place.googleMapsUri?.trim() || null,
    schedules: openingHoursToSchedules(place.regularOpeningHours?.periods),
    contacts,
    googleTypes: place.types ?? [],
  };
}
