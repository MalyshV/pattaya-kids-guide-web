import { notFound } from "next/navigation";
import { ActivityCard } from "@/components/activities/activity-card";
import { ActivityFilters } from "@/components/activities/activity-filters";
import { ActivitiesPagination } from "@/components/activities/activities-pagination";
import { AgeQuestion } from "@/components/common/age-question";
import { mapActivityToListItem } from "@/mappers/activity.mapper";
import { getCityActivities } from "@/services/activities.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { activitySortRank } from "@/lib/activities/activity-sort";
import { matchesAnyAgeBucket, parseAgeBuckets } from "@/lib/age/age-buckets";
import { matchesCategory } from "@/lib/activities/activity-filter";
import { getDictionary } from "@/content/dictionary";
import { localizedCityName, pickLocalized } from "@/lib/i18n/localize";
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination";
import {
  getSingleSearchParam,
  parsePositiveNumberParam,
} from "@/lib/params/search-params";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CityActivitiesPage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const dict = getDictionary(lang);
  const basePath = cityBasePath(lang, citySlug);
  const resolvedSearchParams = (await searchParams) ?? {};
  const age = getSingleSearchParam(resolvedSearchParams.age);
  const ageBuckets = parseAgeBuckets(age);
  const activeCategory = getSingleSearchParam(resolvedSearchParams.category);
  const currentPage =
    parsePositiveNumberParam(getSingleSearchParam(resolvedSearchParams.page)) ?? 1;

  const activities = await getCityActivities(city.id);
  const now = new Date();

  // Доступные категории для чипов — из всех занятий города (до фильтрации),
  // чтобы фильтр по типу всегда показывал реально существующие категории.
  // Имя локализуем так же, как маппер карточек, иначе в EN чип фильтра
  // остался бы русским над английскими карточками.
  const categoryMap = new Map<string, { slug: string; name: string; order: number }>();
  for (const activity of activities) {
    for (const link of activity.categories) {
      categoryMap.set(link.category.slug, {
        slug: link.category.slug,
        name: pickLocalized(link.category.name, link.category.nameEn, lang),
        order: link.category.order,
      });
    }
  }
  const availableCategories = [...categoryMap.values()].sort((a, b) => a.order - b.order);

  const isFiltered = Boolean(ageBuckets.length > 0 || activeCategory);
  const items = activities
    .map((activity) => mapActivityToListItem(activity, lang))
    .filter((a) => matchesAnyAgeBucket(a, ageBuckets))
    .filter((a) => (activeCategory ? matchesCategory(a, activeCategory) : true))
    .sort((a, b) => activitySortRank(a, now) - activitySortRank(b, now));

  const totalPages = Math.max(1, Math.ceil(items.length / LIST_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = items.slice(
    (safePage - 1) * LIST_PAGE_SIZE,
    safePage * LIST_PAGE_SIZE,
  );

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{localizedCityName(city, lang)}</p>
        <h1 className="hero-title">{dict.activities.heroTitle}</h1>
        <p className="hero-description">{dict.activities.heroDescription}</p>
      </section>

      <AgeQuestion
        pathname={`${basePath}/activities`}
        activeBuckets={ageBuckets}
        preservedParams={{ category: activeCategory }}
      />

      <ActivityFilters
        basePath={basePath}
        activeAge={age}
        activeCategory={activeCategory}
        categories={availableCategories}
      />

      <section className="results-header">
        <div>
          <h2>{dict.activities.sectionTitle}</h2>
          <p>{dict.activities.count(items.length)}</p>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="empty-state">
          <h3>{dict.activities.emptyTitle}</h3>
          <p>
            {isFiltered ? dict.activities.emptyFilteredHint : dict.activities.emptyHint}
          </p>
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
            age={age}
            category={activeCategory}
          />
        </>
      )}
    </main>
  );
}
