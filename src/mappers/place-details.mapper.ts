import type { PlaceDetailsDto } from "@/dto/place-details.dto";
import { mapPlaceToDto } from "@/mappers/place.mapper";
import { pickLocalized } from "@/lib/i18n/localize";
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
    entryPrices: true;
    photos: true;
    staffLanguages: {
      include: {
        language: true;
      };
    };
    tips: true;
    contacts: true;
    programs: true;
  };
}>;

export function mapPlaceDetailsToDto(
  place: PlaceWithDetails,
  lang: string = "ru",
): PlaceDetailsDto {
  return {
    ...mapPlaceToDto(place, lang),
    categories: place.categories.map((link) => ({
      id: link.category.id,
      name: pickLocalized(link.category.name, link.category.nameEn, lang),
      slug: link.category.slug,
    })),
    amenities: place.amenities.map((link) => ({
      id: link.amenity.id,
      name: pickLocalized(link.amenity.name, link.amenity.nameEn, lang),
      slug: link.amenity.slug,
      group: {
        id: link.amenity.group.id,
        name: link.amenity.group.name,
        slug: link.amenity.group.slug,
      },
    })),
    ageGroups: place.ageGroups.map((link) => ({
      id: link.ageGroup.id,
      name: pickLocalized(link.ageGroup.name, link.ageGroup.nameEn, lang),
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
          notes: pickLocalized(
            place.birthdayInfo.notes,
            place.birthdayInfo.notesEn,
            lang,
          ),
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
    entryPrices: place.entryPrices.map((tier) => ({
      id: tier.id,
      label: pickLocalized(tier.label, tier.labelEn, lang),
      childPrice: tier.childPrice,
      adultPrice: tier.adultPrice,
      currency: tier.currency,
    })),
    entryPriceNote: pickLocalized(place.entryPriceNote, place.entryPriceNoteEn, lang),
    photos: place.photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption,
    })),
    staffLanguages: place.staffLanguages.map((link) => ({
      id: link.language.id,
      code: link.language.code,
      name: pickLocalized(link.language.name, link.language.nameEn, lang),
    })),
    tips: place.tips.map((tip) => ({
      id: tip.id,
      text: pickLocalized(tip.text, tip.textEn, lang),
      topic: tip.topic,
      verifiedAt: tip.verifiedAt,
    })),
    contacts: place.contacts.map((contact) => ({
      id: contact.id,
      type: contact.type,
      value: contact.value,
    })),
    programs: place.programs.map((program) => ({
      id: program.id,
      slug: program.slug,
      type: program.type,
      name: pickLocalized(program.name, program.nameEn, lang),
      description: pickLocalized(program.description, program.descriptionEn, lang),
      price: program.price,
      oldPrice: program.oldPrice,
      currency: program.currency,
      priceUnit: pickLocalized(program.priceUnit, program.priceUnitEn, lang),
      startDate: program.startDate,
      endDate: program.endDate,
    })),
  };
}
