import { cache } from "react";
import { prisma } from "@/db/prisma";
import type { City } from "@prisma/client";

/** Язык по умолчанию (пока единственный). */
export const DEFAULT_LANG = "ru";

/** Город по умолчанию. */
export const DEFAULT_CITY_SLUG = "pattaya";

/** Префикс пути города: `/ru/pattaya`. Язык и город — сегменты URL. */
export function cityBasePath(lang: string, citySlug: string): string {
  return `/${lang}/${citySlug}`;
}

/**
 * Резолвит город по slug. Кешируется в пределах одного запроса (React cache),
 * поэтому страница и её части не бьют в базу повторно.
 * Города мало и меняются редко — сложный middleware не нужен.
 */
export const getCityBySlug = cache(async (slug: string): Promise<City | null> => {
  return prisma.city.findFirst({ where: { slug } });
});
