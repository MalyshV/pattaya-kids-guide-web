type CategorizedPlace = {
  /** Может не быть в старой выборке из кэша — тогда место не совпадает. */
  categories?: { category: { slug: string } }[];
};

/** Место относится к категории (?category= строки «Тип места»). */
export function placeHasCategory(place: CategorizedPlace, slug: string): boolean {
  return (place.categories ?? []).some((link) => link.category.slug === slug);
}
