import { cache } from "react";
import { prisma } from "@/db/prisma";
import { demoFilter } from "@/lib/demo/show-demo";

/**
 * Данные для поискового индекса города: одобренные места + занятия со своей
 * страницей (COURSE/CAMP со slug). Только публичные поля — индекс уходит
 * в браузер целиком. Сборку DTO делает mapSearchIndex (mapper).
 */

// у Place нет nameEn: название места — имя собственное, оно не переводится
export type SearchPlaceRow = {
  id: string;
  name: string;
  slug: string;
  address: string;
  categories: Array<{ category: { name: string; nameEn: string | null } }>;
};

export type SearchActivityRow = {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string | null;
  venueName: string | null;
  venueNameEn: string | null;
  place: { name: string } | null;
  categories: Array<{ category: { name: string; nameEn: string | null } }>;
};

export const getSearchRows = cache(async function getSearchRows(
  cityId: string,
): Promise<{ places: SearchPlaceRow[]; activities: SearchActivityRow[] }> {
  const [places, activities] = await Promise.all([
    prisma.place.findMany({
      where: { status: "APPROVED", cityId, ...demoFilter() },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        categories: {
          select: { category: { select: { name: true, nameEn: true } } },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.placeProgram.findMany({
      where: {
        type: { in: ["COURSE", "CAMP"] },
        slug: { not: null },
        ...demoFilter(),
        // демо-фильтр и на месте: не-демо занятие демо-места — тоже демо
        OR: [
          { place: { status: "APPROVED", cityId, ...demoFilter() } },
          { placeId: null, cityId },
        ],
      },
      select: {
        id: true,
        name: true,
        nameEn: true,
        slug: true,
        venueName: true,
        venueNameEn: true,
        place: { select: { name: true } },
        categories: {
          select: { category: { select: { name: true, nameEn: true } } },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return { places, activities };
});
