"use client";

import { usePathname, useRouter } from "next/navigation";
import { ru } from "@/content/ru";

type ScenarioKey = "openNow" | "shelter";

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
    key: "shelter",
    label: ru.scenarios.shelter,
    hint: ru.scenarios.shelterHint,
    activeHint: ru.scenarios.shelterActive,
  },
];

export function ScenarioBar({ active, facets }: ScenarioBarProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();

  // Один клик = результат: сценарий срабатывает сразу, без «Показать».
  // Сохраняем фасеты и другие активные сценарии — инвертируем только нажатый.
  function toggle(key: ScenarioKey): void {
    const params = new URLSearchParams();

    for (const [facetKey, value] of Object.entries(facets)) {
      if (value) {
        params.set(facetKey, value);
      }
    }

    for (const scenario of SCENARIOS) {
      const willBeActive =
        scenario.key === key ? !active[scenario.key] : active[scenario.key];
      if (willBeActive) {
        params.set(scenario.key, "true");
      }
    }

    // Смена сценария всегда возвращает к первой странице.
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const activeHints = SCENARIOS.filter((scenario) => active[scenario.key]);

  return (
    <section className="scenario-bar" aria-label={ru.scenarios.title}>
      <div className="scenario-chips">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.key}
            type="button"
            className={`scenario-chip${active[scenario.key] ? " scenario-chip-active" : ""}`}
            aria-pressed={active[scenario.key]}
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
