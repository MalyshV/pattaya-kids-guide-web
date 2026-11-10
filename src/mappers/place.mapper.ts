import type { PlaceDto } from "@/dto/place.dto";
import type { PlaceListItemDto } from "@/dto/place-list-item.dto";
import { pickLocalized } from "@/lib/i18n/localize";
import { placeDisplayName } from "@/lib/places/display-name";
import { closureKind } from "@/lib/places/closure";
import { toPlaceDistrictDto } from "@/mappers/district.mapper";
import type { DistrictDefinition } from "@/lib/districts/resolve-district";
import type { Place } from "@prisma/client";

/** Место из выборки; связь с районом есть только там, где её запросили. */
type PlaceSource = Place & { district?: { slug: string } | null };

/**
 * districts — районы города (границы в коде). Без них район в DTO пустой:
 * так живут страницы, где он не показывается.
 */
export function mapPlaceToDto(
  place: PlaceSource,
  lang: string = "ru",
  districts: readonly DistrictDefinition[] = [],
): PlaceDto {
  return {
    id: place.id,
    // точка сети: «Skippy Land · Lotus's North, у фудкорта» — метка на языке страницы
    name: placeDisplayName(place, lang),
    closure: closureKind(place),
    slug: place.slug,
    description: pickLocalized(
      place.description,
      place.descriptionEn,
      place.descriptionTh,
      lang,
    ),
    imageUrl: place.imageUrl,
    address: place.address,
    district: toPlaceDistrictDto(place, districts, lang),
    latitude: place.latitude,
    longitude: place.longitude,
    googleMapsUrl: place.googleMapsUrl,
    indoor: place.indoor,
    outdoor: place.outdoor,
    hasFood: place.hasFood,
    hasWifi: place.hasWifi,
    canLeaveChild: place.canLeaveChild,
    leaveChildFromMonths: place.leaveChildFromMonths,
    animalContact: place.animalContact,
    hasAirCon: place.hasAirCon,
    hasParking: place.hasParking,
    hasCafeSeating: place.hasCafeSeating,
    hasPowerOutlets: place.hasPowerOutlets,
  };
}

/**
 * Слим-DTO для списка: карточка локализует описание сама (по basePath),
 * поэтому en/th-поля передаём сырыми. Имя — уже отображаемое (бренд · метка
 * точки на языке страницы): оно же уходит в ♡/✓-снимок и на карту. ВАЖНО: список уходит в клиентский
 * компонент — сырую Prisma-модель со служебными полями (модерация, заметки)
 * сериализовать в браузер нельзя, только этот отобранный набор.
 */
export function mapPlaceToListItemDto(
  place: PlaceSource,
  lang: string = "ru",
  districts: readonly DistrictDefinition[] = [],
): PlaceListItemDto {
  return {
    ...mapPlaceToDto(place, lang, districts),
    description: place.description,
    descriptionEn: place.descriptionEn,
    descriptionTh: place.descriptionTh,
  };
}
