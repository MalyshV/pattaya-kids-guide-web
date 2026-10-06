"use client";

import { useCitySlug } from "@/lib/geo/use-city-slug";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useParentMemory } from "@/lib/memory/use-parent-memory";
import type { MemoryEntity } from "@/lib/memory/parent-memory";

/**
 * Тихие пометки «♥ нравится» / «✓ уже были» у строки списка (блок «Другие
 * {сеть} в {городе}»): та же память родителя в браузере, что и у кнопок на
 * карточке, только без переключения — отметку ставят на самой карточке.
 * До гидрации (localStorage ещё не прочитан) ничего не рисуем, чтобы SSR и
 * первый клиентский рендер совпали. Нет отметок — пусто, без лишних узлов.
 */
export function MemoryRowMarks({
  entity,
  slug,
}: {
  entity: MemoryEntity;
  slug: string;
}): React.ReactElement | null {
  const dict = useDictionary();
  const { has, hydrated } = useParentMemory();
  const city = useCitySlug();

  const saved = hydrated && has(entity, slug, "saved", city);
  const visited = hydrated && has(entity, slug, "visited", city);

  if (!saved && !visited) {
    return null;
  }

  return (
    <span className="memory-row-marks">
      {visited ? (
        <span className="memory-row-mark memory-row-mark-visited">
          <span aria-hidden="true">✓ </span>
          {dict.memory.rowVisited}
        </span>
      ) : null}
      {saved ? (
        <span className="memory-row-mark memory-row-mark-saved">
          <span aria-hidden="true">♥ </span>
          {dict.memory.rowSaved}
        </span>
      ) : null}
    </span>
  );
}
