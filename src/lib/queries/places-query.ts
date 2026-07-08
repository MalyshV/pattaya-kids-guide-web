export type PlacesFilter = {
  indoor?: boolean;
  outdoor?: boolean;
  hasFood?: boolean;
  hasWifi?: boolean;
  hasAirCon?: boolean;
  hasParking?: boolean;
  canLeaveChild?: boolean;
  animalContact?: boolean;
  /** Композит «Можно поработать»: раскрывается в hasWifi && hasAirCon && hasCafeSeating (см. сервис) */
  workFriendly?: boolean;
  /** Композит «Спрятаться от жары/дождя»: (indoor || навес) && (кондиционер || вентиляторы) (см. сервис) */
  shelter?: boolean;
};

export type PlacesListQuery = {
  filter: PlacesFilter;
  pagination: {
    page?: number;
    limit?: number;
  };
};

function parseBooleanParam(value: string | null): boolean | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

export function parsePlacesListQuery(searchParams: URLSearchParams): PlacesListQuery {
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const page = pageParam ? Number(pageParam) : undefined;
  const limit = limitParam ? Number(limitParam) : undefined;

  return {
    filter: {
      indoor: parseBooleanParam(searchParams.get("indoor")),
      outdoor: parseBooleanParam(searchParams.get("outdoor")),
      hasFood: parseBooleanParam(searchParams.get("hasFood")),
      hasWifi: parseBooleanParam(searchParams.get("hasWifi")),
      hasAirCon: parseBooleanParam(searchParams.get("hasAirCon")),
      hasParking: parseBooleanParam(searchParams.get("hasParking")),
      canLeaveChild: parseBooleanParam(searchParams.get("canLeaveChild")),
      animalContact: parseBooleanParam(searchParams.get("animalContact")),
      workFriendly: parseBooleanParam(searchParams.get("workFriendly")),
      shelter: parseBooleanParam(searchParams.get("shelter")),
    },
    pagination: {
      page,
      limit,
    },
  };
}
