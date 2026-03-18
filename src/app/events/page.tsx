import { EventCard } from "@/components/events/event-card";
import { EventFilters } from "@/components/events/event-filters";
import { EventsPagination } from "@/components/events/events-pagination";
import { mapEventListItemToDto } from "@/mappers/event.mapper";
import { getApprovedEvents } from "@/services/events.service";

type PageProps = {
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

export default async function EventsPage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
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
  );

  const items = eventsResponse.items.map(mapEventListItemToDto);
  const totalPages = Math.ceil(eventsResponse.total / eventsResponse.limit);

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Pattaya Kids Guide</p>
        <h1 className="hero-title">Events for families in Pattaya</h1>
        <p className="hero-description">
          Browse upcoming, ongoing, and past events using the first frontend screen for
          the events flow.
        </p>
      </section>

      <EventFilters type={type} />

      <section className="results-header">
        <div>
          <h2 className="section-title">Events</h2>
          <p className="section-subtitle">Found: {eventsResponse.total}</p>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="empty-state">
          <h3>No events found</h3>
          <p>Try another lifecycle filter.</p>
        </section>
      ) : (
        <>
          <section className="places-grid">
            {items.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </section>

          <EventsPagination
            currentPage={eventsResponse.page}
            totalPages={totalPages}
            type={type}
          />
        </>
      )}
    </main>
  );
}
