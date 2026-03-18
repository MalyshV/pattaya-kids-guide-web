import Link from "next/link";

type EventFiltersProps = {
  type?: string;
};

type EventTypeOption = {
  value: string;
  label: string;
};

const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "past", label: "Past" },
];

export function EventFilters({ type }: EventFiltersProps): React.ReactElement {
  return (
    <section className="filters-panel">
      <div className="filters-panel-header">
        <div>
          <h2 className="section-title">Filters</h2>
          <p className="section-subtitle">Browse events by lifecycle status</p>
        </div>

        <Link className="reset-link" href="/events">
          All
        </Link>
      </div>

      <div className="filters-grid">
        {EVENT_TYPE_OPTIONS.map((option) => {
          const isActive = type === option.value;

          return (
            <Link
              key={option.value}
              href={`/events?type=${option.value}`}
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
