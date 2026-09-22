import "server-only";

import { prisma } from "@/db/prisma";
import { cachedQuery } from "@/lib/cache/data-cache";
import { demoFilter } from "@/lib/demo/show-demo";
import { pickLocalized } from "@/lib/i18n/localize";
import { computeEventStatus } from "@/lib/events/event-lifecycle";
import type { DupCandidate } from "@/lib/search/duplicates";

/**
 * Кандидаты для подсказки «похоже, это уже есть» в форме «Предложить своё».
 *
 * Шире поискового индекса: берём и места-черновики (PENDING — уже готовим),
 * и прошедшие события (ежегодное событие прошлого года — тоже подсказка), и
 * координаты (дубль по близости). Ждущие проверки предложения читаются живыми
 * (без кэша — иначе «уже предложили» отставало бы до часа), и наружу от них
 * уходит только факт «уже предложили»: чужой текст и контакты — нет.
 */

type CatalogRows = {
  places: {
    id: string;
    name: string;
    slug: string;
    status: string;
    latitude: number;
    longitude: number;
  }[];
  events: {
    id: string;
    slug: string;
    title: string;
    titleEn: string | null;
    titleTh: string | null;
    latitude: number | null;
    longitude: number | null;
    place: { latitude: number; longitude: number } | null;
    // на кэш-хите — строки; «прошло» считаем поверх кэша свежим now
    startDate: Date | string;
    endDate: Date | string | null;
  }[];
  activities: {
    id: string;
    slug: string | null;
    name: string;
    nameEn: string | null;
    nameTh: string | null;
    venueName: string | null;
    venueNameEn: string | null;
    venueNameTh: string | null;
    venueLatitude: number | null;
    venueLongitude: number | null;
    place: { latitude: number; longitude: number } | null;
  }[];
};

const getCatalogRows = cachedQuery(
  "suggest-dup-catalog",
  ["places", "events", "activities"],
  async function getCatalogRows(cityId: string): Promise<CatalogRows> {
    const [places, events, activities] = await Promise.all([
      prisma.place.findMany({
        // отклонённые не подсказываем — их на сайте нет и не будет
        where: { cityId, status: { in: ["APPROVED", "PENDING"] }, ...demoFilter() },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          latitude: true,
          longitude: true,
        },
      }),
      prisma.event.findMany({
        where: { cityId, status: { in: ["APPROVED", "AUTO_APPROVED"] }, ...demoFilter() },
        select: {
          id: true,
          slug: true,
          title: true,
          titleEn: true,
          titleTh: true,
          latitude: true,
          longitude: true,
          place: { select: { latitude: true, longitude: true } },
          startDate: true,
          endDate: true,
        },
      }),
      prisma.placeProgram.findMany({
        where: {
          type: { in: ["COURSE", "CAMP"] },
          slug: { not: null },
          ...demoFilter(),
          OR: [
            { place: { status: "APPROVED", cityId, ...demoFilter() } },
            { placeId: null, cityId },
          ],
        },
        select: {
          id: true,
          slug: true,
          name: true,
          nameEn: true,
          nameTh: true,
          venueName: true,
          venueNameEn: true,
          venueNameTh: true,
          venueLatitude: true,
          venueLongitude: true,
          place: { select: { latitude: true, longitude: true } },
        },
      }),
    ]);
    return { places, events, activities };
  },
);

function names(...values: (string | null | undefined)[]): string[] {
  return values.filter((value): value is string => Boolean(value && value.trim()));
}

function toPoint(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
): { latitude: number; longitude: number } | null {
  return latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
    ? { latitude, longitude }
    : null;
}

/** предложения старше этого для подсказки не учитываем — давно разобраны */
const PENDING_WINDOW_DAYS = 120;

export async function getDupCandidates(
  cityId: string,
  basePath: string,
  lang: string,
): Promise<DupCandidate[]> {
  const since = new Date(Date.now() - PENDING_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const [catalog, pending] = await Promise.all([
    getCatalogRows(cityId),
    // таблицы ещё нет (db push не сделан) или база споткнулась — подсказка
    // по каталогу всё равно работает, «уже предложили» просто молчит.
    // async-обёртка ловит и синхронную ошибку (старый клиент без модели)
    (async () =>
      prisma.submission.findMany({
        where: {
          cityId,
          status: { in: ["PENDING", "IN_REVIEW"] },
          createdAt: { gte: since },
        },
        select: { id: true, name: true },
        orderBy: { createdAt: "desc" },
        take: 500,
      }))().catch(() => []),
  ]);

  const candidates: DupCandidate[] = [];

  for (const place of catalog.places) {
    candidates.push({
      key: `place:${place.id}`,
      kind: "place",
      names: [place.name],
      label: place.name,
      // черновик ещё не на сайте — ссылки нет, покажем «уже готовим»
      href: place.status === "APPROVED" ? `${basePath}/places/${place.slug}` : null,
      point: toPoint(place.latitude, place.longitude),
    });
  }

  const now = new Date();
  for (const event of catalog.events) {
    const past =
      computeEventStatus(
        new Date(event.startDate),
        event.endDate ? new Date(event.endDate) : null,
        now,
      ) === "past";
    candidates.push({
      past,
      key: `event:${event.id}`,
      kind: "event",
      names: names(event.title, event.titleEn, event.titleTh),
      label: pickLocalized(event.title, event.titleEn, event.titleTh, lang),
      href: `${basePath}/events/${event.slug}`,
      point:
        toPoint(event.latitude, event.longitude) ??
        toPoint(event.place?.latitude, event.place?.longitude),
    });
  }

  for (const activity of catalog.activities) {
    if (!activity.slug) {
      continue;
    }
    candidates.push({
      key: `activity:${activity.id}`,
      kind: "activity",
      names: names(
        activity.name,
        activity.nameEn,
        activity.nameTh,
        activity.venueName,
        activity.venueNameEn,
        activity.venueNameTh,
      ),
      label: pickLocalized(activity.name, activity.nameEn, activity.nameTh, lang),
      href: `${basePath}/activities/${activity.slug}`,
      point:
        toPoint(activity.place?.latitude, activity.place?.longitude) ??
        toPoint(activity.venueLatitude, activity.venueLongitude),
    });
  }

  for (const submission of pending) {
    candidates.push({
      key: `submission:${submission.id}`,
      kind: "submission",
      names: [submission.name],
      // чужое предложение наружу не показываем — только факт «уже предлагали».
      // И только по НАЗВАНИЮ, без точки: иначе перебором координат по карте
      // можно было бы вычислить, где находятся неразобранные предложения
      label: "",
      href: null,
      point: null,
    });
  }

  return candidates;
}
