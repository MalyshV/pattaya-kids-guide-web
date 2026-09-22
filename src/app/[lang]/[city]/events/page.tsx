import Link from "next/link";
import { notFound } from "next/navigation";
import { AgeQuestion } from "@/components/common/age-question";
import { EventCard } from "@/components/events/event-card";
import { EventFilters } from "@/components/events/event-filters";
import { EventsPagination } from "@/components/events/events-pagination";
import { ViewToggle } from "@/components/common/view-toggle";
import { MapEmpty } from "@/components/common/map-empty";
import { PlacesMap, type PlaceMapMarker } from "@/components/places/places-map";
import { matchesAnyAgeBucket, parseAgeBuckets } from "@/lib/age/age-buckets";
import { mapEventListItemToDto } from "@/mappers/event.mapper";
import { eventToMapPoint } from "@/mappers/map-point.mapper";
import { getCityEvents } from "@/services/events.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { computeEventStatus, eventSortRank } from "@/lib/events/event-lifecycle";
import { eventTimingNote } from "@/lib/events/event-date";
import { getDictionary } from "@/content/dictionary";
import { localizedCityName } from "@/lib/i18n/localize";
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
    title: dict.events.heroTitle,
    // self-canonical: ?page=/фильтры не плодят дубли в индексе
    alternates: pageAlternates(lang, citySlug, "/events"),
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
  // ?view=map — карта вместо списка (те же вкладка и возраст)
  const viewParam = getSingleSearchParam(resolvedSearchParams.view);
  const view = parseListView(viewParam);

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
    // сырое событие рядом с DTO — из него точка карты (координаты места)
    .map((raw) => ({ raw, event: mapEventListItemToDto(raw, lang) }))
    .filter(({ event }) => matchesAnyAgeBucket(event, ageBuckets))
    .map(({ raw, event }) => {
      const startMs = event.startDate ? new Date(event.startDate).getTime() : 0;
      const status = event.startDate
        ? computeEventStatus(
            new Date(event.startDate),
            event.endDate ? new Date(event.endDate) : null,
            now,
          )
        : undefined;

      return { raw, event, status, startMs };
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

  // Карта — события вкладки без пагинации, но БЕЗ прошедших (решение
  // Вероники 22.09: на карте ищут, куда пойти; прошедшие остаются в списке)
  const mapCandidates =
    view === "map" ? eventsWithStatus.filter(({ status }) => status !== "past") : [];
  const mapPastCount = view === "map" ? total - mapCandidates.length : 0;
  const mapMarkers: PlaceMapMarker[] = mapCandidates.flatMap(({ raw, event, status }) => {
    const point = eventToMapPoint(raw, basePath, lang);
    return point
      ? [{ ...point, note: eventTimingNote(status, event.startDate, dict, lang) }]
      : [];
  });
  const mapMissingCount = mapCandidates.length - mapMarkers.length;
  // честность: счётчик выше считает весь список — называем, чего на карте нет
  // и почему; те же строки объясняют и совсем пустую карту
  const mapNotes = [
    ...(mapMissingCount > 0 ? [dict.events.mapMissingNote(mapMissingCount)] : []),
    ...(mapPastCount > 0 ? [dict.events.mapPastNote(mapPastCount)] : []),
  ];

  const listParams = { type, age: ageParam };
  const viewToggle = (
    <ViewToggle
      view={view}
      listHref={viewHref(`${basePath}/events`, listParams, "list")}
      mapHref={viewHref(`${basePath}/events`, listParams, "map")}
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
        <h1 className="hero-title">{dict.events.heroTitle}</h1>
        <p className="hero-description">{dict.events.heroDescription}</p>
      </section>

      <AgeQuestion
        pathname={`${basePath}/events`}
        activeBuckets={ageBuckets}
        preservedParams={{ type, view: viewParam === "map" ? "map" : undefined }}
      />

      <EventFilters type={type} basePath={basePath} age={ageParam} view={viewParam} />

      <section className="results-header" id="results">
        <div>
          <h2>{dict.events.sectionTitle}</h2>
          {/* role=status: после фильтрации скринридер озвучит счётчик */}
          <p role="status">{dict.events.count(total)}</p>
        </div>
      </section>

      {total === 0 ? (
        <section className="empty-state">
          <h3>{dict.events.emptyTitle}</h3>
          <p>{dict.events.emptyHint}</p>
          <Link
            href={viewHref(`${basePath}/events`, {}, view)}
            className="empty-state-cta"
          >
            {dict.events.emptyCta}
          </Link>
        </section>
      ) : view === "map" ? (
        <>
          {viewToggle}
          {mapMarkers.length === 0 ? (
            <MapEmpty
              title={dict.places.mapEmptyTitle}
              reasons={mapNotes}
              listHref={viewHref(`${basePath}/events`, listParams, "list")}
              listLabel={dict.places.mapShowList}
            />
          ) : (
            <>
              <PlacesMap
                markers={mapMarkers}
                userPoint={null}
                basePath={basePath}
                regionLabel={dict.events.mapRegionLabel}
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
