"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ru } from "@/content/ru";

type PlaceFiltersProps = {
  // Сценарии («Пойти сейчас», «Можно поработать», «Спрятаться от жары») живут
  // отдельными чипами — здесь их только сохраняем, чтобы «Показать»/«Сбросить»
  // их не сбрасывали.
  openNow?: string;
  openMorning?: string;
  workFriendly?: string;
  shelter?: string;
  indoor?: string;
  outdoor?: string;
  hasFood?: string;
  hasWifi?: string;
  hasAirCon?: string;
  hasParking?: string;
  canLeaveChild?: string;
  animalContact?: string;
};

type FilterKey =
  | "indoor"
  | "outdoor"
  | "hasFood"
  | "hasWifi"
  | "hasAirCon"
  | "hasParking"
  | "canLeaveChild"
  | "animalContact";

type FiltersState = Record<FilterKey, boolean>;

type FilterConfig = {
  name: FilterKey;
  label: string;
};

const FILTERS: FilterConfig[] = [
  { name: "indoor", label: ru.placeFilters.labels.indoor },
  { name: "outdoor", label: ru.placeFilters.labels.outdoor },
  { name: "hasFood", label: ru.placeFilters.labels.hasFood },
  { name: "hasWifi", label: ru.placeFilters.labels.hasWifi },
  { name: "hasAirCon", label: ru.placeFilters.labels.hasAirCon },
  { name: "hasParking", label: ru.placeFilters.labels.hasParking },
  { name: "canLeaveChild", label: ru.placeFilters.labels.canLeaveChild },
  { name: "animalContact", label: ru.placeFilters.labels.animalContact },
];

function buildInitialState(props: PlaceFiltersProps): FiltersState {
  return {
    indoor: props.indoor === "true",
    outdoor: props.outdoor === "true",
    hasFood: props.hasFood === "true",
    hasWifi: props.hasWifi === "true",
    hasAirCon: props.hasAirCon === "true",
    hasParking: props.hasParking === "true",
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

  // Активные сценарии-чипы, которые нужно пронести через «Показать»/«Сбросить».
  function scenarioParams(): URLSearchParams {
    const params = new URLSearchParams();
    if (props.openNow === "true") {
      params.set("openNow", "true");
    }
    if (props.openMorning === "true") {
      params.set("openMorning", "true");
    }
    if (props.workFriendly === "true") {
      params.set("workFriendly", "true");
    }
    if (props.shelter === "true") {
      params.set("shelter", "true");
    }
    return params;
  }

  function handleApply(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const searchParams = scenarioParams();

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
      outdoor: false,
      hasFood: false,
      hasWifi: false,
      hasAirCon: false,
      hasParking: false,
      canLeaveChild: false,
      animalContact: false,
    };

    setFilters(emptyState);
    // Сброс фасетов не трогает сценарий-чипы — у них свой переключатель.
    const queryString = scenarioParams().toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <section className="filters-panel">
      <div className="filters-panel-header">
        <div>
          <h2 className="section-title">{ru.placeFilters.title}</h2>
          <p className="section-subtitle">{ru.placeFilters.subtitle}</p>
        </div>

        <button className="reset-link reset-button" type="button" onClick={handleReset}>
          {ru.placeFilters.reset}
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
            {ru.placeFilters.apply}
          </button>
        </div>
      </form>
    </section>
  );
}
