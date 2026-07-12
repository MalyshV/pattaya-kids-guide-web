import { invalidParam } from "@/lib/errors";
import { parsePaginationParams } from "@/lib/queries/pagination-params";
import type { EventsFilter, PaginationParams } from "@/services/events.service";
import { EVENT_TYPES, type EventType } from "@/lib/constants/event-types";

export type ParsedEventsListQuery = {
  filter: EventsFilter;
  pagination: PaginationParams;
};

function parseEventType(value: string | null): EventType | undefined {
  if (value === null) {
    return undefined;
  }

  if (EVENT_TYPES.includes(value as EventType)) {
    return value as EventType;
  }

  throw invalidParam("type");
}

function parseCategorySlug(value: string | null): string | undefined {
  if (value === null) {
    return undefined;
  }

  const normalized = value.trim();

  if (!normalized) {
    throw invalidParam("category");
  }

  return normalized;
}

export function parseEventsListQuery(
  searchParams: URLSearchParams,
): ParsedEventsListQuery {
  const type = parseEventType(searchParams.get("type"));
  const categorySlug = parseCategorySlug(searchParams.get("category"));

  return {
    filter: {
      type,
      categorySlug,
    },
    pagination: parsePaginationParams(searchParams),
  };
}
