import { prisma } from "@/db/prisma";
import type { Prisma } from "@prisma/client";

export type EventsFilter = {
  type?: "upcoming" | "ongoing" | "past";
};

export async function getApprovedEvents(filter?: EventsFilter) {
  const now = new Date();

  const where: Prisma.EventWhereInput = {
  status: "APPROVED",
}

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

  return prisma.event.findMany({
    where,
    orderBy: {
      startDate: "asc",
    },
  });
}
