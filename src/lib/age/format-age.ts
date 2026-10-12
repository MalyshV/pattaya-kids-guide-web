import { plural } from "@/lib/plural";

/** До этого возраста (в месяцах) пишем месяцы, дальше — годы. */
const YEARS_FROM_MONTHS = 24;

/**
 * Возраст в месяцах → части подписи. Годы с 2 лет: целые («3»), полтора
 * («2,5») и «год + месяцы» для остальных (27 мес → 2 года 3 мес), чтобы не
 * округлять и не терять точность.
 */
type AgeParts =
  | { kind: "months"; months: number }
  | { kind: "years"; years: number }
  | { kind: "half"; years: number }
  | { kind: "mixed"; years: number; months: number };

function ageParts(totalMonths: number): AgeParts {
  if (totalMonths < YEARS_FROM_MONTHS) {
    return { kind: "months", months: totalMonths };
  }
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (months === 0) {
    return { kind: "years", years };
  }
  if (months === 6) {
    return { kind: "half", years };
  }
  return { kind: "mixed", years, months };
}

/** Возраст в месяцах → «N мес» / «N года» / «N,5 года» (именительный: 2 года, 12 лет). */
function ageLabelRu(totalMonths: number): string {
  const parts = ageParts(totalMonths);
  switch (parts.kind) {
    case "months":
      return `${parts.months} мес`;
    case "years":
      return `${parts.years} ${plural(parts.years, ["год", "года", "лет"])}`;
    case "half":
      return `${parts.years},5 года`;
    case "mixed":
      return `${parts.years} ${plural(parts.years, ["год", "года", "лет"])} ${parts.months} мес`;
  }
}

/** Родительный падеж (после «до»/«от»): до 3 лет, от 2,5 года, от 21 года. */
function ageLabelGenitiveRu(totalMonths: number): string {
  const parts = ageParts(totalMonths);
  switch (parts.kind) {
    case "months":
      return `${parts.months} мес`;
    case "years":
      return `${parts.years} ${plural(parts.years, ["года", "лет", "лет"])}`;
    case "half":
      return `${parts.years},5 года`;
    case "mixed":
      return `${parts.years} ${plural(parts.years, ["года", "лет", "лет"])} ${parts.months} мес`;
  }
}

/** English age label: "4 months", "2.5 years", "2 years 3 months". */
function ageLabelEn(totalMonths: number): string {
  const parts = ageParts(totalMonths);
  const years = (n: number) => `${n} ${n === 1 ? "year" : "years"}`;
  switch (parts.kind) {
    case "months":
      return `${parts.months} ${parts.months === 1 ? "month" : "months"}`;
    case "years":
      return years(parts.years);
    case "half":
      return `${parts.years}.5 years`;
    case "mixed":
      return `${years(parts.years)} ${parts.months} ${parts.months === 1 ? "month" : "months"}`;
  }
}

/** Тайский возраст: «4 เดือน» (месяцы), «3 ขวบ» (годы; ขวบ — счёт лет
 *  именно детского возраста, для гида это все наши диапазоны). */
function ageLabelTh(totalMonths: number): string {
  const parts = ageParts(totalMonths);
  switch (parts.kind) {
    case "months":
      return `${parts.months} เดือน`;
    case "years":
      return `${parts.years} ขวบ`;
    case "half":
      return `${parts.years}.5 ขวบ`;
    case "mixed":
      return `${parts.years} ขวบ ${parts.months} เดือน`;
  }
}

/** Возраст в месяцах → читаемая подпись («18 мес», «2,5 года», «10 лет»). */
export function formatAge(months: number, lang: string = "ru"): string {
  if (lang === "en") {
    return ageLabelEn(months);
  }
  if (lang === "th") {
    return ageLabelTh(months);
  }
  return ageLabelRu(months);
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
