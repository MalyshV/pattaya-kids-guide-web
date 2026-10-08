"use client";

import { OpenStatusBadge } from "@/components/places/open-status-badge";
import {
  computeOpenStatus,
  type OpenStatus,
  type ScheduleInput,
} from "@/lib/schedule/open-status";
import { useMinuteClock } from "@/lib/schedule/use-minute-clock";
import { isClosureStatus } from "@/lib/places/closure";

type LiveOpenStatusBadgeProps = {
  /** статус, посчитанный сервером, — первый кадр и гидрация */
  initial: OpenStatus;
  schedules: ScheduleInput[];
  timezone: string;
  lang: string;
};

/**
 * Бейдж «открыто / закроется через N мин / откроется в …», который живёт,
 * пока вкладка открыта: раз в минуту пересчитывает статус по часам браузера
 * (решение Вероники 21.09 — «через 30 минут» не должно застывать).
 */
export function LiveOpenStatusBadge({
  initial,
  schedules,
  timezone,
  lang,
}: LiveOpenStatusBadgeProps): React.ReactElement | null {
  const minute = useMinuteClock();
  // закрытое на время/насовсем: расписание не пересчитываем — иначе через
  // минуту ремонтирующееся место «открылось» бы по часам
  const status =
    minute === null || isClosureStatus(initial)
      ? initial
      : computeOpenStatus(schedules, timezone, new Date(minute));

  return <OpenStatusBadge status={status} lang={lang} />;
}
