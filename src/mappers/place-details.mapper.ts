import type { PlaceDetailsDto } from "@/dto/place-details.dto";
import type { PlaceDetailsResult } from "@/services/places.service";
import { mapPlaceToDto } from "@/mappers/place.mapper";

export function mapPlaceDetailsToDto(place: PlaceDetailsResult): PlaceDetailsDto {
  return {
    ...mapPlaceToDto(place),
    categories: place.categories.map((link) => ({
      id: link.category.id,
      name: link.category.name,
      slug: link.category.slug,
    })),
    amenities: place.amenities.map((link) => ({
      id: link.amenity.id,
      name: link.amenity.name,
      slug: link.amenity.slug,
      group: {
        id: link.amenity.group.id,
        name: link.amenity.group.name,
        slug: link.amenity.group.slug,
      },
    })),
    ageGroups: place.ageGroups.map((link) => ({
      id: link.ageGroup.id,
      name: link.ageGroup.name,
      minAge: link.ageGroup.minAge,
      maxAge: link.ageGroup.maxAge,
    })),
    birthdayInfo: place.birthdayInfo
      ? {
          hasPackages: place.birthdayInfo.hasPackages,
          minGuests: place.birthdayInfo.minGuests,
          maxGuests: place.birthdayInfo.maxGuests,
          depositRequired: place.birthdayInfo.depositRequired,
          preBookingDays: place.birthdayInfo.preBookingDays,
          notes: place.birthdayInfo.notes,
        }
      : null,
  };
}
