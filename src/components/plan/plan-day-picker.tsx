"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { dateLocale } from "@/content/dictionary";
import { cityBasePath } from "@/lib/geo/base-path";
import { useDictionary, useLang } from "@/lib/i18n/use-dictionary";
import type { PlanSnapshot } from "@/lib/plan/plan";
import { useMyPlan } from "@/lib/plan/use-plan";
import { dayParts, daysFrom, pattayaToday } from "@/lib/plan/week";

/// на сколько дней вперёд можно поставить в план из кнопки
const PICKER_DAYS = 7;

type PlanDayPickerProps = {
  snapshot: PlanSnapshot;
  /** показывать ли ссылку «Открыть план» под днями (на самой странице плана — нет) */
  withPlanLink?: boolean;
};

/**
 * Кнопка «В план»: раскрывает семь ближайших дней, нажатие на день ставит
 * запись в план или снимает её (дни — переключатели, aria-pressed).
 * Список дней считается в момент открытия — по «сегодня» в Паттайе.
 *
 * Закрытие — по Esc и по нажатию вне панели (pointerdown на документе), а
 * не по blur: Safari не фокусирует кнопки по клику, и закрытие «по blur»
 * съедало бы выбор дня.
 */
export function PlanDayPicker({
  snapshot,
  withPlanLink = true,
}: PlanDayPickerProps): React.ReactElement {
  const dict = useDictionary();
  const lang = useLang();
  const { entries, hydrated, has, toggle } = useMyPlan();
  const [days, setDays] = useState<string[] | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const open = days !== null;

  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: PointerEvent): void {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setDays(null);
      }
    }
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setDays(null);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // «уже в плане» — на любой день: кнопка честно показывает, что запись стоит
  const inPlan =
    hydrated &&
    entries.some(
      (entry) =>
        entry.entity === snapshot.entity &&
        entry.city === snapshot.city &&
        entry.slug === snapshot.slug,
    );
  const locale = dateLocale(lang);

  return (
    <div className="plan-picker" ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={`plan-btn${inPlan ? " plan-btn-active" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${inPlan ? dict.plan.inPlan : dict.plan.add}: ${snapshot.name}`}
        onClick={() =>
          setDays((current) =>
            current ? null : daysFrom(pattayaToday(new Date()), PICKER_DAYS),
          )
        }
      >
        <span className="plan-btn-mark" aria-hidden="true">
          {inPlan ? "✓" : "+"}
        </span>
        {inPlan ? dict.plan.inPlan : dict.plan.add}
      </button>

      {days ? (
        <div
          id={panelId}
          className="plan-picker-panel"
          role="group"
          aria-label={dict.plan.pickDay}
        >
          <p className="plan-picker-title">{dict.plan.pickDay}</p>
          <div className="plan-picker-days">
            {days.map((day, index) => {
              const { weekday, date } = dayParts(day, locale);
              const pressed = has({ ...snapshot, day });
              return (
                <button
                  key={day}
                  type="button"
                  className={`plan-day-chip${pressed ? " plan-day-chip-active" : ""}`}
                  aria-pressed={pressed}
                  onClick={() => toggle(snapshot, day)}
                >
                  <span className="plan-day-chip-name">
                    {index === 0 ? dict.plan.today : weekday}
                  </span>
                  <span className="plan-day-chip-date">{date}</span>
                </button>
              );
            })}
          </div>
          {withPlanLink ? (
            <Link
              href={`${cityBasePath(lang, snapshot.city)}/plan`}
              className="plan-picker-open"
            >
              {dict.plan.open}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
