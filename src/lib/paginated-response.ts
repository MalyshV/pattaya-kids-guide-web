import { buildPaginationMeta, type PaginationMeta } from "@/lib/pagination";

type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export function buildPaginatedResponse<TItem, TDto>(
  items: TItem[],
  total: number,
  page: number,
  limit: number,
  mapItem: (item: TItem) => TDto,
): PaginatedResponse<TDto> {
  return {
    data: items.map(mapItem),
    meta: buildPaginationMeta(total, page, limit),
  };
}
