/**
 * День без времени в формах админки (<input type="date">), по Паттайе (UTC+7).
 * В базе день хранится полночью Паттайи, то есть 17:00 предыдущего дня по UTC.
 * Поэтому показывать его через toISOString нельзя: в поле попадал бы
 * предыдущий день, и каждое сохранение формы сдвигало бы дату на день назад.
 */

const PATTAYA_TZ = "Asia/Bangkok";

/** «2026-07-01» → полночь этого дня по Паттайе; пусто или мусор → null. */
export function parsePattayaDay(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00+07:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Date из базы → значение для <input type="date"> по Паттайе; нет даты → "". */
export function pattayaDayInputValue(value: Date | string | null | undefined): string {
  if (!value) {
    return "";
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  // sv-SE даёт «YYYY-MM-DD» — ровно формат поля date
  return date.toLocaleDateString("sv-SE", {
    timeZone: PATTAYA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
