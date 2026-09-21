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
/**
 * ≤ этого до открытия — место попадает в сценарий «Пойти сейчас»: пока
 * собираешься и едешь, оно как раз откроется. Одна константа — легко поменять.
 */
export const OPENING_SOON_MIN = 30;
/**
 * Открытие не позже этого времени (минуты от полуночи) = место «работает с
 * утра» (сценарий «Открыто с утра»). 9:00 — из видения продукта; одна
 * константа, легко поменять на 10:00, если по данным утренних мест мало.
 */
export const MORNING_THRESHOLD_MIN = 9 * 60;

export type OpenStatus =
  | { kind: "open"; hoursLeft: number | null }
  | { kind: "closingSoon" }
  | { kind: "opensLater"; opensAt: string; minutesUntilOpen: number }
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

const DAY_MIN = 24 * 60;
const DAY_ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/** День недели (enum), сдвинутый на delta дней; неизвестный день — как есть. */
function shiftDay(day: string, delta: number): string {
  const index = DAY_ORDER.indexOf(day);
  if (index === -1) {
    return day;
  }
  return DAY_ORDER[(((index + delta) % 7) + 7) % 7];
}

/**
 * Рабочий интервал дня в минутах от начала ЭТОГО дня. Закрытие не позже
 * открытия = работа через полночь: «10:00–00:00» → close 1440 (конец суток),
 * «20:00–02:00» → close 1560 (02:00 следующего дня), «00:00–00:00» →
 * круглые сутки. Поэтому close может быть больше DAY_MIN.
 */
type Interval = {
  open: number;
  close: number;
  openStr: string;
  closeStr: string;
};

function intervalsOn(schedules: ScheduleInput[], day: string): Interval[] {
  const result: Interval[] = [];
  for (const s of schedules) {
    if (s.day !== day || s.isClosed) {
      continue;
    }
    const open = parseHhMm(s.openTime);
    const close = parseHhMm(s.closeTime);
    if (open === null || close === null) {
      continue;
    }
    result.push({
      open,
      close: close <= open ? close + DAY_MIN : close,
      openStr: s.openTime,
      closeStr: s.closeTime,
    });
  }
  return result.sort((a, b) => a.open - b.open);
}

/**
 * Окно, которое открыто в момент minutes (минуты от начала сегодняшнего дня).
 * Сначала — «хвост» вчерашнего интервала через полночь (в 01:00 место с
 * часами 20:00–02:00 открыто по вчерашнему расписанию, даже если сегодня у
 * него выходной), затем — сегодняшние интервалы. close — на оси сегодняшнего
 * дня; круглосуточные дни подряд склеиваются, чтобы в 23:00 не было ложного
 * «скоро закрытие».
 */
function currentWindow(
  schedules: ScheduleInput[],
  day: string,
  minutes: number,
): { close: number; closeStr: string } | null {
  const tail = intervalsOn(schedules, shiftDay(day, -1)).find(
    (interval) => minutes < interval.close - DAY_MIN,
  );
  const todays = intervalsOn(schedules, day).find(
    (interval) => minutes >= interval.open && minutes < interval.close,
  );
  const found = tail
    ? { close: tail.close - DAY_MIN, closeStr: tail.closeStr }
    : todays
      ? { close: todays.close, closeStr: todays.closeStr }
      : null;
  if (!found) {
    return null;
  }

  // склейка: закрылось ровно в полночь, а следующий день открывается в 00:00
  for (let k = 1; k <= 7 && found.close === k * DAY_MIN; k += 1) {
    const next = intervalsOn(schedules, shiftDay(day, k)).find(
      (interval) => interval.open === 0,
    );
    if (!next) {
      break;
    }
    found.close = k * DAY_MIN + next.close;
    found.closeStr = next.closeStr;
  }
  return found;
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

  const current = currentWindow(schedules, day, minutes);
  if (current) {
    const minutesLeft = current.close - minutes;
    if (minutesLeft <= CLOSING_SOON_MIN) {
      return { kind: "closingSoon" };
    }
    // сутки и больше (круглосуточно) — «~30 ч» звучит странно, просто «открыто»
    if (minutesLeft >= OPEN_LONG_MIN && minutesLeft < DAY_MIN) {
      return { kind: "open", hoursLeft: Math.floor(minutesLeft / 60) };
    }
    return { kind: "open", hoursLeft: null };
  }

  const next = intervalsOn(schedules, day).find((interval) => interval.open > minutes);
  if (next) {
    return {
      kind: "opensLater",
      opensAt: next.openStr,
      minutesUntilOpen: next.open - minutes,
    };
  }

  return { kind: "closedToday" };
}

