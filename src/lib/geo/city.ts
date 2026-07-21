import { cache } from "react";
import { prisma } from "@/db/prisma";
import { cachedQuery } from "@/lib/cache/data-cache";
import type { City } from "@prisma/client";

// Чистые константы/хелперы путей живут в base-path.ts (клиенто-безопасно);
// реэкспорт сохраняет существующие серверные импорты из этого модуля.
export { cityBasePath, DEFAULT_CITY_SLUG, DEFAULT_LANG } from "./base-path";

/**
 * Резолвит город по slug. Два слоя кэша: React cache — дедуп в пределах одного
 * запроса (layout/metadata/страница), cachedQuery — между запросами (города
 * меняются редко; даты города публичный код не трогает, строкам на кэш-хите
 * тут ломаться не в чем).
 */
export const getCityBySlug = cache(
  cachedQuery("city-by-slug", ["cities"], async (slug: string): Promise<City | null> => {
    return prisma.city.findFirst({ where: { slug } });
  }),
);

/**
 * Базовый URL сайта для абсолютных ссылок (canonical/hreflang/OG/sitemap).
 * Приоритет: явная переменная → боевой домен проекта на Vercel → localhost.
 * Средняя ступень критична: без неё, если NEXT_PUBLIC_SITE_URL забыли задать
 * на Vercel, ссылки молча указывали бы на localhost и это всплыло бы только
 * в выдаче Google и битых превью соцсетей.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Порог наполнения. Город публикуется (isPublished=true, попадает в sitemap и
 * индексируется) только когда в нём достаточно реальных мест — иначе «пустой»
 * город штрафуется Google и размывает продукт. Флаг ставится осознанно.
 */
export const PUBLISH_MIN_PLACES = 15;
