import Link from "next/link";
import { getDictionary, langFromPath } from "@/content/dictionary";
import { ScrollToHash } from "@/components/common/scroll-to-hash";

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

function buildHref(
  basePath: string,
  params: { age?: string; category?: string; district?: string; view?: string },
): string {
  const search = new URLSearchParams();
  if (params.age) {
    search.set("age", params.age);
  }
  if (params.category) {
    search.set("category", params.category);
  }
  if (params.district) {
    search.set("district", params.district);
  }
  if (params.view === "map") {
    search.set("view", "map");
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
  activeDistrict,
  view,
  categories,
}: ActivityFiltersProps): React.ReactElement | null {
  const dict = getDictionary(langFromPath(basePath));

  if (categories.length === 0) {
    return null;
  }

  return (
    // id — якорь для чипов категорий со страницы занятия: переход ведёт сразу
    // к «Типу занятий», а не к началу страницы
    <section className="filters-panel" id="activity-type">
      <ScrollToHash id="activity-type" />
      <div className="activity-filter-row">
        <span className="filter-group-label">{dict.activities.filterTypeTitle}</span>
        <div className="filter-chips">
          <Link
            href={buildHref(basePath, { age: activeAge, district: activeDistrict, view })}
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
                district: activeDistrict,
                view,
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
