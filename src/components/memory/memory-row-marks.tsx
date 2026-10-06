"use client";

import { useCitySlug } from "@/lib/geo/use-city-slug";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useParentMemory } from "@/lib/memory/use-parent-memory";
import type { MemoryEntity } from "@/lib/memory/parent-memory";

/**
 * Тихие пометки ♥ / ✓ у строки списка (блок «Другие {сеть} в {городе}»): та
 * же память родителя в браузере, что и у кнопок на карточке, только без
 * переключения — отметку ставят на самой карточке. Только значки (решение
 * 06.10); слово — скринридеру и в подсказке при наведении.
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
        <span
          className="memory-row-mark memory-row-mark-visited"
          title={dict.memory.rowVisited}
        >
          <span aria-hidden="true">✓</span>
          <span className="sr-only">{dict.memory.rowVisited}</span>
        </span>
      ) : null}
      {saved ? (
        <span
          className="memory-row-mark memory-row-mark-saved"
          title={dict.memory.rowSaved}
        >
          <span aria-hidden="true">♥</span>
          <span className="sr-only">{dict.memory.rowSaved}</span>
        </span>
      ) : null}
    </span>
  );
}
