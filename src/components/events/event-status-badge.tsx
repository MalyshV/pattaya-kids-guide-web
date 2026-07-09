import type { EventLifecycle } from "@/lib/events/event-lifecycle";
import { getDictionary } from "@/content/dictionary";

type EventStatusBadgeProps = {
  status?: EventLifecycle;
  /** язык страницы (подписи статуса) */
  lang?: string;
  /** Класс обёртки (отступы места использования); без него — голая пилюля. */
  wrapperClassName?: string;
};

/**
 * Статус события тем же визуальным языком, что и статус места: «Сейчас идёт» —
 * sage, «Уже прошло» — muted. Для предстоящих ничего не рисуем — даты и так
 * видны рядом.
 */
export function EventStatusBadge({
  status,
  lang = "ru",
  wrapperClassName,
}: EventStatusBadgeProps): React.ReactElement | null {
  if (status !== "ongoing" && status !== "past") {
    return null;
  }

  const dict = getDictionary(lang);
  const pill = (
    <span
      className={`open-status ${
        status === "ongoing" ? "open-status-open" : "open-status-closed"
      }`}
    >
      {status === "ongoing" ? dict.eventCard.statusOngoing : dict.eventCard.statusPast}
    </span>
  );

  if (!wrapperClassName) {
    return pill;
  }

  return <div className={wrapperClassName}>{pill}</div>;
}
