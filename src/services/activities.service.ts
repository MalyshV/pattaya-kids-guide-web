import { cache } from "react";
import { prisma } from "@/db/prisma";
import type { Prisma } from "@prisma/client";

export type ActivityWithPlace = Prisma.PlaceProgramGetPayload<{
  include: {
    place: true;
    categories: {
      include: {
        category: true;
      };
    };
  };
}>;

/**
 * Сквозная витрина «Занятия» (вторая ось продукта, activity-first): все
 * регулярные занятия (COURSE) и лагеря (CAMP) города — независимо от места,
 * вместе с местом и категориями. Абонементы (MEMBERSHIP) сюда НЕ входят: это
 * тариф места, а не занятие. Сортировку по актуальности (прошедшие лагеря вниз)
 * применяет страница — статус зависит от «сейчас».
 */
export const getCityActivities = cache(async function getCityActivities(
  cityId: string,
): Promise<ActivityWithPlace[]> {
  return prisma.placeProgram.findMany({
    where: {
      type: { in: ["COURSE", "CAMP"] },
      // либо занятие одобренного места города, либо безместное того же города
      OR: [{ place: { status: "APPROVED", cityId } }, { placeId: null, cityId }],
    },
    include: {
      place: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
});

/**
 * Одно занятие по slug для собственной страницы `/activities/[slug]`. Только
 * COURSE/CAMP одобренного места этого города (абонементы страницы не имеют —
 * у них slug=null). React cache: generateMetadata и страница зовут дважды с
 * теми же аргументами → один запрос в БД.
 */
export const getActivityBySlug = cache(async function getActivityBySlug(
  slug: string,
  cityId: string,
): Promise<ActivityWithPlace | null> {
  return prisma.placeProgram.findFirst({
    where: {
      slug,
      type: { in: ["COURSE", "CAMP"] },
      OR: [{ place: { status: "APPROVED", cityId } }, { placeId: null, cityId }],
    },
    include: {
      place: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
});
