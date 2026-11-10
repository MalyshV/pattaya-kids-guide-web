import type { District } from "@prisma/client";
import type { DistrictDto } from "@/dto/district.dto";
import { pickLocalized } from "@/lib/i18n/localize";
import {
  placeDistrictSlug,
  type PlaceDistrictSource,
} from "@/lib/districts/place-district";
import type { DistrictDefinition } from "@/lib/districts/resolve-district";

export type DistrictRow = Pick<District, "slug" | "name" | "nameEn" | "nameTh">;

export function toDistrictDto(district: DistrictRow, lang: string): DistrictDto {
  return {
    slug: district.slug,
    name: pickLocalized(district.name, district.nameEn, district.nameTh, lang),
  };
}

/**
 * Район места для карточки и фильтра: считается на показе из ручного выбора
 * или координат, название — из определений города на языке страницы.
 */
export function toPlaceDistrictDto(
  place: PlaceDistrictSource,
  districts: readonly DistrictDefinition[],
  lang: string,
): DistrictDto | null {
  const slug = placeDistrictSlug(place, districts);
  const district = districts.find((candidate) => candidate.slug === slug);
  return district ? toDistrictDto(district, lang) : null;
}
