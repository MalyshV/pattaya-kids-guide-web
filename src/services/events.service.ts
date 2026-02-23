import { prisma } from "@/db/prisma";
import type { Prisma } from "@prisma/client";

export type EventsFilter = {
  type?: "upcoming" | "ongoing" | "past";
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedEventsResult = {
  items: Awaited<ReturnType<typeof prisma.event.findMany>>;
  total: number;
  page: number;
  limit: number;
};

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

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        startDate: "asc",
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
