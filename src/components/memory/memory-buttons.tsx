"use client";

import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useParentMemory } from "@/lib/memory/use-parent-memory";
import type { MemoryEntity } from "@/lib/memory/parent-memory";

type MemoryButtonsProps = {
  entity: MemoryEntity;
  slug: string;
  name: string;
  imageUrl: string | null;
  /// компактный вид (иконки без подписей) — для угла карточки
  compact?: boolean;
};

/**
 * Две закладки без регистрации: ♡ «Хотим сходить» (план) и ✓ «Уже были»
 * (память). Честные переключатели: имя кнопки постоянное (скринридер слышит
 * «Хотим сходить: Skippy Land, нажата»), состояние — aria-pressed и заливка;
 * подсказка при наведении на нажатую говорит, что сделает повторный тап.
 * Клиентский островок внутри серверных карточек. До гидрации кнопки в
 * неактивном состоянии (localStorage ещё не прочитан) — так SSR и первый
 * клиентский рендер совпадают.
 */
export function MemoryButtons({
  entity,
  slug,
  name,
  imageUrl,
  compact = false,
}: MemoryButtonsProps): React.ReactElement {
  const dict = useDictionary();
  const { has, toggle, hydrated } = useParentMemory();

  const snapshot = { entity, slug, name, imageUrl };
  const saved = hydrated && has(entity, slug, "saved");
  const visited = hydrated && has(entity, slug, "visited");

  return (
    <div className={`memory-buttons${compact ? " memory-buttons-compact" : ""}`}>
      <button
        type="button"
        className={`memory-btn memory-btn-saved${saved ? " memory-btn-active" : ""}`}
        aria-pressed={saved}
        // имя сущности в метке: в сетке карточек icon-only кнопки иначе звучат
        // для скринридера одинаково и неотличимы по месту
        aria-label={`${dict.memory.saveLabel}: ${name}`}
        title={saved ? dict.memory.savedLabel : dict.memory.saveLabel}
        onClick={() => toggle(snapshot, "saved")}
      >
        <span className="memory-btn-icon" aria-hidden="true">
          {saved ? "♥" : "♡"}
        </span>
        {compact ? null : (
          <span className="memory-btn-text">{dict.memory.saveLabel}</span>
        )}
      </button>

      <button
        type="button"
        className={`memory-btn memory-btn-visited${visited ? " memory-btn-active" : ""}`}
        aria-pressed={visited}
        aria-label={`${dict.memory.visitLabel}: ${name}`}
        title={visited ? dict.memory.visitedLabel : dict.memory.visitLabel}
        onClick={() => toggle(snapshot, "visited")}
      >
        {/* глиф один; активность передаётся классом memory-btn-active + aria-pressed */}
        <span className="memory-btn-icon" aria-hidden="true">
          ✓
        </span>
        {compact ? null : (
          <span className="memory-btn-text">{dict.memory.visitLabel}</span>
        )}
      </button>
    </div>
  );
}
