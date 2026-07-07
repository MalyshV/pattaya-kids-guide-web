/**
 * Фильтрация ленты «Занятия» по возрасту ребёнка и типу активности. Чистые
 * функции — страница применяет их к списку из getCityActivities.
 */

export type AgeBucket = {
  key: string;
  minMonths: number;
  maxMonths: number;
};

/** Возрастные корзины для фильтра (в месяцах). Ключ — в URL (?age=1-3). */
export const AGE_BUCKETS: AgeBucket[] = [
  { key: "0-1", minMonths: 0, maxMonths: 12 },
  { key: "1-3", minMonths: 12, maxMonths: 36 },
  { key: "3-6", minMonths: 36, maxMonths: 72 },
  { key: "6-12", minMonths: 72, maxMonths: 144 },
];

type Ageable = {
  minAgeMonths: number | null;
  maxAgeMonths: number | null;
};

/** Подходит ли занятие возрастной корзине: диапазоны пересекаются с ненулевой
 *  шириной (строго, чтобы возраст на стыке — напр. лагерь «от 3 лет» — не попал
 *  и в «1–3», и в «3–6»). Занятие без возраста считаем подходящим (не прячем
 *  из-за пробела в данных). */
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

type Categorized = {
  categories: { slug: string }[];
};

/** Занятие относится к категории (по slug). */
export function matchesCategory(activity: Categorized, slug: string): boolean {
  return activity.categories.some((c) => c.slug === slug);
}

/** Валидный ключ возрастной корзины из строки URL (иначе undefined). */
export function parseAgeBucket(value: string | undefined): string | undefined {
  return value && AGE_BUCKETS.some((b) => b.key === value) ? value : undefined;
}
