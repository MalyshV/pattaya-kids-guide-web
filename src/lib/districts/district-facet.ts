import type { DistrictDto } from "@/dto/district.dto";
import { countByDistrict, placeDistrictSlug } from "@/lib/districts/place-district";
import type { PlaceDistrictSource } from "@/lib/districts/place-district";
import type { DistrictDefinition } from "@/lib/districts/resolve-district";
import { toDistrictDto } from "@/mappers/district.mapper";

/**
 * Фильтр «Район» для каталогов мест, занятий и событий: в выборе все районы
 * города в порядке показа, у каждого — сколько записей при остальных
 * условиях. Пустые районы не прячем (решение 10.11): пустой район в каталоге
 * — приглашение рассказать о том, чего на сайте ещё нет.
 */

export type DistrictOption = DistrictDto & { count: number };

export type DistrictFacet<T> = {
  /** записи после фильтра по району (без выбора — все) */
  entries: T[];
  /** варианты для выбора района, в порядке показа */
  options: DistrictOption[];
};

export function districtFacet<T extends { districtSlug: string | null }>(
  entries: readonly T[],
  active: string | null,
  districts: readonly DistrictDefinition[],
  lang: string,
): DistrictFacet<T> {
  const options: DistrictOption[] = countByDistrict(
    entries.map((entry) => entry.districtSlug),
    districts,
    { includeEmpty: true },
  ).map(({ district, count }) => ({ ...toDistrictDto(district, lang), count }));
  return {
    entries: active
      ? entries.filter((entry) => entry.districtSlug === active)
      : [...entries],
    options,
  };
}

/** Район каждого места города: id → slug (null — место вне районов). */
export function placeDistrictMap(
  places: ReadonlyArray<PlaceDistrictSource & { id: string }>,
  districts: readonly DistrictDefinition[],
): Map<string, string | null> {
  return new Map(places.map((place) => [place.id, placeDistrictSlug(place, districts)]));
}
