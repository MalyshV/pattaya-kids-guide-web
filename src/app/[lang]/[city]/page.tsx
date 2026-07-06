import { notFound } from "next/navigation";
import { PlaceCard } from "@/components/places/place-card";
import { PlaceFilters } from "@/components/places/place-filters";
import { PlacesPagination } from "@/components/places/places-pagination";
import { getApprovedPlaces } from "@/services/places.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { computeOpenStatus } from "@/lib/schedule/open-status";
import { ru } from "@/content/ru";

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
  const pageParam = getSingleSearchParam(resolvedSearchParams.page);

  const currentPage = parsePositiveNumberParam(pageParam) ?? 1;
  const isWorkFriendly = parseBooleanParam(workFriendly) === true;

  const placesResponse = await getApprovedPlaces(
    {
      indoor: parseBooleanParam(indoor),
      outdoor: parseBooleanParam(outdoor),
      hasFood: parseBooleanParam(hasFood),
      hasWifi: parseBooleanParam(hasWifi),
      canLeaveChild: parseBooleanParam(canLeaveChild),
      animalContact: parseBooleanParam(animalContact),
      workFriendly: parseBooleanParam(workFriendly),
    },
    {
      page: currentPage,
      limit: 6,
    },
    city.id,
  );

  const total = placesResponse.total;

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{ru.brand}</p>
        <h1 className="hero-title">{ru.places.heroTitle}</h1>
        <p className="hero-description">{ru.places.heroDescription}</p>
      </section>

      <PlaceFilters
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

      {placesResponse.items.length === 0 ? (
        <section className="empty-state">
          <h3>{isWorkFriendly ? ru.places.emptyWorkTitle : ru.places.emptyTitle}</h3>
          <p>{isWorkFriendly ? ru.places.emptyWorkHint : ru.places.emptyHint}</p>
        </section>
      ) : (
        <>
          <section className="places-grid">
            {placesResponse.items.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                basePath={basePath}
                status={computeOpenStatus(place.schedules, city.timezone)}
              />
            ))}
          </section>

          <PlacesPagination
            currentPage={placesResponse.page}
            totalPages={Math.ceil(placesResponse.total / placesResponse.limit)}
            basePath={basePath}
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
