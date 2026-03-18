export type PlacesFilter = {
  indoor?: boolean;
  hasFood?: boolean;
  hasWifi?: boolean;
  canLeaveChild?: boolean;
  animalContact?: boolean;
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
      hasFood: parseBooleanParam(searchParams.get("hasFood")),
      hasWifi: parseBooleanParam(searchParams.get("hasWifi")),
      canLeaveChild: parseBooleanParam(searchParams.get("canLeaveChild")),
      animalContact: parseBooleanParam(searchParams.get("animalContact")),
    },
    pagination: {
      page,
      limit,
    },
  };
}
