import { MAX_LIMIT, MAX_PAGE } from "@/lib/constants/pagination";
import { invalidParam, InvalidQueryParamError } from "@/lib/errors";

/**
 * Разбор page/limit из query публичных GET-ручек. Общий для /api/places и
 * /api/events, чтобы оба вели себя одинаково на кривом вводе: нецелое,
 * ноль/отрицательное или превышающее потолок → 400 (а не 500 от Prisma и не
 * безлимитный take в базу). Отсутствие параметра — норма (undefined → дефолт
 * подставит сервис).
 */

export type PaginationQuery = {
  page?: number;
  limit?: number;
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

export function parsePaginationParams(searchParams: URLSearchParams): PaginationQuery {
  return {
    page: parsePositiveInteger(searchParams.get("page"), "page", MAX_PAGE),
    limit: parsePositiveInteger(searchParams.get("limit"), "limit", MAX_LIMIT),
  };
}
