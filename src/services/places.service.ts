import { cache } from "react";
import { prisma } from "@/db/prisma";
import { demoFilter } from "@/lib/demo/show-demo";
import { resolvePagination } from "@/lib/pagination";
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

function buildApprovedPlacesWhere(
  filter?: PlacesFilter,
  cityId?: string,
): Prisma.PlaceWhereInput {
  return {
    status: "APPROVED",
    ...demoFilter(),
    ...(cityId ? { cityId } : {}),
    ...(filter?.indoor !== undefined ? { indoor: filter.indoor } : {}),
    ...(filter?.outdoor !== undefined ? { outdoor: filter.outdoor } : {}),
    ...(filter?.hasFood !== undefined ? { hasFood: filter.hasFood } : {}),
    ...(filter?.hasWifi !== undefined ? { hasWifi: filter.hasWifi } : {}),
    ...(filter?.hasAirCon !== undefined ? { hasAirCon: filter.hasAirCon } : {}),
    ...(filter?.hasParking !== undefined ? { hasParking: filter.hasParking } : {}),
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
    // «Спрятаться от жары/дождя» — композит: укрытие сверху (в помещении ИЛИ
    // навесы) И охлаждение (кондиционер ИЛИ вентиляторы). Ловит и «коробку с
    // AC», и открытую площадку с навесами+вентиляторами (напр. Pa Boon Cafe).
    // tri-state честно: null-поля не проходят как true.
    ...(filter?.shelter
      ? {
          AND: [
            { OR: [{ indoor: true }, { hasCoveredArea: true }] },
            { OR: [{ hasAirCon: true }, { hasFans: true }] },
          ],
        }
      : {}),
  };
}

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
 */
export async function getAllApprovedPlaces(
  filter?: PlacesFilter,
  cityId?: string,
): Promise<PlaceListItem[]> {
  return prisma.place.findMany({
    where: buildApprovedPlacesWhere(filter, cityId),
    orderBy: { name: "asc" },
    include: { schedules: true, ageGroups: { include: { ageGroup: true } } },
  });
}

// Площадки дня рождения для лендинга «Дни рождения»: одобренные места города,
// где подтверждён факт «проводят» (birthdayInfo.hasPackages). Контакты — чтобы
// родитель мог связаться прямо с лендинга.
export type BirthdayPlace = Prisma.PlaceGetPayload<{
  include: {
    birthdayInfo: true;
    contacts: true;
  };
}>;

export async function getBirthdayPlaces(cityId: string): Promise<BirthdayPlace[]> {
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
}

// React cache: generateMetadata и страница зовут функцию с теми же аргументами —
// в БД в рамках одного запроса уходит один запрос
export const getApprovedPlaceBySlug = cache(async function getApprovedPlaceBySlug(
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
});
