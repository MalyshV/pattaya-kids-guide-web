"use client";

import { useOptimistic, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ru } from "@/content/ru";

type ScenarioKey = "openNow" | "openMorning" | "workFriendly" | "shelter";

type ScenarioBarProps = {
  // Какие сценарии сейчас включены.
  active: Record<ScenarioKey, boolean>;
  // Текущие фасеты (indoor, hasFood…) — сохраняем при переключении сценария.
  facets: Record<string, string | undefined>;
};

const SCENARIOS: Array<{
  key: ScenarioKey;
  label: string;
  hint: string;
  activeHint: string;
}> = [
  {
    key: "openNow",
    label: ru.scenarios.openNow,
    hint: ru.scenarios.openNowHint,
    activeHint: ru.scenarios.openNowActive,
  },
  {
    key: "openMorning",
    label: ru.scenarios.openMorning,
    hint: ru.scenarios.openMorningHint,
    activeHint: ru.scenarios.openMorningActive,
  },
  {
    key: "workFriendly",
    label: ru.scenarios.workFriendly,
    hint: ru.scenarios.workFriendlyHint,
    activeHint: ru.scenarios.workFriendlyActive,
  },
  {
    key: "shelter",
    label: ru.scenarios.shelter,
    hint: ru.scenarios.shelterHint,
    activeHint: ru.scenarios.shelterActive,
  },
];

export function ScenarioBar({ active, facets }: ScenarioBarProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  // Оптимистичное состояние: чип переключается В МОМЕНТ тапа, не дожидаясь
  // ответа сервера (~0.3с на проде) — иначе кажется, что «не нажалось».
  const [shownActive, setShownActive] = useOptimistic(active);

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

  const activeHints = SCENARIOS.filter((scenario) => shownActive[scenario.key]);

  return (
    <section
      className={`scenario-bar${isPending ? " chips-pending" : ""}`}
      aria-label={ru.scenarios.title}
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
