import type { MemoryItem } from "@/lib/memory/parent-memory";

/**
 * Фильтр каталога по отметкам ✓ «были здесь». Отметки живут в localStorage
 * (сервер о них не знает), поэтому режим едет в URL (?visited=hidden|only),
 * а сама фильтрация — только на клиенте после гидрации памяти.
 */

export type VisitedFilterMode = "hidden" | "only";

/** ?visited= из URL → режим; всё незнакомое честно считаем «показывать все». */
export function parseVisitedParam(value: string | undefined): VisitedFilterMode | null {
  return value === "hidden" || value === "only" ? value : null;
}

/** Слаги мест с отметкой ✓ (занятия/события каталог мест не фильтруют). */
export function visitedPlaceSlugs(items: readonly MemoryItem[]): Set<string> {
  return new Set(
    items
      .filter((item) => item.kind === "visited" && item.entity === "place")
      .map((item) => item.slug),
  );
}

export function filterByVisited<T>(
  items: readonly T[],
  mode: VisitedFilterMode,
  slugOf: (item: T) => string,
  visitedSlugs: ReadonlySet<string>,
): T[] {
  return items.filter((item) =>
    mode === "hidden" ? !visitedSlugs.has(slugOf(item)) : visitedSlugs.has(slugOf(item)),
  );
}
