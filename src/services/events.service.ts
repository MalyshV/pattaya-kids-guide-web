import { cache } from "react";
import { prisma } from "@/db/prisma";
import { cachedQuery } from "@/lib/cache/data-cache";
import { EVENT_SORTING } from "@/lib/constants/event-sorting";
import type { EventType } from "@/lib/constants/event-types";
import { demoFilter } from "@/lib/demo/show-demo";
import { buildEventLifecycleWhere } from "@/lib/events/event-lifecycle";
import { resolvePagination } from "@/lib/pagination";
import type { Event, Prisma } from "@prisma/client";

export type EventsFilter = {
  type?: EventType;
  categorySlug?: string;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type EventWithPlace = Prisma.EventGetPayload<{
  include: {
    place: true;
  };
}>;

export type PaginatedEventsResult = {
  items: EventWithPlace[];
  total: number;
  page: number;
  limit: number;
};

export type EventDetailsResult = Prisma.EventGetPayload<{
  include: {
    place: true;
  };
}>;

type ApprovedEventsQueryOptions = {
  filter?: EventsFilter;
  pagination?: PaginationParams;
  placeSlug?: string;
  cityId?: string;
};

function getEventsOrderBy(type?: EventType): Prisma.EventOrderByWithRelationInput {
  if (!type) {
    return EVENT_SORTING.default;
  }

  return EVENT_SORTING[type];
}

function buildApprovedEventsWhere(
  filter?: EventsFilter,
  placeSlug?: string,
  cityId?: string,
): Prisma.EventWhereInput {
  const now = new Date();

  return {
    status: "APPROVED",
    ...demoFilter(),
    ...(cityId ? { cityId } : {}),
    ...(placeSlug
      ? {
          place: {
            slug: placeSlug,
            status: "APPROVED",
          },
        }
      : {}),
    ...(filter?.categorySlug
      ? {
          categories: {
            some: {
              category: {
                slug: filter.categorySlug,
              },
            },
          },
        }
      : {}),
    ...buildEventLifecycleWhere(filter?.type, now),
  };
}

async function getApprovedEventsList(
  options: ApprovedEventsQueryOptions = {},
): Promise<PaginatedEventsResult> {
  const { filter, pagination, placeSlug, cityId } = options;

  const where = buildApprovedEventsWhere(filter, placeSlug, cityId);
  const { page, limit, skip } = resolvePagination(pagination);
  const orderBy = getEventsOrderBy(filter?.type);

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        place: true,
      },
    }),
    prisma.event.count({ where }),
  ]);

  return {
    items: events,
    total,
    page,
    limit,
  };
}

export async function getApprovedEvents(
  filter?: EventsFilter,
  pagination?: PaginationParams,
  cityId?: string,
): Promise<PaginatedEventsResult> {
  return getApprovedEventsList({
    filter,
    pagination,
    cityId,
  });
}

/**
 * Все одобренные события города (без пагинации) — чтобы страница отсортировала
 * по живому статусу (идёт сейчас → будущие → прошедшие) до нарезки на страницы.
 * getApprovedEvents (для /api) остаётся с SQL-пагинацией нетронутым.
 *
 * Кэш между запросами, поэтому БЕЗ фильтра вкладки в SQL: условие «прошло/идёт»
 * зависит от «сейчас» и замерло бы вместе с кэшем — вкладки фильтрует страница
 * по живому статусу поверх кэша. Даты на кэш-хите — строки (mapper терпим).
 */
export const getCityEvents = cachedQuery(
  "events-all",
  ["events", "places"],
  async (cityId: string): Promise<EventWithPlace[]> => {
    return prisma.event.findMany({
      where: { status: "APPROVED", ...demoFilter(), cityId },
      orderBy: { startDate: "asc" },
      include: { place: true },
    });
  },
);

export async function getApprovedEventsByPlaceSlug(
  placeSlug: string,
  filter?: EventsFilter,
  pagination?: PaginationParams,
): Promise<PaginatedEventsResult> {
  return getApprovedEventsList({
    filter,
    pagination,
    placeSlug,
  });
}

// React cache — дедуп между generateMetadata и страницей; cachedQuery — между
// запросами. Страница события работает через DTO (даты уже строки) — кэш-хит
// со строковыми датами ей не страшен.
export const getApprovedEventBySlug = cache(
  cachedQuery(
    "event-by-slug",
    ["events", "places"],
    async function getApprovedEventBySlug(
      slug: string,
      cityId?: string,
    ): Promise<EventDetailsResult | null> {
      return prisma.event.findFirst({
        where: {
          slug,
          status: "APPROVED",
          ...demoFilter(),
          ...(cityId ? { cityId } : {}),
        },
        include: {
          place: true,
        },
      });
    },
  ),
);

// кэшируем ВСЕ одобренные события места (без «сейчас» и take в SQL — время
// замерло бы вместе с кэшем); будущее и первые 5 отбираются поверх кэша
const getApprovedEventsByPlaceIdCached = cachedQuery(
  "events-by-place",
  ["events"],
  async (placeId: string): Promise<Event[]> => {
    return prisma.event.findMany({
      where: {
        placeId,
        status: "APPROVED",
        ...demoFilter(),
      },
      orderBy: {
        startDate: "asc",
      },
    });
  },
);

/** Ближайшие 5 будущих событий места (блок «скоро здесь» на детальной). */
export async function getUpcomingApprovedEventsByPlaceId(
  placeId: string,
): Promise<Event[]> {
  const events = await getApprovedEventsByPlaceIdCached(placeId);
  const now = new Date();

  return events.filter((event) => new Date(event.startDate) > now).slice(0, 5);
}
