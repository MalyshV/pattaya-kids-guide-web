import { cache } from "react";
import { prisma } from "@/db/prisma";
import { demoFilter } from "@/lib/demo/show-demo";

/**
 * Данные для поискового индекса города: одобренные места + занятия со своей
 * страницей (COURSE/CAMP со slug) + актуальные события (идущие и предстоящие —
 * прошедшие в поиск не берём). Только публичные поля — индекс уходит в браузер
 * целиком. Сборку DTO делает mapSearchIndex (mapper).
 */

type SearchCategory = {
  category: { name: string; nameEn: string | null; nameTh: string | null };
};

// у Place нет nameEn/nameTh: название места — имя собственное, оно не переводится
export type SearchPlaceRow = {
  id: string;
  name: string;
  slug: string;
  address: string;
  categories: SearchCategory[];
};

export type SearchActivityRow = {
  id: string;
  name: string;
  nameEn: string | null;
  nameTh: string | null;
  slug: string | null;
  venueName: string | null;
  venueNameEn: string | null;
  venueNameTh: string | null;
  place: { name: string } | null;
  categories: SearchCategory[];
};

export type SearchEventRow = {
  id: string;
  title: string;
  titleEn: string | null;
  titleTh: string | null;
  slug: string;
  locationName: string | null;
  locationNameEn: string | null;
  locationNameTh: string | null;
  place: { name: string } | null;
};

export const getSearchRows = cache(async function getSearchRows(cityId: string): Promise<{
  places: SearchPlaceRow[];
  activities: SearchActivityRow[];
  events: SearchEventRow[];
}> {
  // «сейчас» для отсечения прошедших событий (cache — значение стабильно
  // в пределах одного запроса страницы)
  const now = new Date();
  const [places, activities, events] = await Promise.all([
    prisma.place.findMany({
      where: { status: "APPROVED", cityId, ...demoFilter() },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        categories: {
          select: {
            category: { select: { name: true, nameEn: true, nameTh: true } },
          },
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
        nameTh: true,
        slug: true,
        venueName: true,
        venueNameEn: true,
        venueNameTh: true,
        place: { select: { name: true } },
        categories: {
          select: {
            category: { select: { name: true, nameEn: true, nameTh: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.event.findMany({
      where: {
        status: "APPROVED",
        cityId,
        ...demoFilter(),
        // только НЕ прошедшие. Ключуемся так же, как computeEventStatus:
        // upcoming — по НАЧАЛУ (startDate в будущем), ongoing — по КОНЦУ
        // (endDate ещё не прошёл). Иначе событие с ошибочным endDate<startDate
        // считалось бы past по концу, хотя оно предстоящее по началу —
        // видно в ленте, но пропадало из поиска.
        OR: [{ startDate: { gt: now } }, { endDate: { gte: now } }],
      },
      select: {
        id: true,
        title: true,
        titleEn: true,
        titleTh: true,
        slug: true,
        locationName: true,
        locationNameEn: true,
        locationNameTh: true,
        place: { select: { name: true } },
      },
      orderBy: { startDate: "asc" },
    }),
  ]);

  return { places, activities, events };
});
