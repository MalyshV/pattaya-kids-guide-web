/**
 * Чистые константы и хелперы путей — БЕЗ prisma. Отдельно от city.ts, чтобы
 * клиентские компоненты могли строить ссылки, не утаскивая pg/dns в браузерный
 * бандл (city.ts импортирует БД).
 */

/** Язык по умолчанию. */
export const DEFAULT_LANG = "ru";

/** Город по умолчанию. */
export const DEFAULT_CITY_SLUG = "pattaya";

/** Префикс пути города: `/ru/pattaya`. Язык и город — сегменты URL. */
export function cityBasePath(lang: string, citySlug: string): string {
  return `/${lang}/${citySlug}`;
}
