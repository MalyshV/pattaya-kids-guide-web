import Link from "next/link";
import { getDictionary, langFromPath } from "@/content/dictionary";

// Возраст спрашивает общий AgeQuestion над этим блоком (сквозной вход по всему
// сайту) — здесь остаётся только фильтр по типу занятий.

type ActivityFiltersProps = {
  basePath: string;
  /** Текущий выбор возраста (?age=) — сохраняем в ссылках категорий. */
  activeAge?: string;
  activeCategory?: string;
  categories: { slug: string; name: string }[];
};

function buildHref(
  basePath: string,
  params: { age?: string; category?: string },
): string {
  const search = new URLSearchParams();
  if (params.age) {
    search.set("age", params.age);
  }
  if (params.category) {
    search.set("category", params.category);
  }
  const query = search.toString();
  return `${basePath}/activities${query ? `?${query}` : ""}`;
}

function chipClass(active: boolean): string {
  return `filter-chip${active ? " filter-chip-active" : ""}`;
}

export function ActivityFilters({
  basePath,
  activeAge,
  activeCategory,
  categories,
}: ActivityFiltersProps): React.ReactElement | null {
  const dict = getDictionary(langFromPath(basePath));

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="filters-panel">
      <div className="activity-filter-row">
        <span className="filter-group-label">{dict.activities.filterTypeTitle}</span>
        <div className="filter-chips">
          <Link
            href={buildHref(basePath, { age: activeAge })}
            className={chipClass(!activeCategory)}
          >
            {dict.activities.filterAll}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={buildHref(basePath, {
                age: activeAge,
                category: category.slug,
              })}
              className={chipClass(activeCategory === category.slug)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
