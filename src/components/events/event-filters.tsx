import Link from "next/link";
import { ru } from "@/content/ru";

type EventFiltersProps = {
  type?: string;
};

type EventTypeOption = {
  value: string;
  label: string;
  href: string;
};

const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  {
    value: "upcoming",
    label: ru.eventFilters.labels.upcoming,
    href: "/events?type=upcoming",
  },
  {
    value: "ongoing",
    label: ru.eventFilters.labels.ongoing,
    href: "/events?type=ongoing",
  },
  { value: "past", label: ru.eventFilters.labels.past, href: "/events?type=past" },
];

export function EventFilters({ type }: EventFiltersProps): React.ReactElement {
  return (
    <section className="filters-panel">
      <div className="filters-panel-header">
        <div>
          <h2 className="section-title">{ru.eventFilters.title}</h2>
          <p className="section-subtitle">{ru.eventFilters.subtitle}</p>
        </div>

        <Link className="reset-link" href="/events">
          {ru.eventFilters.showAll}
        </Link>
      </div>

      <div className="filters-grid">
        {EVENT_TYPE_OPTIONS.map((option) => {
          const isActive = type === option.value;

          return (
            <Link
              key={option.value}
              href={option.href}
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
