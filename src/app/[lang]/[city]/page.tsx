import { notFound } from "next/navigation";
import { PlaceCard } from "@/components/places/place-card";
import { PlaceFilters } from "@/components/places/place-filters";
import { ScenarioBar } from "@/components/places/scenario-bar";
import { PlacesPagination } from "@/components/places/places-pagination";
import { getAllApprovedPlaces } from "@/services/places.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import {
  computeOpenStatus,
  isGoNowStatus,
  opensEarlyToday,
  statusSortRank,
} from "@/lib/schedule/open-status";
import { ru } from "@/content/ru";

const PAGE_SIZE = 6;

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleSearchParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
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

export default async function CityPlacesPage({
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

  const indoor = getSingleSearchParam(resolvedSearchParams.indoor);
  const outdoor = getSingleSearchParam(resolvedSearchParams.outdoor);
  const hasFood = getSingleSearchParam(resolvedSearchParams.hasFood);
  const hasWifi = getSingleSearchParam(resolvedSearchParams.hasWifi);
  const canLeaveChild = getSingleSearchParam(resolvedSearchParams.canLeaveChild);
  const animalContact = getSingleSearchParam(resolvedSearchParams.animalContact);
  const workFriendly = getSingleSearchParam(resolvedSearchParams.workFriendly);
  const openNow = getSingleSearchParam(resolvedSearchParams.openNow);
  const openMorning = getSingleSearchParam(resolvedSearchParams.openMorning);
  const shelter = getSingleSearchParam(resolvedSearchParams.shelter);
  const pageParam = getSingleSearchParam(resolvedSearchParams.page);

  const currentPage = parsePositiveNumberParam(pageParam) ?? 1;
  const isWorkFriendly = parseBooleanParam(workFriendly) === true;
  const isOpenNow = parseBooleanParam(openNow) === true;
  const isOpenMorning = parseBooleanParam(openMorning) === true;
  const isShelter = parseBooleanParam(shelter) === true;

  // Фасеты — рядовые фильтры (не сценарии), переносим между чипами и пагинацией.
  const facets = {
    indoor,
    outdoor,
    hasFood,
    hasWifi,
    canLeaveChild,
    animalContact,
  };

  const allPlaces = await getAllApprovedPlaces(
    {
      indoor: parseBooleanParam(indoor),
      outdoor: parseBooleanParam(outdoor),
      hasFood: parseBooleanParam(hasFood),
      hasWifi: parseBooleanParam(hasWifi),
      canLeaveChild: parseBooleanParam(canLeaveChild),
      animalContact: parseBooleanParam(animalContact),
      workFriendly: parseBooleanParam(workFriendly),
      shelter: parseBooleanParam(shelter),
    },
    city.id,
  );

  // Живой статус + сортировка: открытые сейчас выше закрытых (стабильно по имени)
  const placesWithStatus = allPlaces
    .map((place) => ({
      place,
      status: computeOpenStatus(place.schedules, city.timezone),
    }))
    .sort((a, b) => statusSortRank(a.status) - statusSortRank(b.status));

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

  const total = visiblePlaces.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = visiblePlaces.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Пустое состояние честно объясняет причину — приоритет у активного сценария.
  const emptyTitle = isOpenNow
    ? ru.places.emptyOpenNowTitle
    : isOpenMorning
      ? ru.places.emptyMorningTitle
      : isShelter
        ? ru.places.emptyShelterTitle
        : isWorkFriendly
          ? ru.places.emptyWorkTitle
          : ru.places.emptyTitle;
  const emptyHint = isOpenNow
    ? ru.places.emptyOpenNowHint
    : isOpenMorning
      ? ru.places.emptyMorningHint
      : isShelter
        ? ru.places.emptyShelterHint
        : isWorkFriendly
          ? ru.places.emptyWorkHint
          : ru.places.emptyHint;

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{city.name}</p>
        <h1 className="hero-title">{ru.places.heroTitle}</h1>
        <p className="hero-description">{ru.places.heroDescription}</p>
      </section>

      <ScenarioBar
        active={{
          openNow: isOpenNow,
          openMorning: isOpenMorning,
          workFriendly: isWorkFriendly,
          shelter: isShelter,
        }}
        facets={facets}
      />

      <PlaceFilters
        openNow={openNow}
        openMorning={openMorning}
        shelter={shelter}
        workFriendly={workFriendly}
        indoor={indoor}
        outdoor={outdoor}
        hasFood={hasFood}
        hasWifi={hasWifi}
        canLeaveChild={canLeaveChild}
        animalContact={animalContact}
      />

      <section className="results-header">
        <div>
          <h2>{ru.places.sectionTitle}</h2>
          <p>{ru.places.count(total)}</p>
        </div>
      </section>

      {total === 0 ? (
        <section className="empty-state">
          <h3>{emptyTitle}</h3>
          <p>{emptyHint}</p>
        </section>
      ) : (
        <>
          <section className="places-grid">
            {pageItems.map(({ place, status }) => (
              <PlaceCard
                key={place.id}
                place={place}
                basePath={basePath}
                status={status}
              />
            ))}
          </section>

          <PlacesPagination
            currentPage={safePage}
            totalPages={totalPages}
            basePath={basePath}
            openNow={openNow}
            openMorning={openMorning}
            shelter={shelter}
            workFriendly={workFriendly}
            indoor={indoor}
            outdoor={outdoor}
            hasFood={hasFood}
            hasWifi={hasWifi}
            canLeaveChild={canLeaveChild}
            animalContact={animalContact}
          />
        </>
      )}
    </main>
  );
}
