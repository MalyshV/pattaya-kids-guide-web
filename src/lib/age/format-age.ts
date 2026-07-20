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

/** Тайский возраст: «4 เดือน» (месяцы), «3 ขวบ» (годы; ขวบ — счёт лет
 *  именно детского возраста, для гида это все наши диапазоны). */
function ageLabelTh(months: number): string {
  if (months < 12) {
    return `${months} เดือน`;
  }
  return `${Math.round(months / 12)} ขวบ`;
}

/** «с N лет / с N мес» — возраст, с которого что-то доступно (напр. можно
 *  оставить ребёнка). EN: "from 3 years". TH: «ตั้งแต่ 3 ขวบ». */
export function fromAgeLabel(months: number, lang: string = "ru"): string {
  if (lang === "en") {
    return `from ${ageLabelEn(months)}`;
  }
  if (lang === "th") {
    return `ตั้งแต่ ${ageLabelTh(months)}`;
  }
  return `с ${ageLabelGenitiveRu(months)}`;
}

/**
 * Возрастной диапазон занятия в читаемом виде: «до 3 лет», «4 мес – 12 лет»,
 * «от 6 лет» / "up to 3 years" / «ไม่เกิน 3 ขวบ», «ตั้งแต่ 6 ขวบ».
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

  const label = lang === "en" ? ageLabelEn : lang === "th" ? ageLabelTh : ageLabelRu;
  // «до/от» требуют родительного падежа только в русском
  const genitive =
    lang === "en" ? ageLabelEn : lang === "th" ? ageLabelTh : ageLabelGenitiveRu;
  const upTo = lang === "en" ? "up to" : lang === "th" ? "ไม่เกิน" : "до";
  const from = lang === "en" ? "from" : lang === "th" ? "ตั้งแต่" : "от";

  if ((minMonths == null || minMonths <= 0) && maxMonths != null) {
    return `${upTo} ${genitive(maxMonths)}`;
  }
  if (minMonths != null && maxMonths == null) {
    return `${from} ${genitive(minMonths)}`;
  }
  return `${label(minMonths as number)} – ${label(maxMonths as number)}`;
}
