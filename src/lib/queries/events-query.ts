import { MAX_LIMIT, MAX_PAGE } from "@/lib/constants/pagination";
import { invalidParam, InvalidQueryParamError } from "@/lib/errors";
import type { EventsFilter, PaginationParams } from "@/services/events.service";
import { EVENT_TYPES, EventType } from "@/lib/constants/event-types";

type ParsedEventsListQuery = {
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

export function parseEventsListQuery(
  searchParams: URLSearchParams,
): ParsedEventsListQuery {
  const type = parseEventType(searchParams.get("type"));

  const page = parsePositiveInteger(searchParams.get("page"), "page", MAX_PAGE);

  const limit = parsePositiveInteger(searchParams.get("limit"), "limit", MAX_LIMIT);

  return {
    filter: { type },
    pagination: { page, limit },
  };
}
