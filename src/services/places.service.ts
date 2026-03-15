import { prisma } from "@/db/prisma";
import type { Place } from "@prisma/client";

export type PlacesPaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedPlacesResult = {
  items: Place[];
  total: number;
  page: number;
  limit: number;
};

export async function getApprovedPlaces(
  pagination?: PlacesPaginationParams,
): Promise<PaginatedPlacesResult> {
  const page = pagination?.page && pagination.page > 0 ? pagination.page : 1;
  const limit = pagination?.limit && pagination.limit > 0 ? pagination.limit : 10;
  const skip = (page - 1) * limit;

  const where = {
    status: "APPROVED" as const,
  };

  const [places, total] = await Promise.all([
    prisma.place.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        name: "asc",
      },
    }),
    prisma.place.count({ where }),
  ]);

  return {
    items: places,
    total,
    page,
    limit,
  };
}
