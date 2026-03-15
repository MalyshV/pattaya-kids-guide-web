import { MAX_LIMIT, MAX_PAGE } from "@/lib/constants/pagination";
import { invalidParam, InvalidQueryParamError } from "@/lib/errors";
import type { EventsFilter, PaginationParams } from "@/services/events.service";
import { EVENT_TYPES, type EventType } from "@/lib/constants/event-types";

export type ParsedEventsListQuery = {
  filter: EventsFilter;
  pagination: PaginationParams;
};

function parsePositiveInteger(
  value: string | null,
  paramName: string,
  max?: number,
): number | undefined {
  if (value === null) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw invalidParam(paramName);
  }

  if (max !== undefined && parsed > max) {
    throw new InvalidQueryParamError(`${paramName} exceeds maximum allowed value`);
  }

  return parsed;
}

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
  const page = parsePositiveInteger(searchParams.get("page"), "page", MAX_PAGE);
  const limit = parsePositiveInteger(searchParams.get("limit"), "limit", MAX_LIMIT);

  return {
    filter: {
      type,
      categorySlug,
    },
    pagination: {
      page,
      limit,
    },
  };
}
