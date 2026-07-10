"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import type { Dictionary } from "@/content/dictionary";

type PlaceFiltersProps = {
  // Сценарии-чипы и возраст живут выше — здесь их только сохраняем, чтобы
  // «Показать»/«Сбросить» их не сбрасывали.
  age?: string;
  openNow?: string;
  openMorning?: string;
  workFriendly?: string;
  shelter?: string;
  near?: string;
  view?: string;
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

function buildFilters(dict: Dictionary): FilterConfig[] {
  return [
    { name: "indoor", label: dict.placeFilters.labels.indoor },
    { name: "outdoor", label: dict.placeFilters.labels.outdoor },
    { name: "hasFood", label: dict.placeFilters.labels.hasFood },
    { name: "hasWifi", label: dict.placeFilters.labels.hasWifi },
    { name: "hasAirCon", label: dict.placeFilters.labels.hasAirCon },
    { name: "hasParking", label: dict.placeFilters.labels.hasParking },
    { name: "canLeaveChild", label: dict.placeFilters.labels.canLeaveChild },
    { name: "animalContact", label: dict.placeFilters.labels.animalContact },
  ];
}

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
  const dict = useDictionary();

  const FILTERS = useMemo(() => buildFilters(dict), [dict]);
  const initialState = useMemo(() => buildInitialState(props), [props]);
  const [filters, setFilters] = useState<FiltersState>(initialState);
  // Отклик на «Применить»: на проде ответ идёт ~0.3с — без индикации кажется,
  // что кнопка не сработала.
  const [isPending, startTransition] = useTransition();

  function handleToggle(name: FilterKey): void {
    setFilters((current) => ({
      ...current,
      [name]: !current[name],
    }));
  }

  // Активные сценарии-чипы и возраст — пронести через «Показать»/«Сбросить».
  function scenarioParams(): URLSearchParams {
    const params = new URLSearchParams();
    if (props.age) {
      params.set("age", props.age);
    }
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
    if (props.near === "true") {
      params.set("near", "true");
    }
    if (props.view === "map") {
      params.set("view", "map");
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

    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    });
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
    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    });
  }

  return (
    <section className="filters-panel">
      <div className="filters-panel-header">
        <div>
          <h2 className="section-title">{dict.placeFilters.title}</h2>
          <p className="section-subtitle">{dict.placeFilters.subtitle}</p>
        </div>

        <button className="reset-link reset-button" type="button" onClick={handleReset}>
          {dict.placeFilters.reset}
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
          <button
            className={`primary-button${isPending ? " primary-button-pending" : ""}`}
            type="submit"
            aria-busy={isPending}
          >
            {isPending ? dict.placeFilters.applying : dict.placeFilters.apply}
          </button>
        </div>
      </form>
    </section>
  );
}
