import type { MetadataRoute } from "next";
import { prisma } from "@/db/prisma";
import { demoFilter } from "@/lib/demo/show-demo";
import { getSiteUrl } from "@/lib/geo/city";
import { localizedSitemapEntry } from "@/lib/seo/sitemap-entry";

/**
 * Sitemap только по ОПУБЛИКОВАННЫМ городам (SEO-гейт): пустой/ненаполненный
 * город в карту не попадает и не индексируется.
 *
 * Каждый URL — одна запись на канонической (дефолтной) локали + alternates.
 * languages на все переводы и x-default: так Google связывает языковые версии
 * между собой прямо из карты сайта, без догадок. Разделы, места, события И
 * занятия покрыты во всех локалях.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const cities = await prisma.city.findMany({
    where: { isPublished: true },
    include: {
      places: {
        where: { status: "APPROVED", ...demoFilter() },
        select: { slug: true, updatedAt: true },
      },
      events: {
        where: { status: "APPROVED", ...demoFilter() },
        select: { slug: true, updatedAt: true },
      },
    },
  });

  const entries: MetadataRoute.Sitemap = [];

  for (const city of cities) {
    // занятия со своей страницей (COURSE/CAMP со slug): либо у одобренного места
    // города, либо безместные того же города (как в search/activities-сервисах)
    const activities = await prisma.placeProgram.findMany({
      where: {
        type: { in: ["COURSE", "CAMP"] },
        slug: { not: null },
        ...demoFilter(),
        OR: [
          { place: { status: "APPROVED", cityId: city.id, ...demoFilter() } },
          { placeId: null, cityId: city.id },
        ],
      },
      // у PlaceProgram нет updatedAt — берём только slug, lastModified опустим
      select: { slug: true },
    });

    // lastModified разделов — самая свежая правка контента города, а не
    // «сейчас»: фейковой дате Google перестаёт доверять
    const contentDates = [
      ...city.places.map((p) => p.updatedAt),
      ...city.events.map((e) => e.updatedAt),
    ];
    const cityLastMod =
      contentDates.length > 0
        ? new Date(Math.max(...contentDates.map((d) => d.getTime())))
        : undefined;

    const entry = (subPath: string, lastModified?: Date) =>
      localizedSitemapEntry(baseUrl, city.slug, subPath, lastModified);

    // разделы (корень города — посадочная; каталог мест — /places)
    entries.push(entry("", cityLastMod));
    entries.push(entry("/places", cityLastMod));
    entries.push(entry("/events", cityLastMod));
    entries.push(entry("/activities", cityLastMod));
    entries.push(entry("/birthdays", cityLastMod));

    // детальные страницы
    for (const place of city.places) {
      entries.push(entry(`/places/${place.slug}`, place.updatedAt));
    }
    for (const event of city.events) {
      entries.push(entry(`/events/${event.slug}`, event.updatedAt));
    }
    for (const activity of activities) {
      // без даты правки (модель занятия её не хранит)
      if (activity.slug) {
        entries.push(entry(`/activities/${activity.slug}`));
      }
    }
  }

  return entries;
}
