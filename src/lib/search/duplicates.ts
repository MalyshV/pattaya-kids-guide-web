import { haversineMeters, type GeoPoint } from "@/lib/geo/distance";
import { normalizeSearchText } from "@/lib/search/match";

/**
 * «Похоже, это уже есть» — чистое ядро проверки на дубли для формы
 * «Предложить своё» (и в будущем — для импорта мест).
 *
 * Отличие от поиска в шапке: поиск проверяет «все слова запроса есть в
 * названии», а для дубля нужно в ОБЕ стороны — родитель пишет «Skippy Land
 * Lotus North Pattaya», а у нас «Skippy Land». Плюс русская запись брендов
 * («Плей Барн», «ЛариДеа») — сравниваем в латинской транслитерации с
 * допуском одной буквы в длинных словах.
 *
 * Подсказка мягкая: ничего не запрещает (у сетей законно разные филиалы
 * рядом), поэтому ложное «похоже» дешевле пропущенного дубля.
 */

/** радиус «рядом уже есть» — тот же порог, что у импорта мест */
export const DUPLICATE_RADIUS_M = 150;
/** если есть только центр окна карты (не пин) — радиус шире и только вместе с похожим именем */
export const VIEWPORT_RADIUS_M = 300;
/** ниже этого сходство названий не считаем совпадением */
export const NAME_MATCH_MIN = 0.6;
/** короче — по имени не сравниваем (одно-два слова «кафе» совпадают со всем) */
export const MIN_DUP_NAME_LENGTH = 3;

// Слова, которые есть почти в каждом названии и ничего не различают.
// Если после их удаления ничего не осталось («Kids Club») — сравниваем как есть.
// через ту же нормализацию, что и названия: «детский» → «детскии» (й → и)
const STOP_WORDS = new Set(
  [
    "pattaya",
    "паттайя",
    "паттайе",
    "พัทยา",
    "the",
    "kids",
    "kid",
    "club",
    "клуб",
    "cafe",
    "кафе",
    "детский",
    "детская",
    "детское",
    "for",
    "and",
    "at",
    "in",
    "branch",
    "филиал",
    // «Школа Феникс» = «Phoenix School»: тип учреждения по-разному на разных языках
    "school",
    "школа",
    "international",
    "международная",
    "и",
    "в",
    "на",
  ].map((word) => normalizeSearchText(word)),
);

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ж: "zh",
  з: "z",
  и: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function transliterate(text: string): string {
  return [...text].map((char) => CYRILLIC_TO_LATIN[char] ?? char).join("");
}

/**
 * Свёртка латинского написания к «звучанию»: транслит по-русски и оригинал
 * бренда расходятся в типичных местах — «Плей»/Play (ei/ay), «Скиппи»/Skippy
 * (двойные, y/i), «Феникс»/Phoenix (ph/f, oe/e, x/ks), «Виттайя»/Wittaya (w/v).
 * Тайские буквы правила не задевают.
 */
function foldLatin(word: string): string {
  return word
    .replace(/ph/g, "f")
    .replace(/x/g, "ks")
    .replace(/w/g, "v")
    .replace(/q/g, "k")
    .replace(/c(?!h)/g, "k")
    .replace(/y/g, "i")
    .replace(/oe/g, "e")
    .replace(/([a-z])\1+/g, "$1")
    .replace(/ai/g, "ei");
}

/**
 * Нормализация названия для сравнения: регистр, диакритика (как у поиска),
 * пунктуация и кавычки, кириллица → латиница. Возвращает значимые слова.
 */
