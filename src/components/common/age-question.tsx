"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AGE_BUCKETS } from "@/lib/age/age-buckets";
import { useDictionary } from "@/lib/i18n/use-dictionary";

type AgeQuestionProps = {
  /** Путь страницы, на которой стоит вопрос (фильтр применяется на месте). */
  pathname: string;
  /** Выбранные корзины (из ?age=), в порядке AGE_BUCKETS. */
  activeBuckets: string[];
  /** Остальные параметры страницы (сценарии, фасеты, категория) — сохраняем. */
  preservedParams?: Record<string, string | undefined>;
};

function buildHref(
  pathname: string,
  buckets: string[],
  preserved: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(preserved)) {
    if (value) {
      params.set(key, value);
    }
  }
  if (buckets.length > 0) {
    params.set("age", buckets.join(","));
  }

  // смена возраста возвращает к первой странице (page не переносим)
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/**
 * «Сколько лет ребёнку?» — сквозной вход по возрасту. Тап добавляет/убирает
 * корзину (мультивыбор — детей может быть двое), выбор живёт в URL и
 * переносится шапкой между разделами. Чип переключается оптимистично — в
 * момент тапа, не дожидаясь ответа сервера.
 */
export function AgeQuestion({
  pathname,
  activeBuckets,
  preservedParams = {},
}: AgeQuestionProps): React.ReactElement {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [shownBuckets, setShownBuckets] = useOptimistic(activeBuckets);
  const dict = useDictionary();

  const bucketLabels = dict.age.buckets as Record<string, string>;
  const hasSelection = shownBuckets.length > 0;

  function applyBuckets(nextBuckets: string[]): void {
    startTransition(() => {
      setShownBuckets(nextBuckets);
      router.push(buildHref(pathname, nextBuckets, preservedParams));
    });
  }

  function toggle(key: string): void {
    const next = shownBuckets.includes(key)
      ? shownBuckets.filter((bucket) => bucket !== key)
      : AGE_BUCKETS.filter((b) => shownBuckets.includes(b.key) || b.key === key).map(
          (b) => b.key,
        );
    applyBuckets(next);
  }

  return (
    <section
      className={`age-question${isPending ? " chips-pending" : ""}`}
      aria-label={dict.age.question}
    >
      <span className="age-question-title">{dict.age.question}</span>
      <div className="age-chips">
        {AGE_BUCKETS.map((bucket) => {
          const isActive = shownBuckets.includes(bucket.key);

          return (
            <button
              key={bucket.key}
              type="button"
              className={`age-chip${isActive ? " age-chip-active" : ""}`}
              aria-pressed={isActive}
              onClick={() => toggle(bucket.key)}
            >
              {bucketLabels[bucket.key] ?? bucket.key}
            </button>
          );
        })}
        {hasSelection ? (
          <button
            type="button"
            className="age-chip age-chip-reset"
            onClick={() => applyBuckets([])}
          >
            {dict.age.all}
          </button>
        ) : null}
      </div>
      {hasSelection ? (
        <p className="age-active-hint">
          {dict.age.showingFor(shownBuckets.map((key) => bucketLabels[key] ?? key))}
        </p>
      ) : null}
    </section>
  );
}
