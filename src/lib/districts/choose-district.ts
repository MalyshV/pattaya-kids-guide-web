import type { DistrictDto } from "@/dto/district.dto";
import {
  resolveDistrictSlug,
  type DistrictDefinition,
} from "@/lib/districts/resolve-district";

/**
 * Район места при сохранении: ручной выбор в админке (место на границе) или
 * по координатам. Одна и та же логика у формы и у prisma/add-districts.ts —
 * поэтому ручной выбор не слетает ни при следующем сохранении, ни при
 * повторном запуске скрипта.
 */

export type DistrictChoice = {
  /** slug района; null — «без района» */
  slug: string | null;
  /** true — выбран вручную, по координатам не пересчитывается */
  manual: boolean;
};

export function chooseDistrict(input: {
  /** slug из ручного выбора; null/"" — «по координатам» */
  manualSlug: string | null | undefined;
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  districts: readonly DistrictDefinition[];
}): DistrictChoice {
  const { manualSlug, latitude, longitude, districts } = input;
  // района из ручного выбора больше нет в коде (переименовали, убрали) —
  // честнее вернуться к координатам, чем держать ссылку в пустоту
  if (manualSlug && districts.some((district) => district.slug === manualSlug)) {
    return { slug: manualSlug, manual: true };
  }
  return { slug: resolveDistrictSlug(latitude, longitude, districts), manual: false };
}

/** Что показать в поле «Район» формы места. */
export type DistrictFieldDto = {
  /** все районы города в порядке показа */
  options: DistrictDto[];
  /** выбранный вручную slug; null — «по координатам» */
  manualSlug: string | null;
  /** район по сохранённым координатам; null — без района или координат нет */
  byCoordinates: DistrictDto | null;
};

export function buildDistrictField(input: {
  districts: readonly DistrictDefinition[];
  /** сохранённое место; null — новое */
  place: {
    latitude: number;
    longitude: number;
    districtManual: boolean;
    districtSlug: string | null;
  } | null;
}): DistrictFieldDto {
  const { districts, place } = input;
  const options = [...districts]
    .sort((a, b) => a.order - b.order)
    .map((district) => ({ slug: district.slug, name: district.name }));
  if (!place) {
    return { options, manualSlug: null, byCoordinates: null };
  }
  const autoSlug = resolveDistrictSlug(place.latitude, place.longitude, districts);
  const manual = chooseDistrict({
    manualSlug: place.districtManual ? place.districtSlug : null,
    latitude: place.latitude,
    longitude: place.longitude,
    districts,
  });
  return {
    options,
    manualSlug: manual.manual ? manual.slug : null,
    byCoordinates: options.find((option) => option.slug === autoSlug) ?? null,
  };
}
