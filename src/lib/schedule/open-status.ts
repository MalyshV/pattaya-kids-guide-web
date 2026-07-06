/**
 * Живой индикатор «открыто сейчас» — считается на сервере на момент запроса,
 * по расписанию места и таймзоне города. Чистые функции, все пороги — здесь.
 *
 * Принципы (см. docs/SMART_FILTERS_PLAN.md):
 *  - недооценка безопаснее переоценки (доверие): «~N ч» через Math.floor,
 *    и только когда времени с запасом (≥ OPEN_LONG_MIN);
 *  - спокойно, без «!» и красного — тон задаёт UI;
 *  - нет данных → молчим (unknown), не выдумываем.
 */

/** ≤ этого до закрытия — «Скоро закрытие» (минуты). */
export const CLOSING_SOON_MIN = 90;
/** ≥ этого до закрытия — показываем «Открыто ещё ~N ч» (минуты). */
export const OPEN_LONG_MIN = 120;

export type OpenStatus =
  | { kind: "open"; hoursLeft: number | null }
  | { kind: "closingSoon" }
  | { kind: "opensLater"; opensAt: string }
  | { kind: "closedToday" }
  | { kind: "unknown" };

/** Один интервал расписания (как в БД). day — enum DayOfWeek. */
export type ScheduleInput = {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

const WEEKDAY_TO_ENUM: Record<string, string> = {
  Mon: "MON",
  Tue: "TUE",
  Wed: "WED",
  Thu: "THU",
  Fri: "FRI",
  Sat: "SAT",
  Sun: "SUN",
};

type CityNow = {
  day: string;
  minutes: number;
};

/** "HH:MM" → минуты от полуночи, либо null если формат неожиданный. */
function parseHhMm(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return null;
  }
  return hours * 60 + minutes;
}

/**
 * Текущий день недели (enum) и минуты от полуночи в таймзоне города.
 * Через Intl — без сторонних библиотек; weekday маппится явной таблицей.
 */
export function nowInCity(timezone: string, now: Date = new Date()): CityNow {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  let weekday = "Mon";
  let hour = 0;
  let minute = 0;

  for (const part of formatter.formatToParts(now)) {
    if (part.type === "weekday") {
      weekday = part.value;
    } else if (part.type === "hour") {
      // Intl может отдать "24" в полночь при hour12:false — нормализуем в 0
      hour = Number(part.value) % 24;
    } else if (part.type === "minute") {
      minute = Number(part.value);
    }
  }

  return {
    day: WEEKDAY_TO_ENUM[weekday] ?? "MON",
    minutes: hour * 60 + minute,
  };
}

/**
 * Статус места «прямо сейчас». Возвращает unknown, если расписания нет —
 * тогда UI ничего не показывает.
 */
export function computeOpenStatus(
  schedules: ScheduleInput[],
  timezone: string,
  now: Date = new Date(),
): OpenStatus {
  if (schedules.length === 0) {
    return { kind: "unknown" };
  }

  const { day, minutes } = nowInCity(timezone, now);

  const todays = schedules
    .filter((s) => s.day === day && !s.isClosed)
    .map((s) => ({
      open: parseHhMm(s.openTime),
      close: parseHhMm(s.closeTime),
      openStr: s.openTime,
    }))
    .filter(
      (s): s is { open: number; close: number; openStr: string } =>
        s.open !== null && s.close !== null && s.close > s.open,
    )
    .sort((a, b) => a.open - b.open);

  if (todays.length === 0) {
    return { kind: "closedToday" };
  }

  for (const interval of todays) {
    if (minutes >= interval.open && minutes < interval.close) {
      const minutesLeft = interval.close - minutes;
      if (minutesLeft <= CLOSING_SOON_MIN) {
        return { kind: "closingSoon" };
      }
      if (minutesLeft >= OPEN_LONG_MIN) {
        return { kind: "open", hoursLeft: Math.floor(minutesLeft / 60) };
      }
      return { kind: "open", hoursLeft: null };
    }
  }

  const next = todays.find((interval) => interval.open > minutes);
  if (next) {
    return { kind: "opensLater", opensAt: next.openStr };
  }

  return { kind: "closedToday" };
}

/** Позитивный статус — показываем в списке мест (в деталях показываем всё). */
export function isPositiveStatus(status: OpenStatus): boolean {
  return (
    status.kind === "open" ||
    status.kind === "closingSoon" ||
    status.kind === "opensLater"
  );
}
