"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useParentMemory } from "@/lib/memory/use-parent-memory";
import { visitedPlaceSlugs, type VisitedFilterMode } from "@/lib/memory/visited-filter";

type VisitedFilterChipsProps = {
  pathname: string;
  /** текущий режим из ?visited= (null — показывать все) */
  active: VisitedFilterMode | null;
  /** остальные параметры страницы — сохраняем (кроме page: фильтр = 1-я страница) */
  preservedParams?: Record<string, string | undefined>;
};

function buildHref(
  pathname: string,
  mode: VisitedFilterMode | null,
  preserved: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(preserved)) {
    if (value) {
      params.set(key, value);
    }
  }
  if (mode) {
    params.set("visited", mode);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/**
 * «Отметки „были здесь“» — фильтр каталога по ✓-отметкам из памяти родителя.
 * Пока отметок нет, блок не показывается вовсе (нечего фильтровать — незачем
 * шуметь); исключение — активный ?visited= в URL: невидимый включённый фильтр
 * был бы загадкой, поэтому чипы остаются, чтобы его можно было снять.
 * До гидрации памяти не рендеримся (SSR про localStorage не знает).
 */
export function VisitedFilterChips({
  pathname,
  active,
  preservedParams = {},
}: VisitedFilterChipsProps): React.ReactElement | null {
  const router = useRouter();
  const dict = useDictionary();
  const { items, hydrated } = useParentMemory();
  const [isPending, startTransition] = useTransition();
  const [shownActive, setShownActive] = useOptimistic(active);

  const hasMarks = visitedPlaceSlugs(items).size > 0;
  if (!hydrated || (!hasMarks && active === null)) {
    return null;
  }

  function apply(mode: VisitedFilterMode | null): void {
    startTransition(() => {
      setShownActive(mode);
      // scroll: false — родитель остаётся у чипов, страница не прыгает
      router.push(buildHref(pathname, mode, preservedParams), { scroll: false });
    });
  }

  const options: Array<{ mode: VisitedFilterMode | null; label: string }> = [
    { mode: null, label: dict.memory.filterAll },
    { mode: "hidden", label: dict.memory.filterHide },
    { mode: "only", label: dict.memory.filterOnly },
  ];

  return (
    <section
      className={`age-question visited-filter${isPending ? " chips-pending" : ""}`}
      aria-label={dict.memory.filterTitle}
    >
      <span className="age-question-title">{dict.memory.filterTitle}</span>
      <div className="age-chips">
        {options.map((option) => {
          const isActive = shownActive === option.mode;
          return (
            <button
              key={option.label}
              type="button"
              className={`age-chip${isActive ? " age-chip-active" : ""}`}
              aria-pressed={isActive}
              onClick={() => apply(option.mode)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
