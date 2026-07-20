import type { EventDto } from "@/dto/event.dto";
import type { EventListItemDto } from "@/dto/event-list-item.dto";
import type { Event, Prisma } from "@prisma/client";
import { pickLocalized } from "@/lib/i18n/localize";

type EventWithPlace = Prisma.EventGetPayload<{
  include: {
    place: true;
  };
}>;

export function mapEventToDto(event: Event, lang: string = "ru"): EventDto {
  return {
    id: event.id,
    title: pickLocalized(event.title, event.titleEn, event.titleTh, lang),
    slug: event.slug,
    imageUrl: event.imageUrl,
    description: pickLocalized(
      event.description,
      event.descriptionEn,
      event.descriptionTh,
      lang,
    ),
    startDate: event.startDate.toISOString(),
    endDate: event.endDate ? event.endDate.toISOString() : null,
    minAgeMonths: event.minAgeMonths,
    maxAgeMonths: event.maxAgeMonths,
    locationName: pickLocalized(
      event.locationName,
      event.locationNameEn,
      event.locationNameTh,
      lang,
    ),
    address: event.address,
  };
}

export function mapEventListItemToDto(
  event: EventWithPlace,
  lang: string = "ru",
): EventListItemDto {
  return {
    id: event.id,
    title: pickLocalized(event.title, event.titleEn, event.titleTh, lang),
    slug: event.slug,
    imageUrl: event.imageUrl,
    description: pickLocalized(
      event.description,
      event.descriptionEn,
      event.descriptionTh,
      lang,
    ),
    startDate: event.startDate.toISOString(),
    endDate: event.endDate ? event.endDate.toISOString() : null,
    minAgeMonths: event.minAgeMonths,
    maxAgeMonths: event.maxAgeMonths,
    locationName: pickLocalized(
      event.locationName,
      event.locationNameEn,
      event.locationNameTh,
      lang,
    ),
    address: event.address,
    place: event.place
      ? {
          id: event.place.id,
          name: event.place.name,
          slug: event.place.slug,
        }
      : null,
  };
}
