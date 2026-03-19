"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type PlaceFiltersProps = {
  indoor?: string;
  hasFood?: string;
  hasWifi?: string;
  canLeaveChild?: string;
  animalContact?: string;
};

type FilterKey = "indoor" | "hasFood" | "hasWifi" | "canLeaveChild" | "animalContact";

type FiltersState = Record<FilterKey, boolean>;

type FilterConfig = {
  name: FilterKey;
  label: string;
};

const FILTERS: FilterConfig[] = [
  { name: "indoor", label: "Indoor" },
  { name: "hasFood", label: "Has food" },
  { name: "hasWifi", label: "Has Wi-Fi" },
  { name: "canLeaveChild", label: "Can leave child" },
  { name: "animalContact", label: "Animal contact" },
];

function buildInitialState(props: PlaceFiltersProps): FiltersState {
  return {
    indoor: props.indoor === "true",
    hasFood: props.hasFood === "true",
    hasWifi: props.hasWifi === "true",
    canLeaveChild: props.canLeaveChild === "true",
    animalContact: props.animalContact === "true",
  };
}

export function PlaceFilters(props: PlaceFiltersProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();

  const initialState = useMemo(() => buildInitialState(props), [props]);
  const [filters, setFilters] = useState<FiltersState>(initialState);

  function handleToggle(name: FilterKey): void {
    setFilters((current) => ({
      ...current,
      [name]: !current[name],
    }));
  }

  function handleApply(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const searchParams = new URLSearchParams();

    (Object.entries(filters) as Array<[FilterKey, boolean]>).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, "true");
      }
    });

    const queryString = searchParams.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function handleReset(): void {
    const emptyState: FiltersState = {
      indoor: false,
      hasFood: false,
      hasWifi: false,
      canLeaveChild: false,
      animalContact: false,
    };

    setFilters(emptyState);
    router.push(pathname);
  }

  return (
    <section className="filters-panel">
      <div className="filters-panel-header">
        <div>
          <h2 className="section-title">Filters</h2>
          <p className="section-subtitle">Applied through URL query params</p>
        </div>

        <button className="reset-link reset-button" type="button" onClick={handleReset}>
          Reset
        </button>
      </div>

      <form className="filters-form" onSubmit={handleApply}>
        <div className="filters-grid">
          {FILTERS.map((filter) => (
            <label key={filter.name} className="filter-toggle">
              <input
                type="checkbox"
                checked={filters[filter.name]}
                onChange={() => handleToggle(filter.name)}
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
