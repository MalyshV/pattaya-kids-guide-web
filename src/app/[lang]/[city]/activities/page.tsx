import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityCard } from "@/components/activities/activity-card";
import { ActivityFilters } from "@/components/activities/activity-filters";
import { ActivitiesPagination } from "@/components/activities/activities-pagination";
import { AgeQuestion } from "@/components/common/age-question";
import { MapEmpty } from "@/components/common/map-empty";
import { ViewToggle } from "@/components/common/view-toggle";
import { PlacesMap, type PlaceMapMarker } from "@/components/places/places-map";
import { mapActivityToListItem } from "@/mappers/activity.mapper";
import { activityToMapPoint } from "@/mappers/map-point.mapper";
import { getCityActivities } from "@/services/activities.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { activitySortRank, isActivityActive } from "@/lib/activities/activity-sort";
import { matchesAnyAgeBucket, parseAgeBuckets } from "@/lib/age/age-buckets";
import { matchesCategory } from "@/lib/activities/activity-filter";
import { getDictionary } from "@/content/dictionary";
import { localizedCityName, pickLocalized } from "@/lib/i18n/localize";
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination";
import { pageAlternates } from "@/lib/seo/meta";
import {
  getSingleSearchParam,
  parsePositiveNumberParam,
} from "@/lib/params/search-params";
import { parseListView, viewHref } from "@/lib/params/view-href";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: {
  params: PageProps["params"];
}): Promise<Metadata> {
  const { lang, city: citySlug } = await params;
  const dict = getDictionary(lang);
  return {
    // свой title (бренд добавит template): иначе вкладки одинаковы по городу
    title: dict.activities.heroTitle,
    // self-canonical: ?page=/фильтры не плодят дубли в индексе
    alternates: pageAlternates(lang, citySlug, "/activities"),
  };
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

  const dict = getDictionary(lang);
  const basePath = cityBasePath(lang, citySlug);
  const resolvedSearchParams = (await searchParams) ?? {};
  const age = getSingleSearchParam(resolvedSearchParams.age);
  const ageBuckets = parseAgeBuckets(age);
  const activeCategory = getSingleSearchParam(resolvedSearchParams.category);
  const currentPage =
    parsePositiveNumberParam(getSingleSearchParam(resolvedSearchParams.page)) ?? 1;
  // ?view=map — карта вместо списка (те же возраст и тип)
  const viewParam = getSingleSearchParam(resolvedSearchParams.view);
  const view = parseListView(viewParam);

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
        name: pickLocalized(
          link.category.name,
          link.category.nameEn,
          link.category.nameTh,
          lang,
        ),
        order: link.category.order,
      });
    }
  }
  const availableCategories = [...categoryMap.values()].sort((a, b) => a.order - b.order);

  const isFiltered = Boolean(ageBuckets.length > 0 || activeCategory);
  // сырое занятие рядом с DTO — из него точка карты (координаты места/площадки)
  const entries = activities
    .map((raw) => ({ raw, item: mapActivityToListItem(raw, lang) }))
    .filter(({ item }) => matchesAnyAgeBucket(item, ageBuckets))
    .filter(({ item }) => (activeCategory ? matchesCategory(item, activeCategory) : true))
    .sort((a, b) => activitySortRank(a.item, now) - activitySortRank(b.item, now));
  const items = entries.map(({ item }) => item);

  const totalPages = Math.max(1, Math.ceil(items.length / LIST_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = items.slice(
    (safePage - 1) * LIST_PAGE_SIZE,
    safePage * LIST_PAGE_SIZE,
  );

  // Карта — все занятия фильтра без пагинации, кроме прошедших лагерей: как у
  // событий, на карте ищут, куда пойти, прошедшее остаётся в списке
  const mapCandidates =
    view === "map" ? entries.filter(({ item }) => isActivityActive(item, now)) : [];
  const mapPastCount = view === "map" ? entries.length - mapCandidates.length : 0;
  const mapMarkers: PlaceMapMarker[] = mapCandidates.flatMap(({ raw, item }) => {
    const point = activityToMapPoint(raw, basePath, lang);
    const where = item.place?.name ?? item.venueName;
    // под названием — где проходит (у занятия название часто общее)
    return point ? [{ ...point, note: where ?? undefined }] : [];
  });
  const mapMissingCount = mapCandidates.length - mapMarkers.length;
  // честность: счётчик выше считает весь список — называем, чего на карте нет
  // и почему; те же строки объясняют и совсем пустую карту
  const mapNotes = [
    ...(mapMissingCount > 0 ? [dict.activities.mapMissingNote(mapMissingCount)] : []),
    ...(mapPastCount > 0 ? [dict.activities.mapPastNote(mapPastCount)] : []),
  ];

  const listPath = `${basePath}/activities`;
  const listParams = { age, category: activeCategory };
  const viewToggle = (
    <ViewToggle
      view={view}
      listHref={viewHref(listPath, listParams, "list")}
      mapHref={viewHref(listPath, listParams, "map")}
      labels={{
        list: dict.places.viewList,
        map: dict.places.viewMap,
        aria: dict.places.viewToggleAria,
      }}
    />
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
        preservedParams={{
          category: activeCategory,
          view: viewParam === "map" ? "map" : undefined,
        }}
      />

      <ActivityFilters
        basePath={basePath}
        activeAge={age}
        activeCategory={activeCategory}
        view={viewParam}
        categories={availableCategories}
      />

      <section className="results-header" id="results">
        <div>
          <h2>{dict.activities.sectionTitle}</h2>
          {/* role=status: после фильтрации скринридер озвучит счётчик */}
          <p role="status">{dict.activities.count(items.length)}</p>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="empty-state">
          <h3>{dict.activities.emptyTitle}</h3>
          <p>
            {isFiltered ? dict.activities.emptyFilteredHint : dict.activities.emptyHint}
          </p>
          {isFiltered ? (
            <Link href={viewHref(listPath, {}, view)} className="empty-state-cta">
              {dict.activities.emptyCta}
            </Link>
          ) : null}
        </section>
      ) : view === "map" ? (
        <>
          {viewToggle}
          {mapMarkers.length === 0 ? (
            <MapEmpty
              title={dict.places.mapEmptyTitle}
              reasons={mapNotes}
              listHref={viewHref(listPath, listParams, "list")}
              listLabel={dict.places.mapShowList}
            />
          ) : (
            <>
              <PlacesMap
                markers={mapMarkers}
                userPoint={null}
                basePath={basePath}
                regionLabel={dict.activities.mapRegionLabel}
              />
              {mapNotes.map((note) => (
                <p key={note} className="near-status map-missing-note">
                  {note}
                </p>
              ))}
            </>
          )}
        </>
      ) : (
        <>
          {viewToggle}
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
