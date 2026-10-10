import type { District } from "@prisma/client";
import type { DistrictDto } from "@/dto/district.dto";
import { pickLocalized } from "@/lib/i18n/localize";

export type DistrictRow = Pick<District, "slug" | "name" | "nameEn" | "nameTh">;

export function toDistrictDto(district: DistrictRow, lang: string): DistrictDto {
  return {
    slug: district.slug,
    name: pickLocalized(district.name, district.nameEn, district.nameTh, lang),
  };
}
