import { notFound } from "next/navigation";
import { ActivityCard } from "@/components/activities/activity-card";
import { ActivityFilters } from "@/components/activities/activity-filters";
import { ActivitiesPagination } from "@/components/activities/activities-pagination";
import { mapActivityToListItem } from "@/mappers/activity.mapper";
import { getCityActivities } from "@/services/activities.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { activitySortRank } from "@/lib/activities/activity-sort";
import {
  matchesAgeBucket,
  matchesCategory,
  parseAgeBucket,
} from "@/lib/activities/activity-filter";
import { ru } from "@/content/ru";

const PAGE_SIZE = 6;

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleSearchParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveNumberParam(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

export default async function CityActivitiesPage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const basePath = cityBasePath(lang, citySlug);
  const resolvedSearchParams = (await searchParams) ?? {};
  const activeAge = parseAgeBucket(getSingleSearchParam(resolvedSearchParams.age));
  const activeCategory = getSingleSearchParam(resolvedSearchParams.category);
  const currentPage =
    parsePositiveNumberParam(getSingleSearchParam(resolvedSearchParams.page)) ?? 1;

  const activities = await getCityActivities(city.id);
  const now = new Date();

  // Доступные категории для чипов — из всех занятий города (до фильтрации),
  // чтобы фильтр по типу всегда показывал реально существующие категории.
  const categoryMap = new Map<string, { slug: string; name: string; order: number }>();
  for (const activity of activities) {
    for (const link of activity.categories) {
      categoryMap.set(link.category.slug, {
        slug: link.category.slug,
        name: link.category.name,
        order: link.category.order,
      });
    }
  }
  const availableCategories = [...categoryMap.values()].sort((a, b) => a.order - b.order);

  const isFiltered = Boolean(activeAge || activeCategory);
  const items = activities
    .map(mapActivityToListItem)
    .filter((a) => (activeAge ? matchesAgeBucket(a, activeAge) : true))
    .filter((a) => (activeCategory ? matchesCategory(a, activeCategory) : true))
    .sort((a, b) => activitySortRank(a, now) - activitySortRank(b, now));

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{city.name}</p>
        <h1 className="hero-title">{ru.activities.heroTitle}</h1>
        <p className="hero-description">{ru.activities.heroDescription}</p>
      </section>

      <ActivityFilters
        basePath={basePath}
        activeAge={activeAge}
        activeCategory={activeCategory}
        categories={availableCategories}
      />

      <section className="results-header">
        <div>
          <h2>{ru.activities.sectionTitle}</h2>
          <p>{ru.activities.count(items.length)}</p>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="empty-state">
          <h3>{ru.activities.emptyTitle}</h3>
          <p>{isFiltered ? ru.activities.emptyFilteredHint : ru.activities.emptyHint}</p>
        </section>
      ) : (
        <>
          <section className="activities-grid">
            {pageItems.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} basePath={basePath} />
            ))}
          </section>

          <ActivitiesPagination
            currentPage={safePage}
            totalPages={totalPages}
            basePath={basePath}
            age={activeAge ?? undefined}
            category={activeCategory}
          />
        </>
      )}
    </main>
  );
}
