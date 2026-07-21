import { computeEventStatus } from "@/lib/events/event-lifecycle";

type SortableActivity = {
  type: string;
  startDate: Date | string | null;
  endDate: Date | string | null;
};

/**
 * Актуально ли занятие сейчас. Регулярные (COURSE) — всегда: они постоянны.
 * Лагерь (CAMP) — пока не прошёл (идёт/скоро); прошедший уходит вниз ленты.
 *
 * Даты нормализуем через new Date(): маппер их уже оживляет, но страховка
 * дешёвая — сравнение строки с Date даёт NaN, и «будущий» лагерь молча
 * считался бы «прошедшим» (находка ревью кэш-пакета 07.2026).
 */
export function isActivityActive(activity: SortableActivity, now: Date): boolean {
  if (activity.type !== "CAMP") {
    return true;
  }
  if (!activity.startDate) {
    return true;
  }
  return (
    computeEventStatus(
      new Date(activity.startDate),
      activity.endDate ? new Date(activity.endDate) : null,
      now,
    ) !== "past"
  );
}

/** Ранг сортировки ленты: активные (0) выше прошедших лагерей (1). Внутри ранга
 *  порядок сохраняется (стабильная сортировка по order/имени из запроса). */
export function activitySortRank(activity: SortableActivity, now: Date): number {
  return isActivityActive(activity, now) ? 0 : 1;
}
