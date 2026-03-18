import type { PlaceDto } from "@/dto/place.dto";
import type { Place } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export function mapPlaceToDto(place: Place): PlaceDto {
  return {
    id: place.id,
    name: place.name,
    slug: place.slug,
    description: place.description,
    address: place.address,
    latitude: place.latitude,
    longitude: place.longitude,
    indoor: place.indoor,
    hasFood: place.hasFood,
    hasWifi: place.hasWifi,
    canLeaveChild: place.canLeaveChild,
    animalContact: place.animalContact,
  };
}
