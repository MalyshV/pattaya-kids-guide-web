import { plural } from "@/lib/plural";

/** Возраст в месяцах → «N мес» / «N лет» (именительный: 1 год, 3 года, 12 лет). */
function ageLabelRu(months: number): string {
  if (months < 12) {
    return `${months} мес`;
  }
  const years = Math.round(months / 12);
  return `${years} ${plural(years, ["год", "года", "лет"])}`;
}

/** Родительный падеж (после «до»/«от»): до 1 года, до 3 лет, от 6 лет. */
function ageLabelGenitiveRu(months: number): string {
  if (months < 12) {
    return `${months} мес`;
  }
  const years = Math.round(months / 12);
  return `${years} ${years === 1 ? "года" : "лет"}`;
}

/** English age label: "4 months", "1 year", "3 years". */
function ageLabelEn(months: number): string {
  if (months < 12) {
    return `${months} ${months === 1 ? "month" : "months"}`;
  }
  const years = Math.round(months / 12);
  return `${years} ${years === 1 ? "year" : "years"}`;
}

/** «с N лет / с N мес» — возраст, с которого что-то доступно (напр. можно
 *  оставить ребёнка). EN: "from 3 years". */
export function fromAgeLabel(months: number, lang: string = "ru"): string {
  if (lang === "en") {
    return `from ${ageLabelEn(months)}`;
  }
  return `с ${ageLabelGenitiveRu(months)}`;
}

/**
 * Возрастной диапазон занятия в читаемом виде: «до 3 лет», «4 мес – 12 лет»,
 * «от 6 лет» / "up to 3 years", "4 months – 12 years", "from 6 years".
 * null, если возраст не задан (карточка секцию не покажет).
 */
export function formatAgeRange(
  minMonths: number | null,
  maxMonths: number | null,
  lang: string = "ru",
): string | null {
  if (minMonths == null && maxMonths == null) {
    return null;
  }

  const isEn = lang === "en";
  const label = isEn ? ageLabelEn : ageLabelRu;
  const genitive = isEn ? ageLabelEn : ageLabelGenitiveRu;

  if ((minMonths == null || minMonths <= 0) && maxMonths != null) {
    return isEn ? `up to ${genitive(maxMonths)}` : `до ${genitive(maxMonths)}`;
  }
  if (minMonths != null && maxMonths == null) {
    return isEn ? `from ${genitive(minMonths)}` : `от ${genitive(minMonths)}`;
  }
  return `${label(minMonths as number)} – ${label(maxMonths as number)}`;
}