export function dupTokens(value: string): string[] {
  const base = normalizeSearchText(value)
    .replace(/[«»"'’‘`´.,:;!?()[\]{}/\\|&+*#@_–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!base) {
    return [];
  }
  const words = base.split(" ").filter((word) => word.length >= 2);
  // стоп-слова — ДО транслитерации: в словаре они в обычном написании
  // («кафе», «детский»), после транслита «kafe» с ними уже не совпало бы
  const meaningful = words.filter((word) => !STOP_WORDS.has(word));
  return (meaningful.length > 0 ? meaningful : words).map((word) =>
    foldLatin(transliterate(word)),
  );
}

/** «a b» целиком входит в «x a b y» — по словам, а не по буквам. */
function containsWords(haystack: string[], needle: string[]): boolean {
  return ` ${haystack.join(" ")} `.includes(` ${needle.join(" ")} `);
}

/** Левенштейн с ранним выходом: нам нужно только «≤ 1». */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) {
    return true;
  }
  if (Math.abs(a.length - b.length) > 1) {
    return false;
  }
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) {
      return false;
    }
    if (a.length > b.length) {
      i += 1;
    } else if (b.length > a.length) {
      j += 1;
    } else {
      i += 1;
      j += 1;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

function sameWord(a: string, b: string): boolean {
  // одна опечатка — только в словах от 4 букв («play»/«plei»): в коротких
  // одна буква меняет слово целиком («zoo»/«zon»)
  return a === b || (a.length >= 4 && b.length >= 4 && withinOneEdit(a, b));
}

/**
 * Сходство двух названий 0…1: 1 — одно и то же; ~0.9 — одно целиком внутри
 * другого; иначе доля общих значимых слов (от меньшего названия).
 */
export function nameSimilarity(a: string, b: string): number {
  const ta = dupTokens(a);
  const tb = dupTokens(b);
  if (ta.length === 0 || tb.length === 0) {
    return 0;
  }
  const ja = ta.join(" ");
  const jb = tb.join(" ");
  if (ja === jb) {
    return 1;
  }
  // целиком внутри — по словам («Skippy Land» в «Skippy Land Lotus North»);
  // по буквам — только для длинного «слова» без пробелов (тайские названия
  // пишутся слитно), иначе «art» находился бы в «Smart Kids»
  const [shorter, longer] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  const shortJoined = shorter.join(" ");
  if (
    containsWords(longer, shorter) ||
    (shorter.length === 1 &&
      shortJoined.length >= 6 &&
      longer.join("").includes(shortJoined))
  ) {
    return 0.9;
  }
  const [small, large] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  const shared = small.filter((word) =>
    large.some((other) => sameWord(word, other)),
  ).length;
  if (shared === 0) {
    return 0;
  }
  return 0.85 * (shared / small.length);
}

export type DupKind = "place" | "event" | "activity" | "submission";

export type DupCandidate = {
  key: string;
  kind: DupKind;
  /** все варианты названия (ru/en/th, площадка) */
  names: string[];
  /** что показать родителю */
  label: string;
  /** ссылка на карточку; null — страницы нет (ждёт проверки) */
  href: string | null;
  point: GeoPoint | null;
  /** событие уже прошло — подсказка скажет об этом (новый выпуск — не дубль) */
  past?: boolean;
};

export type DupReason = "name" | "nearby" | "both";

export type DupMatch = {
  candidate: DupCandidate;
  reason: DupReason;
  distanceM: number | null;
  score: number;
};

export type DupInput = {
  name: string;
  point: GeoPoint | null;
  /** true — точная точка места (пин); false — только центр окна карты */
  precise: boolean;
};

/** До `limit` самых похожих: по имени, по близости или по обоим сразу. */
export function findDuplicateCandidates(
  input: DupInput,
  candidates: readonly DupCandidate[],
  limit = 3,
): DupMatch[] {
  const useName = input.name.trim().length >= MIN_DUP_NAME_LENGTH;
  const matches: DupMatch[] = [];

  for (const candidate of candidates) {
    const nameScore = useName
      ? Math.max(0, ...candidate.names.map((name) => nameSimilarity(input.name, name)))
      : 0;
    const distanceM =
      input.point && candidate.point
        ? haversineMeters(input.point, candidate.point)
        : null;
    const nameHit = nameScore >= NAME_MATCH_MIN;
    const radius = input.precise ? DUPLICATE_RADIUS_M : VIEWPORT_RADIUS_M;
    const near = distanceM !== null && distanceM <= radius;

    let reason: DupReason | null = null;
    if (nameHit && near) {
      reason = "both";
    } else if (nameHit) {
      reason = "name";
    } else if (near && input.precise) {
      // по одному центру окна карты не решаем — слишком неточно
      reason = "nearby";
    }
    if (!reason) {
      continue;
    }

    const closeness = distanceM !== null && near ? 1 - distanceM / radius : 0;
    const score =
      reason === "both"
        ? 2 + nameScore + closeness
        : reason === "name"
          ? 1 + nameScore
          : closeness;
    matches.push({ candidate, reason, distanceM, score });
  }

  return matches.sort((x, y) => y.score - x.score).slice(0, limit);
}
