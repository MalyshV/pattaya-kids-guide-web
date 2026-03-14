import { InvalidQueryParamError } from "@/lib/errors";
import type { EventsFilter, PaginationParams } from "@/services/events.service";

type ParsedEventsListQuery = {
  filter: EventsFilter;
  pagination: PaginationParams;
};

function parsePositiveInteger(
  value: string | null,
  paramName: string,
): number | undefined {
  if (value === null) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new InvalidQueryParamError(`Invalid ${paramName} parameter`);
  }

  return parsed;
}

function parseEventType(value: string | null): EventsFilter["type"] {
  if (value === null) {
    return undefined;
  }

  if (value === "upcoming" || value === "ongoing" || value === "past") {
    return value;
  }

  throw new InvalidQueryParamError("Invalid type parameter");
}

export function parseEventsListQuery(
  searchParams: URLSearchParams,
): ParsedEventsListQuery {
  const type = parseEventType(searchParams.get("type"));
  const page = parsePositiveInteger(searchParams.get("page"), "page");
  const limit = parsePositiveInteger(searchParams.get("limit"), "limit");

  return {
    filter: { type },
    pagination: { page, limit },
  };
}
