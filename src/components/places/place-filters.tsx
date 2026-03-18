import Link from "next/link";

type PlaceFiltersProps = {
  indoor?: string;
  hasFood?: string;
  hasWifi?: string;
  canLeaveChild?: string;
  animalContact?: string;
};

type FilterConfig = {
  name: string;
  label: string;
  checked: boolean;
};

export function PlaceFilters({
  indoor,
  hasFood,
  hasWifi,
  canLeaveChild,
  animalContact,
}: PlaceFiltersProps): React.ReactElement {
  const filters: FilterConfig[] = [
    {
      name: "indoor",
      label: "Indoor",
      checked: indoor === "true",
    },
    {
      name: "hasFood",
      label: "Has food",
      checked: hasFood === "true",
    },
    {
      name: "hasWifi",
      label: "Has Wi-Fi",
      checked: hasWifi === "true",
    },
    {
      name: "canLeaveChild",
      label: "Can leave child",
      checked: canLeaveChild === "true",
    },
    {
      name: "animalContact",
      label: "Animal contact",
      checked: animalContact === "true",
    },
  ];

  return (
    <section className="filters-panel">
      <div className="filters-panel-header">
        <div>
          <h2 className="section-title">Filters</h2>
          <p className="section-subtitle">Applied through URL query params</p>
        </div>
        <Link className="reset-link" href="/">
          Reset
        </Link>
      </div>

      <form className="filters-form" action="/" method="get">
        <div className="filters-grid">
          {filters.map((filter) => (
            <label key={filter.name} className="filter-toggle">
              <input
                type="checkbox"
                name={filter.name}
                value="true"
                defaultChecked={filter.checked}
              />
              <span>{filter.label}</span>
            </label>
          ))}
        </div>

        <div className="filters-actions">
          <button className="primary-button" type="submit">
            Apply filters
          </button>
        </div>
      </form>
    </section>
  );
}
