import { demoFilter } from "@/lib/demo/show-demo";
import type { PlacesFilter } from "@/lib/queries/places-query";
import type { Prisma } from "@prisma/client";

/**
 * Prisma-where для публичной выборки мест: только одобренные, без демо (на
 * проде), опционально по городу и фильтрам. Честность tri-state: булев фильтр
 * применяется, только если он задан (undefined → колонку не трогаем), а
 * композиты кодируют true явно — null-места НЕ проходят как «есть».
 *
 * Вынесено из places.service (где prisma) отдельным чистым модулем, чтобы
 * покрыть тестом эту честность-критичную логику без импорта БД.
 */
export function buildApprovedPlacesWhere(
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
