import type { PlaceDto } from "@/dto/place.dto";
import type { Place } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export function mapPlaceToDto(place: Place): PlaceDto {
  return {
    id: place.id,
    name: place.name,
    slug: place.slug,
    description: place.description,
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
