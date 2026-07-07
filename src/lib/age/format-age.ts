import { plural } from "@/lib/plural";

/** Возраст в месяцах → «N мес» / «N лет» (именительный: 1 год, 3 года, 12 лет). */
function ageLabel(months: number): string {
  if (months < 12) {
    return `${months} мес`;
  }
  const years = Math.round(months / 12);
  return `${years} ${plural(years, ["год", "года", "лет"])}`;
}

/** Родительный падеж (после «до»/«от»): до 1 года, до 3 лет, от 6 лет. */
function ageLabelGenitive(months: number): string {
  if (months < 12) {
    return `${months} мес`;
  }
  const years = Math.round(months / 12);
  return `${years} ${years === 1 ? "года" : "лет"}`;
}

/** «с N лет / с N мес» — возраст, с которого что-то доступно (напр. можно
 *  оставить ребёнка под присмотром). */
export function fromAgeLabel(months: number): string {
  return `с ${ageLabelGenitive(months)}`;
}

/**
 * Возрастной диапазон занятия в читаемом виде: «до 3 лет», «4 мес – 12 лет»,
 * «от 6 лет». null, если возраст не задан (карточка секцию не покажет).
 */
export function formatAgeRange(
  minMonths: number | null,
  maxMonths: number | null,
): string | null {
  if (minMonths == null && maxMonths == null) {
    return null;
  }
  if ((minMonths == null || minMonths <= 0) && maxMonths != null) {
    return `до ${ageLabelGenitive(maxMonths)}`;
  }
  if (minMonths != null && maxMonths == null) {
    return `от ${ageLabelGenitive(minMonths)}`;
  }
  return `${ageLabel(minMonths as number)} – ${ageLabel(maxMonths as number)}`;
}
