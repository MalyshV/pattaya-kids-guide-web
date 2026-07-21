import { unstable_cache } from "next/cache";
import { showDemo } from "@/lib/demo/show-demo";

/**
 * Кросс-запросный кэш чтений БД (сердце «быстрого TTFB»).
 *
 * Публичные страницы остаются динамическими (живой статус «открыто сейчас» —
 * дифференциатор, ISR его заморозил бы), но сами данные меняются только через
 * админку — поэтому кэшируем ЗАПРОСЫ: обычный визит не будит спящую Neon-БД
 * и не ждёт её.
 *
 * Инвалидация двухслойная:
 *  - revalidateTag(тег) из админ-actions — мгновенно после правки контента;
 *  - TTL как страховка от забытого тега (например, правка напрямую в БД).
 *
 * ВАЖНО: unstable_cache сериализует результат в JSON — на кэш-хите Prisma-даты
 * приходят СТРОКАМИ. Поэтому: (1) внутри кэшируемой функции нельзя фильтровать
 * по new Date() — «сейчас» замрёт вместе с кэшем; фильтруй ПОСЛЕ, снаружи;
 * (2) потребители дат обязаны быть терпимы к Date | string (см.
 * compareCatalogOrder, event.mapper, place-details.mapper).
 */

export const CONTENT_TAGS = ["places", "events", "activities", "cities"] as const;
export type ContentTag = (typeof CONTENT_TAGS)[number];

/** Страховочный TTL (сек): контент без правок живёт в кэше не дольше часа. */
const DATA_CACHE_TTL_SEC = 3600;

export function cachedQuery<A extends unknown[], R>(
  name: string,
  tags: readonly ContentTag[],
  fn: (...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  // аргументы функции Next добавляет в ключ кэша сам; name страхует от
  // коллизий двух функций с одинаковыми аргументами. SHOW_DEMO — в ключе
  // явно: demoFilter() читается ВНУТРИ кэшируемых запросов, и без этого
  // выборка с одним значением флага жила бы под тем же ключом при другом
  // (находка ревью: переключение демо «не срабатывало» до часа)
  return unstable_cache(fn, [name, `demo:${showDemo()}`], {
    tags: [...tags],
    revalidate: DATA_CACHE_TTL_SEC,
  });
}
