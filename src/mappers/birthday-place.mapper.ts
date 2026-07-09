import type { BirthdayPlaceDto } from "@/dto/birthday-place.dto";
import type { BirthdayPlace } from "@/services/places.service";
import { pickLocalized } from "@/lib/i18n/localize";

export function mapBirthdayPlaceToDto(
  place: BirthdayPlace,
  lang: string = "ru",
): BirthdayPlaceDto {
  return {
    id: place.id,
    slug: place.slug,
    name: place.name,
    imageUrl: place.imageUrl,
    address: place.address,
    minGuests: place.birthdayInfo?.minGuests ?? null,
    maxGuests: place.birthdayInfo?.maxGuests ?? null,
    depositRequired: place.birthdayInfo?.depositRequired ?? null,
    preBookingDays: place.birthdayInfo?.preBookingDays ?? null,
    notes: pickLocalized(
      place.birthdayInfo?.notes ?? null,
      place.birthdayInfo?.notesEn,
      lang,
    ),
    contacts: place.contacts.map((contact) => ({
      id: contact.id,
      type: contact.type,
      value: contact.value,
    })),
  };
}
