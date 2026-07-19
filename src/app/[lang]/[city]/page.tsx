import Link from "next/link";
import { notFound } from "next/navigation";
import { AgeQuestion } from "@/components/common/age-question";
import { SearchBox } from "@/components/common/search-box";
import { PlaceFilters } from "@/components/places/place-filters";
import { ScenarioBar } from "@/components/places/scenario-bar";
import { PlacesResults } from "@/components/places/places-results";
import { VisitedFilterChips } from "@/components/places/visited-filter-chips";
import { parseVisitedParam } from "@/lib/memory/visited-filter";
import { getAllApprovedPlaces } from "@/services/places.service";
import { getSearchRows } from "@/services/search.service";
import { mapPlaceToListItemDto } from "@/mappers/place.mapper";
import { mapSearchIndex } from "@/mappers/search.mapper";
import { parseAgeBuckets, placeAgeGroupsMatch } from "@/lib/age/age-buckets";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import {
  computeOpenStatus,
  isGoNowStatus,
  opensEarlyToday,
} from "@/lib/schedule/open-status";
import { compareCatalogOrder } from "@/lib/places/catalog-order";
import { getDictionary } from "@/content/dictionary";
import { localizedCityName } from "@/lib/i18n/localize";
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination";
import { listPageAlternates } from "@/lib/seo/meta";
import {
  getSingleSearchParam,
  parsePositiveNumberParam,
} from "@/lib/params/search-params";
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
  // self-canonical корня города: ?page=/?view=map/?age= не плодят дубли
  return { alternates: listPageAlternates(lang, citySlug, "") };
}

function parseBooleanParam(value: string | undefined): boolean | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

