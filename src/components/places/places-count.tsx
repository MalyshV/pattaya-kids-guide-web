"use client";

import { useMemo } from "react";
import { useCitySlug } from "@/lib/geo/use-city-slug";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useParentMemory } from "@/lib/memory/use-parent-memory";
import {
  filterByVisited,
  visitedPlaceSlugs,
  type VisitedFilterMode,
} from "@/lib/memory/visited-filter";

type PlacesCountProps = {
  /** слаги всех найденных сервером мест (после фильтров и возраста) */
  slugs: string[];
  visitedFilter: VisitedFilterMode | null;
};

/**
 * «N мест» над списком. Сервер не знает отметок ✓ (они в браузере), поэтому
 * при фильтре «где уже были» число считаем здесь — оно всегда совпадает с
 * тем, что видно в списке. До чтения памяти число не показываем (место под
 * строкой сохранено): иначе мигнуло бы серверное «40 мест», а потом «3».
 */
export function PlacesCount({
  slugs,
  visitedFilter,
}: PlacesCountProps): React.ReactElement {
  const dict = useDictionary();
  const memory = useParentMemory();
  const city = useCitySlug();
  const visitedSlugs = useMemo(
    () => visitedPlaceSlugs(memory.items, city),
    [memory.items, city],
  );

  if (visitedFilter === null) {
    // role=status: после фильтрации скринридер озвучит «Найдено N»
    return <p role="status">{dict.places.count(slugs.length)}</p>;
  }
  if (!memory.hydrated) {
    return (
      <p role="status" style={{ visibility: "hidden" }}>
        {dict.places.count(slugs.length)}
      </p>
    );
  }
  const shown = filterByVisited(
    slugs,
    visitedFilter,
    (slug) => slug,
    visitedSlugs,
  ).length;
  return <p role="status">{dict.places.count(shown)}</p>;
}
