import type { PlaceDto } from "@/dto/place.dto";
import type { PlaceListItemDto } from "@/dto/place-list-item.dto";
import { pickLocalized } from "@/lib/i18n/localize";
import type { Place } from "@prisma/client";

export function mapPlaceToDto(place: Place, lang: string = "ru"): PlaceDto {
  return {
    id: place.id,
    name: place.name,
    slug: place.slug,
    description: pickLocalized(
      place.description,
      place.descriptionEn,
      place.descriptionTh,
      lang,
    ),
    imageUrl: place.imageUrl,
    address: place.address,
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
 * поэтому en/th-поля передаём сырыми. ВАЖНО: список уходит в клиентский
 * компонент — сырую Prisma-модель со служебными полями (модерация, заметки)
 * сериализовать в браузер нельзя, только этот отобранный набор.
 */
export function mapPlaceToListItemDto(place: Place): PlaceListItemDto {
  return {
    ...mapPlaceToDto(place),
    description: place.description,
    descriptionEn: place.descriptionEn,
    descriptionTh: place.descriptionTh,
  };
}
