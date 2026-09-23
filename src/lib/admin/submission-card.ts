import type { SubmissionKind } from "@prisma/client";
import { safeExternalHref } from "@/lib/admin/submission-labels";
import { looksLikeUrl, mapsUrlFrom } from "@/lib/geo/maps-link";

/**
 * Предложение → карточка каталога: куда ведёт главная кнопка на странице
 * предложения и чем заранее заполняется форма.
 *
 * Пока заполняется только форма места (и «место для ДР» — это тоже место):
 * у события обязательна дата, а в поле «когда» лежит свободный текст, у
 * занятия в базе вовсе нет черновика. Для них кнопка просто открывает форму,
 * а поля Вероника переносит глазами — честнее, чем угадывать.
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
    label: "Открыть форму события",
    path: "/admin/events/new",
    prefilled: false,
  },
  ACTIVITY: {
    label: "Открыть форму занятия",
    path: "/admin/activities/new",
    prefilled: false,
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
