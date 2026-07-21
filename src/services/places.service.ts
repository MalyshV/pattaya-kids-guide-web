import { cache } from "react";
import { prisma } from "@/db/prisma";
import { cachedQuery } from "@/lib/cache/data-cache";
import { demoFilter } from "@/lib/demo/show-demo";
import { resolvePagination } from "@/lib/pagination";
import { buildApprovedPlacesWhere } from "@/lib/queries/places-where";
import type { PlacesFilter } from "@/lib/queries/places-query";
import type { Prisma } from "@prisma/client";

export type PlacesPaginationParams = {
  page?: number;
  limit?: number;
};

// В список тянем schedules (живой индикатор «открыто сейчас») и ageGroups
// (сквозной фильтр «Сколько лет ребёнку?»)
export type PlaceListItem = Prisma.PlaceGetPayload<{
  include: { schedules: true; ageGroups: { include: { ageGroup: true } } };
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
    entryPrices: true;
    photos: true;
    staffLanguages: {
      include: {
        language: true;
      };
    };
    tips: true;
    contacts: true;
    programs: true;
  };
}>;

export async function getApprovedPlaces(
  filter?: PlacesFilter,
  pagination?: PlacesPaginationParams,
  cityId?: string,
): Promise<PaginatedPlacesResult> {
  const { page, limit, skip } = resolvePagination(pagination);

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
        ageGroups: { include: { ageGroup: true } },
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
 *
 * Кэш между запросами (ключ — фильтры+город): where не зависит от «сейчас»,
 * живой статус страница считает ПОСЛЕ выборки. На кэш-хите createdAt приходит
 * строкой — compareCatalogOrder к этому терпим.
 */
export const getAllApprovedPlaces = cachedQuery(
  "places-all",
  ["places"],
  async (filter?: PlacesFilter, cityId?: string): Promise<PlaceListItem[]> => {
    return prisma.place.findMany({
      where: buildApprovedPlacesWhere(filter, cityId),
      orderBy: { name: "asc" },
      include: { schedules: true, ageGroups: { include: { ageGroup: true } } },
    });
  },
);

// Площадки дня рождения для лендинга «Дни рождения»: одобренные места города,
// где подтверждён факт «проводят» (birthdayInfo.hasPackages). Контакты — чтобы
// родитель мог связаться прямо с лендинга.
export type BirthdayPlace = Prisma.PlaceGetPayload<{
  include: {
    birthdayInfo: true;
    contacts: true;
  };
}>;

export const getBirthdayPlaces = cachedQuery(
  "birthday-places",
  ["places"],
  async (cityId: string): Promise<BirthdayPlace[]> => {
    return prisma.place.findMany({
      where: {
        status: "APPROVED",
        ...demoFilter(),
        cityId,
        birthdayInfo: { hasPackages: true },
      },
      orderBy: { name: "asc" },
      include: {
        birthdayInfo: true,
        contacts: { orderBy: { order: "asc" } },
      },
    });
  },
);

// React cache — дедуп между generateMetadata и страницей в рамках запроса;
// cachedQuery — между запросами. На кэш-хите tips.verifiedAt приходит строкой —
// place-details.mapper возвращает его к Date.
export const getApprovedPlaceBySlug = cache(
  cachedQuery(
    "place-by-slug",
    ["places"],
    async function getApprovedPlaceBySlug(
      slug: string,
      cityId?: string,
    ): Promise<PlaceDetailsResult | null> {
      return prisma.place.findFirst({
        where: {
          slug,
          status: "APPROVED",
          ...demoFilter(),
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
          entryPrices: {
            orderBy: {
              order: "asc",
            },
          },
          photos: {
            orderBy: {
              order: "asc",
            },
          },
          staffLanguages: {
            include: {
              language: true,
            },
          },
          tips: {
            orderBy: {
              order: "asc",
            },
          },
          contacts: {
            orderBy: {
              order: "asc",
            },
          },
          programs: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    },
  ),
);
