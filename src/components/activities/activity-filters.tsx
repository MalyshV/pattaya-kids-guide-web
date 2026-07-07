import Link from "next/link";
import { AGE_BUCKETS } from "@/lib/activities/activity-filter";
import { ru } from "@/content/ru";

type ActivityFiltersProps = {
  basePath: string;
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
}: ActivityFiltersProps): React.ReactElement {
  const ageBuckets = ru.activities.ageBuckets as Record<string, string>;

  return (
    <section className="filters-panel">
      <div className="activity-filter-row">
        <span className="filter-group-label">{ru.activities.filterAgeTitle}</span>
        <div className="filter-chips">
          <Link
            href={buildHref(basePath, { category: activeCategory })}
            className={chipClass(!activeAge)}
          >
            {ru.activities.filterAny}
          </Link>
          {AGE_BUCKETS.map((bucket) => (
            <Link
              key={bucket.key}
              href={buildHref(basePath, {
                age: bucket.key,
                category: activeCategory,
              })}
              className={chipClass(activeAge === bucket.key)}
            >
              {ageBuckets[bucket.key] ?? bucket.key}
            </Link>
          ))}
        </div>
      </div>

      {categories.length > 0 ? (
        <div className="activity-filter-row">
          <span className="filter-group-label">{ru.activities.filterTypeTitle}</span>
          <div className="filter-chips">
            <Link
              href={buildHref(basePath, { age: activeAge })}
              className={chipClass(!activeCategory)}
            >
              {ru.activities.filterAll}
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
      ) : null}
    </section>
  );
}
