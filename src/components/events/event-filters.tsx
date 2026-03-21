import Link from "next/link";

type EventFiltersProps = {
  type?: string;
};

type EventTypeOption = {
  value: string;
  label: string;
  href: string;
};

const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  { value: "upcoming", label: "Upcoming", href: "/events?type=upcoming" },
  { value: "ongoing", label: "Ongoing", href: "/events?type=ongoing" },
  { value: "past", label: "Past", href: "/events?type=past" },
];

export function EventFilters({ type }: EventFiltersProps): React.ReactElement {
  return (
    <section className="filters-panel">
      <div className="filters-panel-header">
        <div>
          <h2 className="section-title">Filters</h2>
          <p className="section-subtitle">Choose when you want to go</p>
        </div>

        <Link className="reset-link" href="/events">
          Show all
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
