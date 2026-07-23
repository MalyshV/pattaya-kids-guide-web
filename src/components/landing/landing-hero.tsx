"use client";

import Link from "next/link";
import { useState } from "react";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import {
  visibleScenarios,
  yearsToAgeBucket,
  type LandingSlot,
  type ScenarioKey,
} from "@/lib/landing/scenarios";

/**
 * Первый экран посадочной: вопрос «Что ищете прямо сейчас?» и три живых
 * ответа. Сервер отдаёт пул сценариев слота (уже после порога честности),
 * клиент показывает тройку и листает её кнопкой «показать другие» — без
 * перезагрузки. Клик по ответу — сразу готовый отфильтрованный список.
 */

export type LandingScenarioDto = {
  key: ScenarioKey;
  emoji: string[];
  /** готовая ссылка; для age — база, к которой клиент цепляет ?age= */
  href: string;
  needsAge?: boolean;
};

type LandingHeroProps = {
  slot: LandingSlot;
  scenarios: LandingScenarioDto[];
  listPath: string;
};

// ?age= на посадочной не живёт (старые ссылки с ним редиректятся в каталог),
// поэтому крутилка стартует с самого частого возраста аудитории
const DEFAULT_AGE_YEARS = 3;
const AGE_YEAR_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function LandingHero({
  slot,
  scenarios,
  listPath,
}: LandingHeroProps): React.ReactElement {
  const dict = useDictionary();
  const [offset, setOffset] = useState(0);
  const [ageYears, setAgeYears] = useState(DEFAULT_AGE_YEARS);

  const pool = scenarios.map((scenario) => scenario.key);
  const visibleKeys = visibleScenarios(pool, offset);
  const visible = visibleKeys
    .map((key) => scenarios.find((scenario) => scenario.key === key))
    .filter((scenario): scenario is LandingScenarioDto => scenario !== undefined);

  const labels: Record<ScenarioKey, { label: string; hint: string }> = {
    age: {
      label: dict.landing.scenarios.ageBefore,
      hint: dict.landing.scenarios.ageHint,
    },
    workFriendly: {
      label: dict.landing.scenarios.workFriendly,
      hint: dict.landing.scenarios.workFriendlyHint,
    },
    openMorning: {
      label: dict.landing.scenarios.openMorning,
      hint: dict.landing.scenarios.openMorningHint,
    },
    openNow: {
      label: dict.landing.scenarios.openNow,
      hint: dict.landing.scenarios.openNowHint,
    },
    shelter: {
      label: dict.landing.scenarios.shelter,
      hint: dict.landing.scenarios.shelterHint,
    },
    events: {
      label: dict.landing.scenarios.events,
      hint: dict.landing.scenarios.eventsHint,
    },
    birthdays: {
      label: dict.landing.scenarios.birthdays,
      hint: dict.landing.scenarios.birthdaysHint,
    },
    near: {
      label: dict.landing.scenarios.near,
      hint: dict.landing.scenarios.nearHint,
    },
  };

  return (
    <section className="landing-hero">
      <h1 className="landing-question">{dict.landing.question}</h1>
      <p className="landing-slot-note">{dict.landing.slotNotes[slot]}</p>

      <div className="landing-answers">
        {visible.map((scenario) => {
          const { label, hint } = labels[scenario.key];

          if (scenario.needsAge) {
            const ageHref = `${scenario.href}?age=${yearsToAgeBucket(ageYears)}`;
            return (
              // паттерн place-card: карточка кликабельна растянутой ссылкой
              // (::after), крутилка возраста лежит поверх неё (z-index)
              <article key={scenario.key} className="landing-card">
                <p className="landing-card-emoji" aria-hidden="true">
                  {scenario.emoji.join(" ")}
                </p>
                <h2 className="landing-card-title">
                  <Link href={ageHref} className="landing-card-link">
                    {label}
                  </Link>{" "}
                  <select
                    className="landing-age-select"
                    aria-label={dict.landing.scenarios.ageAria}
                    value={ageYears}
                    onChange={(event) => setAgeYears(Number(event.target.value))}
                  >
                    {AGE_YEAR_OPTIONS.map((years) => (
                      <option key={years} value={years}>
                        {dict.landing.ageOption(years)}
                      </option>
                    ))}
                  </select>
                </h2>
                <p className="landing-card-hint">{hint}</p>
              </article>
            );
          }

          return (
            <article key={scenario.key} className="landing-card">
              <p className="landing-card-emoji" aria-hidden="true">
                {scenario.emoji.join(" ")}
              </p>
              <h2 className="landing-card-title">
                <Link href={scenario.href} className="landing-card-link">
                  {label}
                </Link>
              </h2>
              <p className="landing-card-hint">{hint}</p>
            </article>
          );
        })}
      </div>

      {pool.length > visible.length ? (
        <button
          type="button"
          className="landing-refresh"
          aria-label={dict.landing.refreshAria}
          onClick={() => setOffset((value) => value + 1)}
        >
          <span className="landing-refresh-icon" aria-hidden="true">
            ↻
          </span>{" "}
          {dict.landing.refresh}
        </button>
      ) : null}

      <p className="landing-exits">
        <Link href={listPath} className="landing-exit-link">
          {dict.landing.allCatalog}
        </Link>
        <span className="landing-exit-divider" aria-hidden="true">
          ·
        </span>
        <Link href={`${listPath}?view=map`} className="landing-exit-link">
          {dict.landing.onMap}
        </Link>
      </p>
    </section>
  );
}
