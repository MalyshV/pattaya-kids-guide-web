"use client";

import { usePathname, useRouter } from "next/navigation";
import { ru } from "@/content/ru";

type ScenarioBarProps = {
  openNow: boolean;
  // Текущие фасеты (indoor, hasFood…) — сохраняем при переключении сценария.
  facets: Record<string, string | undefined>;
};

export function ScenarioBar({ openNow, facets }: ScenarioBarProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();

  // Один клик = результат: сценарий «сейчас» должен срабатывать сразу, без «Показать».
  function toggleOpenNow(): void {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(facets)) {
      if (value) {
        params.set(key, value);
      }
    }

    if (!openNow) {
      params.set("openNow", "true");
    }

    // Смена сценария всегда возвращает к первой странице.
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <section className="scenario-bar" aria-label={ru.scenarios.title}>
      <button
        type="button"
        className={`scenario-chip${openNow ? " scenario-chip-active" : ""}`}
        aria-pressed={openNow}
        onClick={toggleOpenNow}
      >
        {ru.scenarios.openNow}
      </button>
      <p className={openNow ? "scenario-active-hint" : "scenario-hint"}>
        {openNow ? ru.scenarios.openNowActive : ru.scenarios.openNowHint}
      </p>
    </section>
  );
}
