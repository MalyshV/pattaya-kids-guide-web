import type { SubmissionKind } from "@prisma/client";
import { ADMIN_FIELDS, type AdminField } from "@/lib/admin/field-limits";
import { safeExternalHref } from "@/lib/admin/submission-labels";
import { parseEventFlyer } from "@/lib/import/event-flyer";
import { looksLikeUrl, mapsUrlFrom } from "@/lib/geo/maps-link";

/**
 * Предложение → карточка каталога: куда ведёт главная кнопка на странице
 * предложения и чем заранее заполняется форма.
 *
 * Заполняются формы места (и «места для ДР» — это тоже место), события и
 * занятия. У события дату достаёт тот же разбор, что и у «Разобрать афишу»;
 * не достался — поле остаётся пустым, а присланный текст «когда» показывается
 * рядом: честнее, чем угадывать.
 */

export const CARD_TARGET = {
  PLACE: {
    label: "Создать карточку места",
    path: "/admin/places/new",
    prefilled: true,
  },
  BIRTHDAY: {
    label: "Создать карточку места",
    path: "/admin/places/new",
    prefilled: true,
  },
  EVENT: {
    label: "Создать карточку события",
    path: "/admin/events/new",
    prefilled: true,
  },
  ACTIVITY: {
    label: "Создать карточку занятия",
    path: "/admin/activities/new",
    prefilled: true,
  },
} as const satisfies Record<
  SubmissionKind,
  { label: string; path: string; prefilled: boolean }
>;

/** Адрес формы: с подстановкой полей — только там, где она есть. */
export function cardHref(kind: SubmissionKind, submissionId: string): string {
  const target = CARD_TARGET[kind];
  return target.prefilled
    ? `${target.path}?from=${encodeURIComponent(submissionId)}`
    : target.path;
}

export type PlacePrefill = {
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  googleMapsUrl: string;
};

export type SubmissionForPrefill = {
  name: string;
  tip: string | null;
  location: string;
  mapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
};

/**
 * Поля формы места из предложения. Координаты — строками: инпуты текстовые,
 * и лишнее приведение типов только теряет точность.
 */
export function placePrefill(submission: SubmissionForPrefill): PlacePrefill {
  const location = submission.location.trim();
  return {
    name: submission.name,
    description: submission.tip ?? "",
    // в «где» часто лежит ссылка Карт — в адрес её класть незачем,
    // она уйдёт в поле «ссылка на Google Карты» ниже
    address: looksLikeUrl(location) ? "" : location,
    latitude: submission.latitude === null ? "" : String(submission.latitude),
    longitude: submission.longitude === null ? "" : String(submission.longitude),
    // только ссылка Карт: в «где» бывает Instagram или сайт, а поле формы —
    // именно «ссылка на карточку Google Maps». Поле type="url", поэтому
    // непроверенная строка не дала бы отправить форму
    googleMapsUrl: safeExternalHref(submission.mapsUrl ?? mapsUrlFrom(location)) ?? "",
  };
}

/**
 * Текст в предел поля формы: подставленное из предложения не должно упереться
 * в проверку длины при сохранении. Не рвём суррогатную пару (эмодзи).
 */
export function clipToField(value: string, field: AdminField): string {
  const max = ADMIN_FIELDS[field].max;
  const trimmed = value.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  const code = trimmed.charCodeAt(max - 1);
  const cut = code >= 0xd800 && code <= 0xdbff ? max - 1 : max;
  return trimmed.slice(0, cut).trimEnd();
}

/** «Где» из предложения как текст площадки; ссылка — не текст, оставляем пусто. */
function venueText(location: string, field: AdminField): string {
  const trimmed = location.trim();
  return looksLikeUrl(trimmed) ? "" : clipToField(trimmed, field);
}

export type EventPrefill = {
  title: string;
  description: string;
  locationName: string;
  startDate: Date | null;
  endDate: Date | null;
  minAgeMonths: number | null;
  maxAgeMonths: number | null;
  /** присланное «когда» — показывается рядом с датой, пока та не проверена */
  whenText: string;
};

export type SubmissionForEventPrefill = Pick<
  SubmissionForPrefill,
  "name" | "tip" | "location"
> & { whenText: string | null };

/**
 * Поля формы события из предложения. Дату и возраст достаёт parseEventFlyer —
 * тот же разбор, что у «Разобрать афишу» в форме; ищет в «когда», затем в
 * подсказке (там бывает «для детей 4–8 лет»). now — параметром, как в парсере.
 */
export function eventPrefill(
  submission: SubmissionForEventPrefill,
  now: Date,
): EventPrefill {
  const whenText = (submission.whenText ?? "").trim();
  const draft = parseEventFlyer([whenText, submission.tip ?? ""].join("\n"), now);
  return {
    title: clipToField(submission.name, "title"),
    description: clipToField(submission.tip ?? "", "description"),
    locationName: venueText(submission.location, "locationName"),
    startDate: draft.startDate,
    endDate: draft.endDate,
    minAgeMonths: draft.minAgeMonths,
    maxAgeMonths: draft.maxAgeMonths,
    whenText,
  };
}

export type ActivityPrefill = {
  name: string;
  description: string;
  venueName: string;
};

/** Поля формы занятия из предложения. */
export function activityPrefill(
  submission: Pick<SubmissionForPrefill, "name" | "tip" | "location">,
): ActivityPrefill {
  return {
    name: clipToField(submission.name, "name"),
    description: clipToField(submission.tip ?? "", "description"),
    venueName: venueText(submission.location, "venueName"),
  };
}
