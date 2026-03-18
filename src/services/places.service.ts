import { prisma } from "@/db/prisma";
import type { PlacesFilter } from "@/lib/queries/places-query";
import type { Place, Prisma } from "@prisma/client";

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

type PlaceDetailsResult = Prisma.PlaceGetPayload<{
  include: {
    categories: {
      include: {
        category: true;
      };
    };
    amenities: {
      include: {
        amenity: {
          include: {
            group: true;
          };
        };
      };
    };
    ageGroups: {
      include: {
        ageGroup: true;
      };
    };
    birthdayInfo: true;
  };
}>;

function buildApprovedPlacesWhere(filter?: PlacesFilter): Prisma.PlaceWhereInput {
  return {
    status: "APPROVED",
    ...(filter?.indoor !== undefined ? { indoor: filter.indoor } : {}),
    ...(filter?.hasFood !== undefined ? { hasFood: filter.hasFood } : {}),
    ...(filter?.hasWifi !== undefined ? { hasWifi: filter.hasWifi } : {}),
    ...(filter?.canLeaveChild !== undefined
      ? { canLeaveChild: filter.canLeaveChild }
      : {}),
    ...(filter?.animalContact !== undefined
      ? { animalContact: filter.animalContact }
      : {}),
  };
}

export async function getApprovedPlaces(
  filter?: PlacesFilter,
  pagination?: PlacesPaginationParams,
): Promise<PaginatedPlacesResult> {
  const page = pagination?.page && pagination.page > 0 ? pagination.page : 1;
  const limit = pagination?.limit && pagination.limit > 0 ? pagination.limit : 10;
  const skip = (page - 1) * limit;

  const where = buildApprovedPlacesWhere(filter);

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

export async function getApprovedPlaceBySlug(
  slug: string,
): Promise<PlaceDetailsResult | null> {
  return prisma.place.findFirst({
    where: {
      slug,
      status: "APPROVED",
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      amenities: {
        include: {
          amenity: {
            include: {
              group: true,
            },
          },
        },
      },
      ageGroups: {
        include: {
          ageGroup: true,
        },
      },
      birthdayInfo: true,
    },
  });
}
