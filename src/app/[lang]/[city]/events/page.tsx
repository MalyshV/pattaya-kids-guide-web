import { notFound } from "next/navigation";
import { EventCard } from "@/components/events/event-card";
import { EventFilters } from "@/components/events/event-filters";
import { EventsPagination } from "@/components/events/events-pagination";
import { mapEventListItemToDto } from "@/mappers/event.mapper";
import { getAllApprovedEvents } from "@/services/events.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { computeEventStatus, eventSortRank } from "@/lib/events/event-lifecycle";
import { getDictionary } from "@/content/dictionary";
import { localizedCityName } from "@/lib/i18n/localize";
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination";
import {
  getSingleSearchParam,
  parsePositiveNumberParam,
} from "@/lib/params/search-params";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

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

  const dict = getDictionary(lang);
  const basePath = cityBasePath(lang, citySlug);
  const resolvedSearchParams = (await searchParams) ?? {};

  const typeParam = getSingleSearchParam(resolvedSearchParams.type);
  const pageParam = getSingleSearchParam(resolvedSearchParams.page);

  const type = parseEventType(typeParam);
  const currentPage = parsePositiveNumberParam(pageParam) ?? 1;

  const allEvents = await getAllApprovedEvents({ type }, city.id);
  const now = new Date();

  // Живой статус + сортировка: идёт сейчас → будущие (ближайшие выше) →
  // прошедшие в конец (свежие выше). Сортировка до пагинации, как у мест.
  const eventsWithStatus = allEvents
    .map((event) => mapEventListItemToDto(event, lang))
    .map((event) => {
      const startMs = event.startDate ? new Date(event.startDate).getTime() : 0;
      const status = event.startDate
        ? computeEventStatus(
            new Date(event.startDate),
            event.endDate ? new Date(event.endDate) : null,
            now,
          )
        : undefined;

      return { event, status, startMs };
    });

  eventsWithStatus.sort((a, b) => {
    const rank = eventSortRank(a.status) - eventSortRank(b.status);
    if (rank !== 0) {
      return rank;
    }
    return a.status === "past" ? b.startMs - a.startMs : a.startMs - b.startMs;
  });

  const total = eventsWithStatus.length;
  const totalPages = Math.max(1, Math.ceil(total / LIST_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = eventsWithStatus.slice(
    (safePage - 1) * LIST_PAGE_SIZE,
    safePage * LIST_PAGE_SIZE,
  );

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{localizedCityName(city, lang)}</p>
        <h1 className="hero-title">{dict.events.heroTitle}</h1>
        <p className="hero-description">{dict.events.heroDescription}</p>
      </section>

      <EventFilters type={type} basePath={basePath} />

      <section className="results-header">
        <div>
          <h2>{dict.events.sectionTitle}</h2>
          <p>{dict.events.count(total)}</p>
        </div>
      </section>

      {total === 0 ? (
        <section className="empty-state">
          <h3>{dict.events.emptyTitle}</h3>
          <p>{dict.events.emptyHint}</p>
        </section>
      ) : (
        <>
          <section className="events-grid">
            {pageItems.map(({ event, status }) => (
              <EventCard
                key={event.id}
                event={event}
                basePath={basePath}
                status={status}
              />
            ))}
          </section>

          <EventsPagination
            currentPage={safePage}
            totalPages={totalPages}
            type={type}
            basePath={basePath}
          />
        </>
      )}
    </main>
  );
}
