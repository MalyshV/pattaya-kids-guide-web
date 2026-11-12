import { CategoryFilterRow } from "@/components/common/category-filter-row";
import { getDictionary, langFromPath } from "@/content/dictionary";

// Возраст спрашивает общий AgeQuestion над этим блоком (сквозной вход по всему
// сайту) — здесь остаётся только фильтр по типу занятий.

type ActivityFiltersProps = {
  basePath: string;
  /** Текущий выбор возраста (?age=) — сохраняем в ссылках категорий. */
  activeAge?: string;
  activeCategory?: string;
  /** Выбранный район (?district=) — переживает смену типа. */
  activeDistrict?: string;
  /** ?view=map — карта остаётся картой при смене типа */
  view?: string;
  categories: { slug: string; name: string }[];
};

export function ActivityFilters({
  basePath,
  activeAge,
  activeCategory,
  activeDistrict,
  view,
  categories,
}: ActivityFiltersProps): React.ReactElement | null {
  const dict = getDictionary(langFromPath(basePath));

  return (
    <CategoryFilterRow
      title={dict.activities.filterTypeTitle}
      allLabel={dict.activities.filterAll}
      pathname={`${basePath}/activities`}
      active={activeCategory}
      preservedParams={{
        age: activeAge,
        district: activeDistrict,
        view: view === "map" ? "map" : undefined,
      }}
      categories={categories}
      anchorId="activity-type"
    />
  );
}
