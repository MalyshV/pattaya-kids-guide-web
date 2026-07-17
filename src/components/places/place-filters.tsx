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

function sameState(a: FiltersState, b: FiltersState): boolean {
  return (Object.keys(a) as FilterKey[]).every((key) => a[key] === b[key]);
}

export function PlaceFilters(props: PlaceFiltersProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const dict = useDictionary();

  const FILTERS = useMemo(() => buildFilters(dict), [dict]);
  const initialState = useMemo(() => buildInitialState(props), [props]);
  const [filters, setFilters] = useState<FiltersState>(initialState);
  // Чекбокс применяется мгновенно (визуал — сразу, сервер догоняет),
  // как соседние чипы: два разных механизма рядом путали, «Применить»
  // между тапом и результатом больше не стоит.
  const [isPending, startTransition] = useTransition();

  // Ресинк с URL (паттерн «adjusting state when props change»): после
  // системного «назад» или перехода по чистой ссылке галочки обязаны
  // соответствовать URL, иначе видишь отмеченный фильтр и полный список.
  const [prevInitial, setPrevInitial] = useState(initialState);
  if (!sameState(prevInitial, initialState)) {
    setPrevInitial(initialState);
    setFilters(initialState);
  }

  function pushFilters(next: FiltersState): void {
    const searchParams = scenarioParams();
    (Object.entries(next) as Array<[FilterKey, boolean]>).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, "true");
      }
    });
    const queryString = searchParams.toString();
    startTransition(() => {
      // scroll: false — родитель остаётся у панели, страница не прыгает к шапке
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  function handleToggle(name: FilterKey): void {
    const next = { ...filters, [name]: !filters[name] };
    setFilters(next);
    pushFilters(next);
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
    pushFilters(emptyState);
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

      {/* aria-busy + лёгкое приглушение на время догоняющего сервера —
          тот же язык отклика, что у сценарных чипов */}
      <div
        className={`filters-grid${isPending ? " chips-pending" : ""}`}
        aria-busy={isPending}
      >
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
    </section>
  );
}