/**
 * До скольки место работает «сегодня» — для подсказки «сегодня до …» на
 * странице места. Если открыто сейчас — время закрытия текущего окна (в 01:00
 * при часах 20:00–02:00 это «02:00»). Иначе — самое позднее закрытие
 * сегодняшних интервалов, считая полночь концом суток, а не началом
 * (строковая сортировка ставила «00:00» первым). Нет часов — null.
 */
export function todayClosingTime(
  schedules: ScheduleInput[],
  timezone: string,
  now: Date = new Date(),
): string | null {
  const { day, minutes } = nowInCity(timezone, now);
  const current = currentWindow(schedules, day, minutes);
  if (current) {
    return current.closeStr;
  }
  const latest = intervalsOn(schedules, day).reduce<Interval | null>(
    (best, interval) => (best === null || interval.close > best.close ? interval : best),
    null,
  );
  return latest?.closeStr ?? null;
}

/**
 * Место открыто / скоро откроется сегодня. Используется для сценарного смысла
 * «сейчас можно пойти». Карточка и детали показывают все статусы честно (кроме
 * unknown).
 */
export function isPositiveStatus(status: OpenStatus): boolean {
  return (
    status.kind === "open" ||
    status.kind === "closingSoon" ||
    status.kind === "opensLater"
  );
}

/**
 * Сценарий «Пойти сейчас»: двери открыты прямо сейчас (в т.ч. «скоро закрытие» —
 * оно всё ещё открыто), либо место откроется в ближайшие OPENING_SOON_MIN минут.
 * «Откроется позже сегодня» сюда НЕ входит — это отдельный сценарий («Открыто с
 * утра»). Нет расписания (unknown) — не обещаем, честно прячем.
 */
export function isGoNowStatus(status: OpenStatus): boolean {
  if (status.kind === "open" || status.kind === "closingSoon") {
    return true;
  }
  if (status.kind === "opensLater") {
    return status.minutesUntilOpen <= OPENING_SOON_MIN;
  }
  return false;
}

/**
 * Сценарий «Открыто с утра»: сегодня у места есть рабочий интервал, который
 * открывается не позже MORNING_THRESHOLD_MIN (к 9:00). В отличие от «Пойти
 * сейчас» не зависит от текущей минуты — это про раннее открытие сегодня
 * (родитель планирует утро). Сегодня выходной / нет расписания → false (честно
 * не обещаем «утреннее», раз сегодня не работает).
 */
export function opensEarlyToday(
  schedules: ScheduleInput[],
  timezone: string,
  now: Date = new Date(),
): boolean {
  if (schedules.length === 0) {
    return false;
  }

  const { day } = nowInCity(timezone, now);

  return schedules.some((s) => {
    if (s.day !== day || s.isClosed) {
      return false;
    }
    const open = parseHhMm(s.openTime);
    return open !== null && open <= MORNING_THRESHOLD_MIN;
  });
}

/**
 * Ранг для сортировки списка мест: сначала открытые/скоро откроются (0), затем
 * закрытые сегодня (1), затем места без расписания (2). Внутри одного ранга
 * порядок сохраняется (стабильная сортировка по имени).
 */
export function statusSortRank(status: OpenStatus): number {
  if (isPositiveStatus(status)) {
    return 0;
  }
  return status.kind === "unknown" ? 2 : 1;
}
