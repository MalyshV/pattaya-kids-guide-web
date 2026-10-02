import { formatAgeRange } from "@/lib/age/format-age";
import { isTypoFix } from "@/lib/admin/tips";

/**
 * Таблица возрастных классов занятия (как у The Little Gym: Bugs 4–10 мес,
 * Birds 10–19 мес…) в форме админки: разбор строк формы и план изменений.
 * Чистая логика; в базу её кладёт lib/admin/class-rows-store.
 *
 * Строка считается классом, если у неё есть название. Строку без названия
 * пропускаем — так класс удаляют (стёрли название) и так живут пустые
 * строки «под новый класс» в конце таблицы.
 *
 * Сохранение бережное, как у советов: у класса есть тайские подписи, которых
 * в форме нет. Класс находим по id строки; тайское расписание остаётся, пока
 * русское не поменяли по смыслу (исправленная опечатка — не в счёт).
 */

export const CLASS_LIMITS = {
  /** столько классов у одного занятия — с запасом (у Little Gym их 8) */
  maxCount: 20,
  name: 100,
  ageLabel: 60,
  schedule: 300,
  /** 18 лет: детский гид, дальше — уже опечатка */
  maxAgeMonths: 216,
} as const;

/** сколько пустых строк «под новый класс» показывать под существующими */
export const EXTRA_CLASS_ROWS = 3;

export const CLASS_FIELDS = [
  "id",
  "name",
  "minAgeMonths",
  "maxAgeMonths",
  "ageLabel",
  "ageLabelEn",
  "parentRequired",
  "schedule",
  "scheduleEn",
] as const;
export type ClassField = (typeof CLASS_FIELDS)[number];

/** имя поля формы: class_0_name, class_1_schedule… */
export function classFieldName(index: number, field: ClassField): string {
  return `class_${index}_${field}`;
}

export type ClassRow = {
  /** id существующего класса; null — новая строка */
  id: string | null;
  name: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  ageLabel: string;
  ageLabelEn: string | null;
  parentRequired: boolean | null;
  schedule: string;
  scheduleEn: string | null;
};

export type ClassRowProblem = "age" | "schedule" | "tooLong" | "tooMany";

export type ClassRowsResult =
  | { ok: true; rows: ClassRow[] }
  /** row — номер строки с единицы, как видит человек */
  | { ok: false; row: number; problem: ClassRowProblem };

/**
 * Обычные пробелы и переводы строк схлопываем, а неразрывные пробелы не
 * трогаем: в расписаниях ими склеены цены («6 500 ฿»), чтобы число не
 * разрывалось переносом.
 */
function clean(value: string | null | undefined): string {
  return (value ?? "").replace(/[ \t\r\n]+/g, " ").replace(/^ +| +$/g, "");
}

function wholeMonths(raw: string): number | null {
  if (!/^\d+$/.test(raw)) {
    return null;
  }
  const value = Number(raw);
  return value <= CLASS_LIMITS.maxAgeMonths ? value : null;
}

/**
 * Строки формы → классы. Подпись возраста можно не писать — соберём из
 * месяцев («4 мес – 10 мес»); английскую — так же.
 */
export function parseClassRows(
  read: (index: number, field: ClassField) => string | null | undefined,
  rowCount: number,
): ClassRowsResult {
  const rows: ClassRow[] = [];
  const total = Math.min(Math.max(0, rowCount), CLASS_LIMITS.maxCount + EXTRA_CLASS_ROWS);

  for (let index = 0; index < total; index += 1) {
    const name = clean(read(index, "name"));
    if (!name) {
      continue;
    }
    const row = index + 1;
    if (rows.length >= CLASS_LIMITS.maxCount) {
      return { ok: false, row, problem: "tooMany" };
    }

    const min = wholeMonths(clean(read(index, "minAgeMonths")));
    const max = wholeMonths(clean(read(index, "maxAgeMonths")));
    if (min === null || max === null || min > max) {
      return { ok: false, row, problem: "age" };
    }
    const schedule = clean(read(index, "schedule"));
    if (!schedule) {
      return { ok: false, row, problem: "schedule" };
    }

    const ageLabel =
      clean(read(index, "ageLabel")) || (formatAgeRange(min, max, "ru") ?? "");
    const ageLabelEn = clean(read(index, "ageLabelEn")) || formatAgeRange(min, max, "en");
    const scheduleEn = clean(read(index, "scheduleEn")) || null;
    if (
      name.length > CLASS_LIMITS.name ||
      ageLabel.length > CLASS_LIMITS.ageLabel ||
      (ageLabelEn ?? "").length > CLASS_LIMITS.ageLabel ||
      schedule.length > CLASS_LIMITS.schedule ||
      (scheduleEn ?? "").length > CLASS_LIMITS.schedule
    ) {
      return { ok: false, row, problem: "tooLong" };
    }

    const parent = clean(read(index, "parentRequired"));
    rows.push({
      id: clean(read(index, "id")) || null,
      name,
      minAgeMonths: min,
      maxAgeMonths: max,
      ageLabel,
      ageLabelEn,
      parentRequired: parent === "true" ? true : parent === "false" ? false : null,
      schedule,
      scheduleEn,
    });
  }

  return { ok: true, rows };
}

