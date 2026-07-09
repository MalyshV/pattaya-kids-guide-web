import Link from "next/link";
import { AGE_BUCKETS } from "@/lib/age/age-buckets";
import { ru } from "@/content/ru";

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
 * «Сколько лет ребёнку?» — сквозной вход по возрасту. Чипы-ссылки: тап
 * добавляет/убирает корзину (мультивыбор — детей может быть двое), выбор живёт
 * в URL и переносится шапкой между разделами.
 */
export function AgeQuestion({
  pathname,
  activeBuckets,
  preservedParams = {},
}: AgeQuestionProps): React.ReactElement {
  const hasSelection = activeBuckets.length > 0;
  const bucketLabels = ru.age.buckets as Record<string, string>;

  return (
    <section className="age-question" aria-label={ru.age.question}>
      <span className="age-question-title">{ru.age.question}</span>
      <div className="age-chips">
        {AGE_BUCKETS.map((bucket) => {
          const isActive = activeBuckets.includes(bucket.key);
          const nextBuckets = isActive
            ? activeBuckets.filter((key) => key !== bucket.key)
            : AGE_BUCKETS.filter(
                (b) => activeBuckets.includes(b.key) || b.key === bucket.key,
              ).map((b) => b.key);

          return (
            <Link
              key={bucket.key}
              href={buildHref(pathname, nextBuckets, preservedParams)}
              className={`age-chip${isActive ? " age-chip-active" : ""}`}
              aria-pressed={isActive}
            >
              {bucketLabels[bucket.key] ?? bucket.key}
            </Link>
          );
        })}
        {hasSelection ? (
          <Link
            href={buildHref(pathname, [], preservedParams)}
            className="age-chip age-chip-reset"
          >
            {ru.age.all}
          </Link>
        ) : null}
      </div>
      {hasSelection ? (
        <p className="age-active-hint">
          {ru.age.showingFor(activeBuckets.map((key) => bucketLabels[key] ?? key))}
        </p>
      ) : null}
    </section>
  );
}