export default async function CityPlacesPage({
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

  const indoor = getSingleSearchParam(resolvedSearchParams.indoor);
  const outdoor = getSingleSearchParam(resolvedSearchParams.outdoor);
  const hasFood = getSingleSearchParam(resolvedSearchParams.hasFood);
  const hasWifi = getSingleSearchParam(resolvedSearchParams.hasWifi);
  const hasAirCon = getSingleSearchParam(resolvedSearchParams.hasAirCon);
  const hasParking = getSingleSearchParam(resolvedSearchParams.hasParking);
  const canLeaveChild = getSingleSearchParam(resolvedSearchParams.canLeaveChild);
  const animalContact = getSingleSearchParam(resolvedSearchParams.animalContact);
  const workFriendly = getSingleSearchParam(resolvedSearchParams.workFriendly);
  const openNow = getSingleSearchParam(resolvedSearchParams.openNow);
  const openMorning = getSingleSearchParam(resolvedSearchParams.openMorning);
  const shelter = getSingleSearchParam(resolvedSearchParams.shelter);
  // «Рядом со мной»: в URL только флаг — координаты остаются в браузере,
  // сортировку по близости делает клиентский PlacesResults
  const near = getSingleSearchParam(resolvedSearchParams.near);
  // ?view=map — карта вместо списка (те же фильтры)
  const viewParam = getSingleSearchParam(resolvedSearchParams.view);
  const view: "list" | "map" = viewParam === "map" ? "map" : "list";
  const age = getSingleSearchParam(resolvedSearchParams.age);
  const pageParam = getSingleSearchParam(resolvedSearchParams.page);
  // ?visited= — фильтр по ✓-отметкам; сервер список НЕ фильтрует (отметки в
  // localStorage), только проносит параметр — фильтрует клиент PlacesResults
  const visitedFilter = parseVisitedParam(
    getSingleSearchParam(resolvedSearchParams.visited),
  );
  const visited = visitedFilter ?? undefined;

  const currentPage = parsePositiveNumberParam(pageParam) ?? 1;
  const isWorkFriendly = parseBooleanParam(workFriendly) === true;
  const isOpenNow = parseBooleanParam(openNow) === true;
  const isOpenMorning = parseBooleanParam(openMorning) === true;
  const isShelter = parseBooleanParam(shelter) === true;
  const isNear = parseBooleanParam(near) === true;
  const ageBuckets = parseAgeBuckets(age);

  // Фасеты — рядовые фильтры (не сценарии), переносим между чипами и пагинацией.
  // age здесь же: возраст должен пережить переключение сценария/фасета.
  const facets = {
    age,
    visited,
    view: viewParam,
    indoor,
    outdoor,
    hasFood,
    hasWifi,
    hasAirCon,
    hasParking,
    canLeaveChild,
    animalContact,
  };

  // индекс поиска и места не зависят друг от друга — забираем параллельно,
  // а не по очереди (каждый круг до базы — это время ответа страницы)
  const [searchRows, allPlaces] = await Promise.all([
    getSearchRows(city.id),
    getAllApprovedPlaces(
      {
        indoor: parseBooleanParam(indoor),
        outdoor: parseBooleanParam(outdoor),
        hasFood: parseBooleanParam(hasFood),
        hasWifi: parseBooleanParam(hasWifi),
        hasAirCon: parseBooleanParam(hasAirCon),
        hasParking: parseBooleanParam(hasParking),
        canLeaveChild: parseBooleanParam(canLeaveChild),
        animalContact: parseBooleanParam(animalContact),
        workFriendly: parseBooleanParam(workFriendly),
        shelter: parseBooleanParam(shelter),
      },
      city.id,
    ),
  ]);

  const searchIndex = mapSearchIndex(
    searchRows.places,
    searchRows.activities,
    basePath,
    lang,
  );

  // Живой статус + сортировка: открытые сейчас выше закрытых, а среди мест с
  // одинаковым статусом — новые (по дате добавления) первыми (решение Вероники).
  const placesWithStatus = allPlaces
    .map((place) => ({
      place,
      status: computeOpenStatus(place.schedules, city.timezone),
    }))
    .sort((a, b) =>
      compareCatalogOrder(
        { status: a.status, createdAt: a.place.createdAt },
        { status: b.status, createdAt: b.place.createdAt },
      ),
    );

  // Сценарии по расписанию — постфильтры (статус/часы вычисляются, в БД их нет).
  let visiblePlaces = placesWithStatus;
  if (isOpenNow) {
    // «Пойти сейчас»: открыто сейчас или вот-вот откроется.
    visiblePlaces = visiblePlaces.filter(({ status }) => isGoNowStatus(status));
  }
  if (isOpenMorning) {
    // «Открыто с утра»: сегодня открывается рано (к 9:00).
    visiblePlaces = visiblePlaces.filter(({ place }) =>
      opensEarlyToday(place.schedules, city.timezone),
    );
  }
  if (ageBuckets.length > 0) {
    // «Сколько лет ребёнку?»: место подходит хотя бы одному из выбранных
    // возрастов; место без возрастных групп не прячем (пробел данных).
    visiblePlaces = visiblePlaces.filter(({ place }) =>
      placeAgeGroupsMatch(
        place.ageGroups.map((link) => link.ageGroup),
        ageBuckets,
      ),
    );
  }

  const total = visiblePlaces.length;
  const totalPages = Math.max(1, Math.ceil(total / LIST_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  // Пустое состояние честно объясняет причину — приоритет у активного сценария.
  const emptyTitle = isOpenNow
    ? dict.places.emptyOpenNowTitle
    : isOpenMorning
      ? dict.places.emptyMorningTitle
      : isShelter
        ? dict.places.emptyShelterTitle
        : isWorkFriendly
          ? dict.places.emptyWorkTitle
          : dict.places.emptyTitle;
  // без активного сценария «виновником» пустоты может быть возраст — он живёт
  // не в блоке «Фильтры», и совет «уберите один из фильтров» указывал бы не туда
  const scenarioActive = isOpenNow || isOpenMorning || isShelter || isWorkFriendly;
  const emptyHint = isOpenNow
    ? dict.places.emptyOpenNowHint
    : isOpenMorning
      ? dict.places.emptyMorningHint
      : isShelter
        ? dict.places.emptyShelterHint
        : isWorkFriendly
          ? dict.places.emptyWorkHint
          : !scenarioActive && ageBuckets.length > 0
            ? dict.places.emptyAgeHint
            : dict.places.emptyHint;

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{localizedCityName(city, lang)}</p>
        <h1 className="hero-title">{dict.places.heroTitle}</h1>
        <p className="hero-description">{dict.places.heroDescription}</p>
      </section>

      <SearchBox items={searchIndex} />

      <AgeQuestion
        pathname={basePath}
        activeBuckets={ageBuckets}
        preservedParams={{
          visited,
          openNow,
          openMorning,
          workFriendly,
          shelter,
          near,
          view: viewParam,
          indoor,
          outdoor,
          hasFood,
          hasWifi,
          hasAirCon,
          hasParking,
          canLeaveChild,
          animalContact,
        }}
      />

      <VisitedFilterChips
        pathname={basePath}
        active={visitedFilter}
        preservedParams={{
          age,
          openNow,
          openMorning,
          workFriendly,
          shelter,
          near,
          view: viewParam,
          indoor,
          outdoor,
          hasFood,
          hasWifi,
          hasAirCon,
          hasParking,
          canLeaveChild,
          animalContact,
        }}
      />

      <ScenarioBar
        active={{
          openNow: isOpenNow,
          openMorning: isOpenMorning,
          workFriendly: isWorkFriendly,
          shelter: isShelter,
          near: isNear,
        }}
        facets={facets}
      />

      <PlaceFilters
        age={age}
        visited={visited}
        openNow={openNow}
        openMorning={openMorning}
        shelter={shelter}
        workFriendly={workFriendly}
        near={near}
        view={viewParam}
        indoor={indoor}
        outdoor={outdoor}
        hasFood={hasFood}
        hasWifi={hasWifi}
        hasAirCon={hasAirCon}
        hasParking={hasParking}
        canLeaveChild={canLeaveChild}
        animalContact={animalContact}
      />

      <section className="results-header" id="results">
        <div>
          <h2>{dict.places.sectionTitle}</h2>
          <p>{dict.places.count(total)}</p>
        </div>
      </section>

      {total === 0 ? (
        <section className="empty-state">
          <h3>{emptyTitle}</h3>
          <p>{emptyHint}</p>
          {/* выход из тупика одним нажатием, не гадая, какой фильтр убрать */}
          <Link href={basePath} className="empty-state-cta">
            {dict.places.emptyCta}
          </Link>
        </section>
      ) : (
        <PlacesResults
          // слим-DTO вместо сырой Prisma-модели: items сериализуются в браузер,
          // служебные поля (модерация, заметки) туда попадать не должны
          items={visiblePlaces.map(({ place, status }) => ({
            place: mapPlaceToListItemDto(place),
            status,
          }))}
          visitedFilter={visitedFilter}
          near={isNear}
          view={view}
          basePath={basePath}
          currentPage={safePage}
          totalPages={totalPages}
          pageSize={LIST_PAGE_SIZE}
          pagination={{
            age,
            visited,
            openNow,
            openMorning,
            shelter,
            workFriendly,
            near,
            indoor,
            outdoor,
            hasFood,
            hasWifi,
            hasAirCon,
            hasParking,
            canLeaveChild,
            animalContact,
          }}
        />
      )}
    </main>
  );
}
