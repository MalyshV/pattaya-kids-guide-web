import { cache } from "react";
import { prisma } from "@/db/prisma";
import { EVENT_SORTING } from "@/lib/constants/event-sorting";
import type { EventType } from "@/lib/constants/event-types";
import { buildEventLifecycleWhere } from "@/lib/events/event-lifecycle";
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

function getPaginationDefaults(pagination?: PaginationParams): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = pagination?.page && pagination.page > 0 ? pagination.page : 1;
  const limit = pagination?.limit && pagination.limit > 0 ? pagination.limit : 10;
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
}

function buildApprovedEventsWhere(
  filter?: EventsFilter,
  placeSlug?: string,
  cityId?: string,
): Prisma.EventWhereInput {
  const now = new Date();

  return {
    status: "APPROVED",
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
  const { page, limit, skip } = getPaginationDefaults(pagination);
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
 */
export async function getAllApprovedEvents(
  filter?: EventsFilter,
  cityId?: string,
): Promise<EventWithPlace[]> {
  return prisma.event.findMany({
    where: buildApprovedEventsWhere(filter, undefined, cityId),
    orderBy: { startDate: "asc" },
    include: { place: true },
  });
}

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

// React cache: дедуп между generateMetadata и страницей (один запрос в БД)
export const getApprovedEventBySlug = cache(async function getApprovedEventBySlug(
  slug: string,
  cityId?: string,
): Promise<EventDetailsResult | null> {
  return prisma.event.findFirst({
    where: {
      slug,
      status: "APPROVED",
      ...(cityId ? { cityId } : {}),
    },
    include: {
      place: true,
    },
  });
});

export async function getUpcomingApprovedEventsByPlaceId(
  placeId: string,
): Promise<Event[]> {
  const now = new Date();

  return prisma.event.findMany({
    where: {
      placeId,
      status: "APPROVED",
      startDate: {
        gt: now,
      },
    },
    orderBy: {
      startDate: "asc",
    },
    take: 5,
  });
}
