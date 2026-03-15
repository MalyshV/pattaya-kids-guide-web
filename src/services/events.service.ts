import { prisma } from "@/db/prisma";
import { EVENT_SORTING } from "@/lib/constants/event-sorting";
import type { EventType } from "@/lib/constants/event-types";
import { buildEventLifecycleWhere } from "@/lib/events/event-lifecycle";
import type { Event, Prisma } from "@prisma/client";

export type EventsFilter = {
  type?: EventType;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedEventsResult = {
  items: Event[];
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
): Prisma.EventWhereInput {
  const now = new Date();

  return {
    status: "APPROVED",
    ...(placeSlug
      ? {
          place: {
            slug: placeSlug,
            status: "APPROVED",
          },
        }
      : {}),
    ...buildEventLifecycleWhere(filter?.type, now),
  };
}

async function getApprovedEventsList(
  options: ApprovedEventsQueryOptions = {},
): Promise<PaginatedEventsResult> {
  const { filter, pagination, placeSlug } = options;

  const where = buildApprovedEventsWhere(filter, placeSlug);
  const { page, limit, skip } = getPaginationDefaults(pagination);
  const orderBy = getEventsOrderBy(filter?.type);

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy,
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
): Promise<PaginatedEventsResult> {
  return getApprovedEventsList({
    filter,
    pagination,
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

export async function getApprovedEventBySlug(
  slug: string,
): Promise<EventDetailsResult | null> {
  return prisma.event.findFirst({
    where: {
      slug,
      status: "APPROVED",
    },
    include: {
      place: true,
    },
  });
}
