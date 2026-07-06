import type { Prisma } from "@prisma/client";
import type { EventType } from "@/lib/constants/event-types";

export type EventLifecycle = "upcoming" | "ongoing" | "past";

/**
 * Живой статус события на момент запроса. Согласован с buildEventLifecycleWhere:
 * ещё не началось → upcoming; идёт (есть endDate и он в будущем) → ongoing;
 * иначе (уже закончилось или точечное в прошлом) → past.
 */
export function computeEventStatus(
  startDate: Date,
  endDate: Date | null,
  now: Date,
): EventLifecycle {
  if (startDate > now) {
    return "upcoming";
  }
  if (endDate && endDate >= now) {
    return "ongoing";
  }
  return "past";
}

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
