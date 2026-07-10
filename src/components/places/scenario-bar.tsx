"use client";

import { useMemo, useOptimistic, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import type { Dictionary } from "@/content/dictionary";

type ScenarioKey = "openNow" | "openMorning" | "workFriendly" | "shelter" | "near";

type ScenarioBarProps = {
  // Какие сценарии сейчас включены.
  active: Record<ScenarioKey, boolean>;
  // Текущие фасеты (indoor, hasFood…) — сохраняем при переключении сценария.
  facets: Record<string, string | undefined>;
};

function buildScenarios(dict: Dictionary): Array<{
  key: ScenarioKey;
  label: string;
  hint: string;
  activeHint: string;
}> {
  return [
    {
      key: "openNow",
      label: dict.scenarios.openNow,
      hint: dict.scenarios.openNowHint,
      activeHint: dict.scenarios.openNowActive,
    },
    {
      key: "openMorning",
      label: dict.scenarios.openMorning,
      hint: dict.scenarios.openMorningHint,
      activeHint: dict.scenarios.openMorningActive,
    },
    {
      key: "workFriendly",
      label: dict.scenarios.workFriendly,
      hint: dict.scenarios.workFriendlyHint,
      activeHint: dict.scenarios.workFriendlyActive,
    },
    {
      key: "shelter",
      label: dict.scenarios.shelter,
      hint: dict.scenarios.shelterHint,
      activeHint: dict.scenarios.shelterActive,
    },
    {
      // «Рядом со мной» — сортировка, а не фильтр: в URL только флаг near=true,
      // координаты не покидают браузер. activeHint пустой: чип не знает, дал ли
      // браузер позицию — честную подсказку показывает places-results.tsx
      key: "near",
      label: dict.scenarios.nearMe,
      hint: dict.scenarios.nearMeHint,
      activeHint: "",
    },
  ];
}

export function ScenarioBar({ active, facets }: ScenarioBarProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const dict = useDictionary();
  const [isPending, startTransition] = useTransition();
  // Оптимистичное состояние: чип переключается В МОМЕНТ тапа, не дожидаясь
  // ответа сервера (~0.3с на проде) — иначе кажется, что «не нажалось».
  const [shownActive, setShownActive] = useOptimistic(active);

  const SCENARIOS = useMemo(() => buildScenarios(dict), [dict]);

  // Один клик = результат: сценарий срабатывает сразу, без «Показать».
  // Сохраняем фасеты и другие активные сценарии — инвертируем только нажатый.
  function toggle(key: ScenarioKey): void {
    const nextActive = { ...shownActive, [key]: !shownActive[key] };
    const params = new URLSearchParams();

    for (const [facetKey, value] of Object.entries(facets)) {
      if (value) {
        params.set(facetKey, value);
      }
    }

    for (const scenario of SCENARIOS) {
      if (nextActive[scenario.key]) {
        params.set(scenario.key, "true");
      }
    }

    // Смена сценария всегда возвращает к первой странице.
    const query = params.toString();
    startTransition(() => {
      setShownActive(nextActive);
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  const activeHints = SCENARIOS.filter(
    (scenario) => shownActive[scenario.key] && scenario.activeHint,
  );

  return (
    <section
      className={`scenario-bar${isPending ? " chips-pending" : ""}`}
      aria-label={dict.scenarios.title}
    >
      <div className="scenario-chips">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.key}
            type="button"
            className={`scenario-chip${shownActive[scenario.key] ? " scenario-chip-active" : ""}`}
            aria-pressed={shownActive[scenario.key]}
            title={scenario.hint}
            onClick={() => toggle(scenario.key)}
          >
            {scenario.label}
          </button>
        ))}
      </div>
      {activeHints.map((scenario) => (
        <p key={scenario.key} className="scenario-active-hint">
          {scenario.activeHint}
        </p>
      ))}
    </section>
  );
}
