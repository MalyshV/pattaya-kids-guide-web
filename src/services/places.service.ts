import { prisma } from "@/db/prisma";
import type { PlacesFilter } from "@/lib/queries/places-query";
import type { Prisma } from "@prisma/client";

export type PlacesPaginationParams = {
  page?: number;
  limit?: number;
};

// В список тянем schedules — из них считается живой индикатор «открыто сейчас»
export type PlaceListItem = Prisma.PlaceGetPayload<{
  include: { schedules: true };
}>;

export type PaginatedPlacesResult = {
  items: PlaceListItem[];
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
    schedules: true;
    pricing: true;
    staffLanguages: {
      include: {
        language: true;
      };
    };
  };
}>;

function buildApprovedPlacesWhere(
  filter?: PlacesFilter,
  cityId?: string,
): Prisma.PlaceWhereInput {
  return {
    status: "APPROVED",
    ...(cityId ? { cityId } : {}),
    ...(filter?.indoor !== undefined ? { indoor: filter.indoor } : {}),
    ...(filter?.outdoor !== undefined ? { outdoor: filter.outdoor } : {}),
    ...(filter?.hasFood !== undefined ? { hasFood: filter.hasFood } : {}),
    ...(filter?.hasWifi !== undefined ? { hasWifi: filter.hasWifi } : {}),
    ...(filter?.canLeaveChild !== undefined
      ? { canLeaveChild: filter.canLeaveChild }
      : {}),
    ...(filter?.animalContact !== undefined
      ? { animalContact: filter.animalContact }
      : {}),
    // «Можно поработать» — композит, а не колонка: место с Wi-Fi, кондиционером и
    // возможностью посидеть в кафе (для родителя-удалёнщика)
    ...(filter?.workFriendly
      ? { hasWifi: true, hasAirCon: true, hasCafeSeating: true }
      : {}),
  };
}

export async function getApprovedPlaces(
  filter?: PlacesFilter,
  pagination?: PlacesPaginationParams,
  cityId?: string,
): Promise<PaginatedPlacesResult> {
  const page = pagination?.page && pagination.page > 0 ? pagination.page : 1;
  const limit = pagination?.limit && pagination.limit > 0 ? pagination.limit : 10;
  const skip = (page - 1) * limit;

  const where = buildApprovedPlacesWhere(filter, cityId);

  const [places, total] = await Promise.all([
    prisma.place.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        name: "asc",
      },
      include: {
        schedules: true,
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

/**
 * Все одобренные места города (со schedules), без пагинации — чтобы страница
 * могла отсортировать по живому статусу «открыто сейчас» глобально, а потом
 * нарезать на страницы в памяти. Пагинация в SQL тут не подходит: статус
 * вычисляемый, его нет в БД. При масштабе в тысячи мест на город это стоит
 * заменить на предвычисленный статус — пока в городе десятки мест, ок.
 */
export async function getAllApprovedPlaces(
  filter?: PlacesFilter,
  cityId?: string,
): Promise<PlaceListItem[]> {
  return prisma.place.findMany({
    where: buildApprovedPlacesWhere(filter, cityId),
    orderBy: { name: "asc" },
    include: { schedules: true },
  });
}

export async function getApprovedPlaceBySlug(
  slug: string,
  cityId?: string,
): Promise<PlaceDetailsResult | null> {
  return prisma.place.findFirst({
    where: {
      slug,
      status: "APPROVED",
      ...(cityId ? { cityId } : {}),
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
      schedules: true,
      pricing: true,
      staffLanguages: {
        include: {
          language: true,
        },
      },
    },
  });
}