export type ExistingClass = {
  id: string;
  ageLabel: string;
  ageLabelTh: string | null;
  minAgeMonths: number;
  maxAgeMonths: number;
  schedule: string;
  scheduleTh: string | null;
};

type ClassData = Omit<ClassRow, "id"> & {
  ageLabelTh: string | null;
  scheduleTh: string | null;
  order: number;
};

export type ClassPlan = {
  create: ClassData[];
  update: Array<{ id: string; data: ClassData }>;
  deleteIds: string[];
};

/** та же строка или исправленная опечатка — перевод ещё годится */
function stillSame(before: string, after: string): boolean {
  return clean(before) === after || isTypoFix(clean(before), after);
}

/**
 * Что создать, обновить и удалить. Порядок классов — порядок строк формы.
 * Тайская подпись возраста собирается из месяцев (если возраст меняли);
 * тайское расписание остаётся только при прежнем русском.
 */
export function planClasses(
  existing: readonly ExistingClass[],
  rows: readonly ClassRow[],
): ClassPlan {
  const byId = new Map(existing.map((item) => [item.id, item]));
  const plan: ClassPlan = { create: [], update: [], deleteIds: [] };
  const kept = new Set<string>();

  rows.forEach(({ id, ...row }, index) => {
    const before = id && !kept.has(id) ? byId.get(id) : undefined;
    const ageTh = formatAgeRange(row.minAgeMonths, row.maxAgeMonths, "th");
    if (!before) {
      plan.create.push({ ...row, ageLabelTh: ageTh, scheduleTh: null, order: index + 1 });
      return;
    }
    kept.add(before.id);
    const sameAge =
      before.minAgeMonths === row.minAgeMonths &&
      before.maxAgeMonths === row.maxAgeMonths &&
      stillSame(before.ageLabel, row.ageLabel);
    plan.update.push({
      id: before.id,
      data: {
        ...row,
        ageLabelTh: sameAge ? (before.ageLabelTh ?? ageTh) : ageTh,
        scheduleTh: stillSame(before.schedule, row.schedule) ? before.scheduleTh : null,
        order: index + 1,
      },
    });
  });

  plan.deleteIds = existing.filter((item) => !kept.has(item.id)).map((item) => item.id);
  return plan;
}

const PROBLEM_TEXT: Record<ClassRowProblem, string> = {
  age: "возраст — целые месяцы от 0 до 216, «от» не больше «до»",
  schedule: "нужно расписание",
  tooLong: "слишком длинный текст (название до 100 знаков, расписание до 300)",
  tooMany: `классов больше ${CLASS_LIMITS.maxCount}`,
};

/** Код ошибки для адреса: class-3-age. */
export function classRowError(row: number, problem: ClassRowProblem): string {
  return `class-${row}-${problem}`;
}

/** Код ошибки из адреса → текст для формы; чужой код — null. */
export function classRowMessage(error: string | undefined): string | null {
  const match = /^class-(\d{1,2})-([a-zA-Z]+)$/.exec(error ?? "");
  if (!match || !Object.hasOwn(PROBLEM_TEXT, match[2])) {
    return null;
  }
  return `Классы, строка ${match[1]}: ${PROBLEM_TEXT[match[2] as ClassRowProblem]}. Ничего не сохранено — поправьте и сохраните ещё раз.`;
}
