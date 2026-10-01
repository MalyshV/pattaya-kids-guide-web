"use client";

import { useParams } from "next/navigation";
import { DEFAULT_CITY_SLUG } from "./base-path";

/** Slug текущего города из URL (`/ru/pattaya/...`) — для клиентских островков. */
export function useCitySlug(): string {
  const params = useParams<{ city?: string }>();
  return params.city ?? DEFAULT_CITY_SLUG;
}
