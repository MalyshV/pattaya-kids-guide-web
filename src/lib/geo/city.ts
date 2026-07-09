import { cache } from "react";
import { prisma } from "@/db/prisma";
import type { City } from "@prisma/client";

// Чистые константы/хелперы путей живут в base-path.ts (клиенто-безопасно);
// реэкспорт сохраняет существующие серверные импорты из этого модуля.
export { cityBasePath, DEFAULT_CITY_SLUG, DEFAULT_LANG } from "./base-path";

/**
 * Резолвит город по slug. Кешируется в пределах одного запроса (React cache),
 * поэтому страница и её части не бьют в базу повторно.
 * Города мало и меняются редко — сложный middleware не нужен.
 */
export const getCityBySlug = cache(async (slug: string): Promise<City | null> => {
  return prisma.city.findFirst({ where: { slug } });
});

/** Базовый URL сайта для абсолютных ссылок (sitemap/robots). */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/**
 * Порог наполнения. Город публикуется (isPublished=true, попадает в sitemap и
 * индексируется) только когда в нём достаточно реальных мест — иначе «пустой»
 * город штрафуется Google и размывает продукт. Флаг ставится осознанно.
 */
export const PUBLISH_MIN_PLACES = 15;
