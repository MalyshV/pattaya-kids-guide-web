/**
 * Дни и недели для «Моего плана» — чистые функции над строкой дня «YYYY-MM-DD».
 *
 * День — календарный день Паттайи (UTC+7), без времени: план читают родители
 * в Паттайе, а сервер живёт в UTC. Поэтому «сегодня» берём явно в поясе
 * Паттайи, а арифметику дней ведём в UTC по самой строке — так результат не
 * зависит от пояса машины, где считается.
 */

const PATTAYA_TZ = "Asia/Bangkok";
const DAY_MS = 24 * 60 * 60 * 1000;

/** Строка похожа на день и такой день существует (не 2026-02-31). */
export function isDayString(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** «Сегодня» в Паттайе для момента now. */
export function pattayaToday(now: Date): string {
  // sv-SE даёт «YYYY-MM-DD»
  return now.toLocaleDateString("sv-SE", {
    timeZone: PATTAYA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/** День как полночь UTC — только для форматирования и арифметики. */
export function dayToUtcDate(day: string): Date {
  return new Date(`${day}T00:00:00Z`);
}

/** Сдвинуть день на delta суток (может быть отрицательным). */
export function shiftDay(day: string, delta: number): string {
  return new Date(dayToUtcDate(day).getTime() + delta * DAY_MS)
    .toISOString()
    .slice(0, 10);
}

/** Семь дней недели (с понедельника по воскресенье), в которую попадает day. */
export function weekDays(day: string): string[] {
  // getUTCDay: воскресенье = 0 → в нашей неделе оно седьмое
  const weekday = (dayToUtcDate(day).getUTCDay() + 6) % 7;
  const monday = shiftDay(day, -weekday);
  return Array.from({ length: 7 }, (_, index) => shiftDay(monday, index));
}

/** count дней подряд, начиная с day, — выбор «на какой день» в кнопке «В план». */
export function daysFrom(day: string, count: number): string[] {
  return Array.from({ length: count }, (_, index) => shiftDay(day, index));
}

/**
 * Подпись недели для заголовка: «9–15 ноября», а на стыке месяцев —
 * «30 ноября – 6 декабря». locale — как у остальных дат сайта (dateLocale).
 */
export function weekRangeLabel(days: readonly string[], locale: string): string {
  const first = days[0];
  const last = days[days.length - 1];
  if (!first || !last) {
    return "";
  }
  const dayMonth = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  if (first.slice(0, 7) === last.slice(0, 7)) {
    return `${dayToUtcDate(first).getUTCDate()}–${dayMonth.format(dayToUtcDate(last))}`;
  }
  return `${dayMonth.format(dayToUtcDate(first))} – ${dayMonth.format(dayToUtcDate(last))}`;
}

/** Короткий день недели («вт», "Tue") и число месяца — для строки дня. */
export function dayParts(day: string, locale: string): { weekday: string; date: number } {
  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC",
  }).format(dayToUtcDate(day));
  return { weekday, date: dayToUtcDate(day).getUTCDate() };
}
