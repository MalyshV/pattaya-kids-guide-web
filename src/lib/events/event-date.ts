import { dateLocale, type Dictionary } from "@/content/dictionary";
import type { EventLifecycle } from "@/lib/events/event-lifecycle";

/** День события коротко: «28 сент.» / «28 Sept» / «28 ก.ย.»; нет даты — null. */
export function formatEventDay(value: string | null, lang: string): string | null {
  if (!value) {
    return null;
  }
  return new Date(value).toLocaleDateString(dateLocale(lang), {
    day: "numeric",
    month: "short",
  });
}

/**
 * Когда событие — одной строкой для попапа карты: на карте нет карточки с
 * датами, и без пометки прошедшее легко принять за будущее.
 */
export function eventTimingNote(
  status: EventLifecycle | undefined,
  startDate: string | null,
  dict: Dictionary,
  lang: string,
): string {
  if (status === "ongoing") {
    return dict.eventCard.statusOngoing;
  }
  if (status === "past") {
    return dict.eventCard.statusPast;
  }
  const day = formatEventDay(startDate, lang);
  return day ? `${dict.eventCard.starts} ${day}` : dict.eventCard.dateTbd;
}
