/**
 * Фильтрация ленты «Занятия». Возрастная логика стала сквозной для всего сайта
 * и живёт в src/lib/age/age-buckets.ts (реэкспорт — для существующих импортов);
 * здесь остаётся только фильтр по категории занятия.
 */

export {
  AGE_BUCKETS,
  matchesAgeBucket,
  matchesAnyAgeBucket,
  parseAgeBuckets,
  type AgeBucket,
} from "@/lib/age/age-buckets";

type Categorized = {
  categories: { slug: string }[];
};

/** Занятие относится к категории (по slug). */
export function matchesCategory(activity: Categorized, slug: string): boolean {
  return activity.categories.some((c) => c.slug === slug);
}
