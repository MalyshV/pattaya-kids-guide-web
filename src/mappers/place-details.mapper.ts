import type { PlaceDetailsDto } from "@/dto/place-details.dto";
import { mapPlaceToDto } from "@/mappers/place.mapper";
import type { Prisma } from "@prisma/client";

type PlaceWithDetails = Prisma.PlaceGetPayload<{
  include: {
    categories: {
      include: {
        category: true;
      };
    };
    amenities: {
      include: {
        amenity: {
          include: {
            group: true;
          };
        };
      };
    };
    ageGroups: {
      include: {
        ageGroup: true;
      };
    };
    birthdayInfo: true;
    schedules: true;
    pricing: true;
    staffLanguages: {
      include: {
        language: true;
      };
    };
    tips: true;
    contacts: true;
  };
}>;

export function mapPlaceDetailsToDto(place: PlaceWithDetails): PlaceDetailsDto {
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
    schedules: place.schedules.map((schedule) => ({
      day: schedule.day,
      openTime: schedule.openTime,
      closeTime: schedule.closeTime,
      isClosed: schedule.isClosed,
    })),
    pricing: place.pricing.map((price) => ({
      priceType: price.priceType,
      audience: price.audience,
      minPrice: price.minPrice,
      maxPrice: price.maxPrice,
      currency: price.currency,
    })),
    staffLanguages: place.staffLanguages.map((link) => ({
      id: link.language.id,
      code: link.language.code,
      name: link.language.name,
    })),
    tips: place.tips.map((tip) => ({
      id: tip.id,
      text: tip.text,
      topic: tip.topic,
      verifiedAt: tip.verifiedAt,
    })),
    contacts: place.contacts.map((contact) => ({
      id: contact.id,
      type: contact.type,
      value: contact.value,
    })),
  };
}
