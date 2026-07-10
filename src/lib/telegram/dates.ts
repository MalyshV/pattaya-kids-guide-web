/**
 * Границы «дня в Паттайе» для подборок бота — чистые функции без БД.
 * Таиланд живёт по UTC+7 круглый год (перехода на летнее время нет),
 * поэтому границы дня можно считать фиксированным сдвигом.
 */

const BANGKOK_UTC_OFFSET_MS = 7 * 60 * 60 * 1000;

export function startOfBangkokDay(now: Date, addDays = 0): Date {
  const shifted = new Date(now.getTime() + BANGKOK_UTC_OFFSET_MS);
  return new Date(
    Date.UTC(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth(),
      shifted.getUTCDate() + addDays,
    ) - BANGKOK_UTC_OFFSET_MS,
  );
}

/** День недели в Паттайе: 0 = воскресенье … 6 = суббота. */
function bangkokWeekday(now: Date): number {
  return new Date(now.getTime() + BANGKOK_UTC_OFFSET_MS).getUTCDay();
}

/**
 * Окно ближайших выходных: с субботы 00:00 по воскресенье 24:00 (Паттайя).
 * Если сегодня суббота или воскресенье — окно начинается сегодня, чтобы
 * «в выходные» означало текущие выходные, а не следующие.
 */
export function weekendWindow(now: Date): { from: Date; to: Date } {
  const weekday = bangkokWeekday(now);

  if (weekday === 0) {
    return { from: startOfBangkokDay(now), to: startOfBangkokDay(now, 1) };
  }

  const daysUntilSaturday = (6 - weekday) % 7;
  const from = startOfBangkokDay(now, daysUntilSaturday);
  return { from, to: startOfBangkokDay(now, daysUntilSaturday + 2) };
}
