import { prisma } from "@/db/prisma";
import type { Prisma, Event } from "@prisma/client";

export type EventsFilter = {
  type?: "upcoming" | "ongoing" | "past";
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

function getEventsOrderBy(
  type?: EventsFilter["type"],
): Prisma.EventOrderByWithRelationInput {
  if (type === "past") {
    return {
      startDate: "desc",
    };
  }

  return {
    startDate: "asc",
  };
}

export async function getApprovedEvents(
  filter?: EventsFilter,
  pagination?: PaginationParams,
): Promise<PaginatedEventsResult> {
  const now = new Date();

  const where: Prisma.EventWhereInput = {
    status: "APPROVED",
  };

  if (filter?.type === "upcoming") {
    where.startDate = { gt: now };
  }

  if (filter?.type === "ongoing") {
    where.startDate = { lte: now };
    where.endDate = { gte: now };
  }

  if (filter?.type === "past") {
    where.endDate = { lt: now };
  }

  const page = pagination?.page && pagination.page > 0 ? pagination.page : 1;
  const limit = pagination?.limit && pagination.limit > 0 ? pagination.limit : 10;
  const skip = (page - 1) * limit;

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

export async function getApprovedEventBySlug(slug: string): Promise<Event | null> {
  return prisma.event.findFirst({
    where: {
      slug,
      status: "APPROVED",
    },
  });
}
