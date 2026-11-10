import { chooseDistrict } from "@/lib/districts/choose-district";
import type { DistrictDefinition } from "@/lib/districts/resolve-district";

/**
 * Район места на показе — без записи в базу. Ручной выбор из админки (место
 * на границе) побеждает, иначе район считается по координатам. Справочника в
 * базе может ещё не быть — район по координатам от этого не зависит.
 */

export type PlaceDistrictSource = {
  latitude: number | null;
  longitude: number | null;
  districtManual: boolean;
  /** связь из выборки; её может не быть (старая выборка в кэше) */
  district?: { slug: string } | null;
};

export function placeDistrictSlug(
  place: PlaceDistrictSource,
  districts: readonly DistrictDefinition[],
): string | null {
  return chooseDistrict({
    manualSlug: place.districtManual ? (place.district?.slug ?? null) : null,
    latitude: place.latitude,
    longitude: place.longitude,
    districts,
  }).slug;
}

/** Район из ?district=; незнакомый slug — фильтра нет (а не пустой список). */
export function parseDistrictParam(
  value: string | undefined,
  districts: readonly DistrictDefinition[],
): string | null {
  if (!value) {
    return null;
  }
  return districts.some((district) => district.slug === value) ? value : null;
}

export type DistrictCount = {
  district: DistrictDefinition;
  count: number;
};

/**
 * Районы, в которых есть хотя бы одно место, — в порядке показа и с числом
 * мест. Пустые районы в выбор не попадают: выбрать район и увидеть «ничего
 * не нашлось» — разочарование без пользы.
 */
export function countByDistrict(
  slugs: readonly (string | null)[],
  districts: readonly DistrictDefinition[],
): DistrictCount[] {
  const counts = new Map<string, number>();
  for (const slug of slugs) {
    if (slug) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  return [...districts]
    .sort((a, b) => a.order - b.order)
    .map((district) => ({ district, count: counts.get(district.slug) ?? 0 }))
    .filter((entry) => entry.count > 0);
}
