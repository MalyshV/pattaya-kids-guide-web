import type { Prisma } from "@prisma/client";
import type { EventType } from "@/lib/constants/event-types";

export function buildEventLifecycleWhere(
  type: EventType | undefined,
  now: Date,
): Prisma.EventWhereInput {
  if (!type) {
    return {};
  }

  if (type === "upcoming") {
    return {
      startDate: { gt: now },
    };
  }

  if (type === "ongoing") {
    return {
      startDate: { lte: now },
      endDate: { gte: now },
    };
  }

  if (type === "past") {
    return {
      endDate: { lt: now },
    };
  }

  return {};
}
