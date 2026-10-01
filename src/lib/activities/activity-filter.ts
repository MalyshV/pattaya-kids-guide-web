/**
 * Фильтрация ленты «Занятия» по категории. Возрастная логика — сквозная для
 * всего сайта и живёт в src/lib/age/age-buckets.ts.
 */

type Categorized = {
  categories: { slug: string }[];
};

/** Занятие относится к категории (по slug). */
export function matchesCategory(activity: Categorized, slug: string): boolean {
  return activity.categories.some((c) => c.slug === slug);
}
