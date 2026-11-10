import type { DistrictDto } from "@/dto/district.dto";
import { countByDistrict, placeDistrictSlug } from "@/lib/districts/place-district";
import type { PlaceDistrictSource } from "@/lib/districts/place-district";
import type { DistrictDefinition } from "@/lib/districts/resolve-district";
import { toDistrictDto } from "@/mappers/district.mapper";

/**
 * Фильтр «Район» для каталогов занятий и событий — та же логика, что у мест:
 * в выборе только районы, где при остальных условиях что-то есть, с числом;
 * выбранный район остаётся в выборе, даже если в нём стало пусто.
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
  ).map(({ district, count }) => ({ ...toDistrictDto(district, lang), count }));
  if (!active) {
    return { entries: [...entries], options };
  }
  // иначе фильтр включён, а снять его нечем
  const definition = districts.find((district) => district.slug === active);
  if (definition && !options.some((option) => option.slug === active)) {
    options.push({ ...toDistrictDto(definition, lang), count: 0 });
  }
  return {
    entries: entries.filter((entry) => entry.districtSlug === active),
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
