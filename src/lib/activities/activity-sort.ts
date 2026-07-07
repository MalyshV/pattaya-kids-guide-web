import { computeEventStatus } from "@/lib/events/event-lifecycle";

type SortableActivity = {
  type: string;
  startDate: Date | null;
  endDate: Date | null;
};

/**
 * Актуально ли занятие сейчас. Регулярные (COURSE) — всегда: они постоянны.
 * Лагерь (CAMP) — пока не прошёл (идёт/скоро); прошедший уходит вниз ленты.
 */
export function isActivityActive(activity: SortableActivity, now: Date): boolean {
  if (activity.type !== "CAMP") {
    return true;
  }
  if (!activity.startDate) {
    return true;
  }
  return computeEventStatus(activity.startDate, activity.endDate, now) !== "past";
}

/** Ранг сортировки ленты: активные (0) выше прошедших лагерей (1). Внутри ранга
 *  порядок сохраняется (стабильная сортировка по order/имени из запроса). */
export function activitySortRank(activity: SortableActivity, now: Date): number {
  return isActivityActive(activity, now) ? 0 : 1;
}
