import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants/pagination";

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ResolvedPagination = {
  page: number;
  limit: number;
  skip: number;
};

/**
 * Дефолты страницы/лимита для выборок из БД — одна точка правды для всех
 * сервисов (раньше 1/10 были вписаны литералами в events- и places-сервис
 * порознь). Невалидные значения query отсекаются раньше, в pagination-params;
 * сюда приходит либо число >0, либо undefined → дефолт.
 */
export function resolvePagination(pagination?: {
  page?: number;
  limit?: number;
}): ResolvedPagination {
  const page = pagination?.page && pagination.page > 0 ? pagination.page : DEFAULT_PAGE;
  const limit =
    pagination?.limit && pagination.limit > 0 ? pagination.limit : DEFAULT_LIMIT;

  return { page, limit, skip: (page - 1) * limit };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
