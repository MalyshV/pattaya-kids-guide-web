import { notFound } from "next/navigation";
import { EventCard } from "@/components/events/event-card";
import { EventFilters } from "@/components/events/event-filters";
import { EventsPagination } from "@/components/events/events-pagination";
import { mapEventListItemToDto } from "@/mappers/event.mapper";
import { getApprovedEvents } from "@/services/events.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
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

function parseEventType(
  value: string | undefined,
): "upcoming" | "ongoing" | "past" | undefined {
  if (value === "upcoming" || value === "ongoing" || value === "past") {
    return value;
  }

  return undefined;
}

export default async function CityEventsPage({
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

  const typeParam = getSingleSearchParam(resolvedSearchParams.type);
  const pageParam = getSingleSearchParam(resolvedSearchParams.page);

  const type = parseEventType(typeParam);
  const currentPage = parsePositiveNumberParam(pageParam) ?? 1;

  const eventsResponse = await getApprovedEvents(
    {
      type,
    },
    {
      page: currentPage,
      limit: 6,
    },
    city.id,
  );

  const items = eventsResponse.items.map(mapEventListItemToDto);
  const totalPages = Math.ceil(eventsResponse.total / eventsResponse.limit);
  const total = eventsResponse.total;

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{ru.brand}</p>
        <h1 className="hero-title">{ru.events.heroTitle}</h1>
        <p className="hero-description">{ru.events.heroDescription}</p>
      </section>

      <EventFilters type={type} basePath={basePath} />

      <section className="results-header">
        <div>
          <h2>{ru.events.sectionTitle}</h2>
          <p>{ru.events.count(total)}</p>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="empty-state">
          <h3>{ru.events.emptyTitle}</h3>
          <p>{ru.events.emptyHint}</p>
        </section>
      ) : (
        <>
          <section className="events-grid">
            {items.map((event) => (
              <EventCard key={event.id} event={event} basePath={basePath} />
            ))}
          </section>

          <EventsPagination
            currentPage={eventsResponse.page}
            totalPages={totalPages}
            type={type}
            basePath={basePath}
          />
        </>
      )}
    </main>
  );
}
