import Link from "next/link";
import { getDictionary, langFromPath } from "@/content/dictionary";
import type { Dictionary } from "@/content/dictionary";

type EventFiltersProps = {
  type?: string;
  /// выбранный возраст (?age=) — сохраняется при смене типа события
  age?: string;
  basePath: string;
};

function buildTypeHref(basePath: string, type?: string, age?: string): string {
  const searchParams = new URLSearchParams();
  if (type) {
    searchParams.set("type", type);
  }
  if (age) {
    searchParams.set("age", age);
  }
  const query = searchParams.toString();
  return `${basePath}/events${query ? `?${query}` : ""}`;
}

type EventTypeOption = {
  value: string;
  label: string;
};

function buildEventTypeOptions(dict: Dictionary): EventTypeOption[] {
  return [
    { value: "upcoming", label: dict.eventFilters.labels.upcoming },
    { value: "ongoing", label: dict.eventFilters.labels.ongoing },
    { value: "past", label: dict.eventFilters.labels.past },
  ];
}

export function EventFilters({
  type,
  age,
  basePath,
}: EventFiltersProps): React.ReactElement {
  const dict = getDictionary(langFromPath(basePath));

  return (
    <section className="filters-panel">
      <div className="filters-panel-header">
        <div>
          <h2 className="section-title">{dict.eventFilters.title}</h2>
          <p className="section-subtitle">{dict.eventFilters.subtitle}</p>
        </div>

        <Link className="reset-link" href={buildTypeHref(basePath, undefined, age)}>
          {dict.eventFilters.showAll}
        </Link>
      </div>

      <div className="filters-grid">
        {buildEventTypeOptions(dict).map((option) => {
          const isActive = type === option.value;

          return (
            <Link
              key={option.value}
              href={buildTypeHref(basePath, option.value, age)}
              aria-current={isActive ? "page" : undefined}
              className={`filter-toggle ${isActive ? "filter-toggle-active" : ""}`}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
