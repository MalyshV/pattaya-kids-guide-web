import { PlaceCard } from "@/components/places/place-card";
import { PlaceFilters } from "@/components/places/place-filters";
import { PlacesPagination } from "@/components/places/places-pagination";
import { getApprovedPlaces } from "@/services/places.service";

type PageProps = {
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

export default async function Home({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const resolvedSearchParams = (await searchParams) ?? {};

  const indoor = getSingleSearchParam(resolvedSearchParams.indoor);
  const hasFood = getSingleSearchParam(resolvedSearchParams.hasFood);
  const hasWifi = getSingleSearchParam(resolvedSearchParams.hasWifi);
  const canLeaveChild = getSingleSearchParam(resolvedSearchParams.canLeaveChild);
  const animalContact = getSingleSearchParam(resolvedSearchParams.animalContact);
  const pageParam = getSingleSearchParam(resolvedSearchParams.page);

  const currentPage = parsePositiveNumberParam(pageParam) ?? 1;

  const placesResponse = await getApprovedPlaces(
    {
      indoor: parseBooleanParam(indoor),
      hasFood: parseBooleanParam(hasFood),
      hasWifi: parseBooleanParam(hasWifi),
      canLeaveChild: parseBooleanParam(canLeaveChild),
      animalContact: parseBooleanParam(animalContact),
    },
    {
      page: currentPage,
      limit: 6,
    },
  );

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Pattaya Kids Guide</p>
        <h1 className="hero-title">Places for families in Pattaya</h1>
        <p className="hero-description">
          A calm first version of the places catalog. Filter by practical family needs and
          browse the first API-backed list.
        </p>
      </section>

      <PlaceFilters
        indoor={indoor}
        hasFood={hasFood}
        hasWifi={hasWifi}
        canLeaveChild={canLeaveChild}
        animalContact={animalContact}
      />

      <section className="results-header">
        <div>
          <h2 className="section-title">Places</h2>
          <p className="section-subtitle">Found: {placesResponse.total}</p>
        </div>
      </section>

      {placesResponse.items.length === 0 ? (
        <section className="empty-state">
          <h3>No places found</h3>
          <p>Try removing one or more filters.</p>
        </section>
      ) : (
        <>
          <section className="places-grid">
            {placesResponse.items.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </section>

          <PlacesPagination
            currentPage={placesResponse.page}
            totalPages={Math.ceil(placesResponse.total / placesResponse.limit)}
            indoor={indoor}
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
