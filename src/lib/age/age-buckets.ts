/**
 * Возраст ребёнка как сквозной вход: корзины возрастов и правила соответствия.
 * Один вопрос «Сколько лет ребёнку?» действует на места и занятия (события —
 * когда у Event появятся возрастные поля). Выбор живёт в URL (?age=1-3,6-12):
 * мультивыбор — у родителя часто двое детей, показываем подходящее хотя бы
 * одному. Чистые функции, применяются страницами в памяти.
 */

export type AgeBucket = {
  key: string;
  minMonths: number;
  maxMonths: number;
};

/** Возрастные корзины (в месяцах). Ключ — в URL. */
export const AGE_BUCKETS: AgeBucket[] = [
  { key: "0-1", minMonths: 0, maxMonths: 12 },
  { key: "1-3", minMonths: 12, maxMonths: 36 },
  { key: "3-6", minMonths: 36, maxMonths: 72 },
  { key: "6-12", minMonths: 72, maxMonths: 144 },
];

export type Ageable = {
  minAgeMonths: number | null;
  maxAgeMonths: number | null;
};

/** Диапазон подходит корзине: пересечение с ненулевой шириной (строго, чтобы
 *  «от 3 лет» не попадал и в «1–3», и в «3–6»). Без возраста — подходит
 *  (пробел в данных не прячет). */
export function matchesAgeBucket(activity: Ageable, bucketKey: string): boolean {
  const bucket = AGE_BUCKETS.find((b) => b.key === bucketKey);
  if (!bucket) {
    return true;
  }
  if (activity.minAgeMonths == null && activity.maxAgeMonths == null) {
    return true;
  }
  const min = activity.minAgeMonths ?? 0;
  const max = activity.maxAgeMonths ?? Number.MAX_SAFE_INTEGER;
  return min < bucket.maxMonths && max > bucket.minMonths;
}

/** Валидные ключи корзин из строки URL «1-3,6-12» (порядок — как в AGE_BUCKETS,
 *  дубли и мусор отбрасываются). Пусто/мусор → []. */
export function parseAgeBuckets(value: string | undefined): string[] {
  if (!value) {
    return [];
  }
  const requested = new Set(value.split(","));
  return AGE_BUCKETS.filter((b) => requested.has(b.key)).map((b) => b.key);
}

/** Подходит ли диапазон ХОТЯ БЫ одной выбранной корзине (двое детей → два
 *  возраста). Пустой выбор — фильтра нет, подходит всё. */
export function matchesAnyAgeBucket(activity: Ageable, bucketKeys: string[]): boolean {
  if (bucketKeys.length === 0) {
    return true;
  }
  return bucketKeys.some((key) => matchesAgeBucket(activity, key));
}

type PlaceAgeGroupYears = {
  minAge: number;
  maxAge: number;
};

/** Возраст МЕСТА хранится в группах в ГОДАХ («1–7 лет»). Место подходит, если
 *  хотя бы одна его группа пересекает хотя бы одну выбранную корзину; место
 *  без групп — подходит (не прячем из-за пробела в данных). */
export function placeAgeGroupsMatch(
  groups: PlaceAgeGroupYears[],
  bucketKeys: string[],
): boolean {
  if (bucketKeys.length === 0 || groups.length === 0) {
    return true;
  }
  return groups.some((group) =>
    matchesAnyAgeBucket(
      { minAgeMonths: group.minAge * 12, maxAgeMonths: group.maxAge * 12 },
      bucketKeys,
    ),
  );
}
