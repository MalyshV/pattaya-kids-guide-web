import Link from "next/link";
import { notFound } from "next/navigation";
import { AgeQuestion } from "@/components/common/age-question";
import { EventCard } from "@/components/events/event-card";
import { EventFilters } from "@/components/events/event-filters";
import { EventsPagination } from "@/components/events/events-pagination";
import { matchesAnyAgeBucket, parseAgeBuckets } from "@/lib/age/age-buckets";
import { mapEventListItemToDto } from "@/mappers/event.mapper";
import { getCityEvents } from "@/services/events.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { computeEventStatus, eventSortRank } from "@/lib/events/event-lifecycle";
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
  const dict = getDictionary(lang);
  return {
    // свой title: иначе все вкладки браузера называются одинаково по городу
    title: `${dict.events.heroTitle} — ${dict.brand}`,
    // self-canonical: ?page=/фильтры не плодят дубли в индексе
    alternates: listPageAlternates(lang, citySlug, "/events"),
  };
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

  const dict = getDictionary(lang);
  const basePath = cityBasePath(lang, citySlug);
  const resolvedSearchParams = (await searchParams) ?? {};

  const typeParam = getSingleSearchParam(resolvedSearchParams.type);
  const pageParam = getSingleSearchParam(resolvedSearchParams.page);
  const ageParam = getSingleSearchParam(resolvedSearchParams.age);

  const type = parseEventType(typeParam);
  const currentPage = parsePositiveNumberParam(pageParam) ?? 1;
  const ageBuckets = parseAgeBuckets(ageParam);

  // выборка кэшируется целиком (без вкладки в SQL — «сейчас» замерло бы в
  // кэше); вкладку идёт/будущие/прошедшие фильтруем ниже по живому статусу
  const allEvents = await getCityEvents(city.id);
  const now = new Date();

  // Живой статус + сортировка: идёт сейчас → будущие (ближайшие выше) →
  // прошедшие в конец (свежие выше). Сортировка до пагинации, как у мест.
  // Возрастной фильтр — как у занятий: событие без возраста не прячем.
  const eventsWithStatus = allEvents
    .map((event) => mapEventListItemToDto(event, lang))
    .filter((event) => matchesAnyAgeBucket(event, ageBuckets))
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
    })
    // вкладка типа — та же логика, что раньше в SQL (buildEventLifecycleWhere),
    // только по вычисленному статусу
    .filter((entry) => (type ? entry.status === type : true));

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

      <AgeQuestion
        pathname={`${basePath}/events`}
        activeBuckets={ageBuckets}
        preservedParams={{ type }}
      />

      <EventFilters type={type} basePath={basePath} age={ageParam} />

      <section className="results-header" id="results">
        <div>
          <h2>{dict.events.sectionTitle}</h2>
          <p>{dict.events.count(total)}</p>
        </div>
      </section>

      {total === 0 ? (
        <section className="empty-state">
          <h3>{dict.events.emptyTitle}</h3>
          <p>{dict.events.emptyHint}</p>
          <Link href={`${basePath}/events`} className="empty-state-cta">
            {dict.events.emptyCta}
          </Link>
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
            age={ageParam}
            basePath={basePath}
          />
        </>
      )}
    </main>
  );
}
