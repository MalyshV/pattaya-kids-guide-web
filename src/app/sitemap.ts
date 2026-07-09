import type { MetadataRoute } from "next";
import { prisma } from "@/db/prisma";
import { demoFilter } from "@/lib/demo/show-demo";
import { DEFAULT_LANG, getSiteUrl } from "@/lib/geo/city";

/**
 * Sitemap только по ОПУБЛИКОВАННЫМ городам (SEO-гейт): пустой/ненаполненный
 * город в карту не попадает и не индексируется.
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
    const cityBase = `${baseUrl}/${DEFAULT_LANG}/${city.slug}`;

    entries.push({ url: cityBase, lastModified: new Date() });
    entries.push({ url: `${cityBase}/events`, lastModified: new Date() });
    entries.push({ url: `${cityBase}/activities`, lastModified: new Date() });
    entries.push({ url: `${cityBase}/birthdays`, lastModified: new Date() });

    for (const place of city.places) {
      entries.push({
        url: `${cityBase}/places/${place.slug}`,
        lastModified: place.updatedAt,
      });
    }

    for (const event of city.events) {
      entries.push({
        url: `${cityBase}/events/${event.slug}`,
        lastModified: event.updatedAt,
      });
    }
  }

  return entries;
}
