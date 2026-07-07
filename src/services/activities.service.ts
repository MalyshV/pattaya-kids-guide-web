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
      place: { status: "APPROVED", cityId },
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
