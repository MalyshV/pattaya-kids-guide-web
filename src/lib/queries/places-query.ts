export type PlacesListQuery = {
  pagination: {
    page?: number;
    limit?: number;
  };
};

export function parsePlacesListQuery(searchParams: URLSearchParams): PlacesListQuery {
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const page = pageParam ? Number(pageParam) : undefined;
  const limit = limitParam ? Number(limitParam) : undefined;

  return {
    pagination: {
      page,
      limit,
    },
  };
}
