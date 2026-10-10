import { PATTAYA_DISTRICTS } from "@/lib/districts/pattaya";
import type { DistrictDefinition } from "@/lib/districts/resolve-district";

/**
 * Районы по slug города. Новый город — свой файл с границами и строка здесь;
 * город без районов получает пустой список, и всё у него — «без района».
 */
const DISTRICTS_BY_CITY: Readonly<Record<string, readonly DistrictDefinition[]>> = {
  pattaya: PATTAYA_DISTRICTS,
};

export function getCityDistrictDefinitions(
  citySlug: string,
): readonly DistrictDefinition[] {
  return DISTRICTS_BY_CITY[citySlug] ?? [];
}
