"use client";

import { useState } from "react";
import Link from "next/link";
import { BrushCloseIcon } from "@/components/common/brush-close-icon";
import { PlanDayPicker } from "@/components/plan/plan-day-picker";
import { dateLocale } from "@/content/dictionary";
import { cityBasePath } from "@/lib/geo/base-path";
import { useCitySlug } from "@/lib/geo/use-city-slug";
import { useDictionary, useLang } from "@/lib/i18n/use-dictionary";
import { listByKind } from "@/lib/memory/parent-memory";
import { useParentMemory } from "@/lib/memory/use-parent-memory";
import { countInDays, entriesOfDay, type PlanEntity } from "@/lib/plan/plan";
import { useMyPlan } from "@/lib/plan/use-plan";
import {
  dayParts,
  pattayaToday,
  shiftDay,
  weekDays,
  weekRangeLabel,
} from "@/lib/plan/week";

const ENTITY_PATH: Record<PlanEntity, string> = {
  place: "places",
  activity: "activities",
  event: "events",
};

/// сколько понравившегося предлагать под неделей — подсказка, а не второй список
const LIKED_SUGGESTIONS = 6;

/**
 * Страница «Мой план»: неделя по дням (с понедельника), у каждого дня — что
 * запланировано или «свободно». План читается из localStorage, поэтому до
 * гидрации неделя пустая (так сервер и первый клиентский рендер совпадают).
 * Ниже — понравившееся, которое можно поставить на день.
 */
export function PlanWeek(): React.ReactElement {
  const dict = useDictionary();
  const lang = useLang();
  const city = useCitySlug();
  const { entries, hydrated, remove } = useMyPlan();
  const { items } = useParentMemory();
  // «сегодня» — день Паттайи на момент открытия страницы
  const [today] = useState(() => pattayaToday(new Date()));
  const [anchor, setAnchor] = useState(today);

  const locale = dateLocale(lang);
  const days = weekDays(anchor);
  const isThisWeek = days.includes(today);
  const planned = hydrated ? entries : [];
  const weekCount = countInDays(planned, days);
  const basePath = cityBasePath(lang, city);
  const typeLabel: Record<PlanEntity, string> = {
    place: dict.search.typePlace,
    activity: dict.search.typeActivity,
    event: dict.search.typeEvent,
  };

  const liked = hydrated ? listByKind(items, "saved").slice(0, LIKED_SUGGESTIONS) : [];

  return (
    <div className="plan-page">
      <div className="back-link-wrapper">
        <Link href={`${basePath}/places`} className="back-link">
          {dict.plan.back}
        </Link>
      </div>

      <p className="eyebrow">{dict.plan.title}</p>
      <div className="plan-head">
        <div>
          <h1 className="plan-title">{dict.plan.weekTitle}</h1>
          <p className="plan-range" aria-live="polite">
            {weekRangeLabel(days, locale)} · {dict.plan.weekCount(weekCount)}
          </p>
        </div>
        <div className="plan-nav">
          {isThisWeek ? null : (
            <button
              type="button"
              className="plan-nav-today"
              onClick={() => setAnchor(today)}
            >
              {dict.plan.thisWeek}
            </button>
          )}
          <button
            type="button"
            className="plan-nav-arrow"
            aria-label={dict.plan.prevWeek}
            onClick={() => setAnchor(shiftDay(days[0], -7))}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            className="plan-nav-arrow"
            aria-label={dict.plan.nextWeek}
            onClick={() => setAnchor(shiftDay(days[0], 7))}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      <ol className="plan-week">
        {days.map((day) => {
          const { weekday, date } = dayParts(day, locale);
          const dayEntries = entriesOfDay(planned, day);
          const isToday = day === today;
          const state = isToday ? " plan-day-today" : day < today ? " plan-day-past" : "";
          return (
            <li key={day} className={`plan-day${state}`}>
              <div className="plan-day-date" aria-current={isToday ? "date" : undefined}>
                <span className="plan-day-num">{date}</span>
                <span className="plan-day-name">
                  {isToday ? dict.plan.today : weekday}
                </span>
              </div>
              {dayEntries.length === 0 ? (
                <p className="plan-day-free">{dict.plan.free}</p>
              ) : (
                <ul className="plan-entries">
                  {dayEntries.map((entry) => (
                    <li
                      key={`${entry.city}:${entry.entity}:${entry.slug}`}
                      className="plan-entry"
                    >
                      <Link
                        href={`${cityBasePath(lang, entry.city)}/${ENTITY_PATH[entry.entity]}/${entry.slug}`}
                        className="plan-entry-link"
                      >
                        <span className="plan-entry-type">{typeLabel[entry.entity]}</span>
                        <span className="plan-entry-name">{entry.name}</span>
                        {entry.hint ? (
                          <span className="plan-entry-hint">{entry.hint}</span>
                        ) : null}
                      </Link>
                      <button
                        type="button"
                        className="plan-entry-remove"
                        aria-label={`${dict.plan.remove}: ${entry.name}`}
                        title={dict.plan.remove}
                        onClick={() => remove(entry)}
                      >
                        <BrushCloseIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      {hydrated && entries.length === 0 ? (
        <div className="plan-empty" role="status">
          <p className="plan-empty-title">{dict.plan.emptyTitle}</p>
          <p className="plan-empty-hint">{dict.plan.emptyHint}</p>
          <Link href={`${basePath}/places`} className="saved-empty-cta">
            {dict.plan.emptyCta}
          </Link>
        </div>
      ) : null}

      {liked.length > 0 ? (
        <section className="plan-liked" aria-labelledby="plan-liked-title">
          <h2 id="plan-liked-title" className="plan-section-title">
            {dict.plan.likedTitle}
          </h2>
          <ul className="plan-liked-list">
            {liked.map((item) => (
              <li
                key={`${item.city}:${item.entity}:${item.slug}`}
                className="plan-liked-item"
              >
                <Link
                  href={`${cityBasePath(lang, item.city)}/${ENTITY_PATH[item.entity]}/${item.slug}`}
                  className="plan-liked-link"
                >
                  <span className="plan-entry-type">{typeLabel[item.entity]}</span>
                  <span className="plan-liked-name">{item.name}</span>
                </Link>
                <PlanDayPicker
                  withPlanLink={false}
                  snapshot={{
                    entity: item.entity,
                    city: item.city,
                    slug: item.slug,
                    name: item.name,
                    hint: null,
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="plan-storage-note">{dict.plan.storageNote}</p>
    </div>
  );
}
