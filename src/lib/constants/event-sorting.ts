import type { Prisma } from "@prisma/client";
import type { EventType } from "@/lib/constants/event-types";

type EventSortingMap = Record<
  EventType | "default",
  Prisma.EventOrderByWithRelationInput
>;

export const EVENT_SORTING: EventSortingMap = {
  upcoming: {
    startDate: "asc",
  },
  ongoing: {
    startDate: "asc",
  },
  past: {
    startDate: "desc",
  },
  default: {
    startDate: "asc",
  },
};
