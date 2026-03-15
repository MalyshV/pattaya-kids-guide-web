import type { EventDto } from "@/dto/event.dto";
import type { EventListItemDto } from "@/dto/event-list-item.dto";
import type { Event, Prisma } from "@prisma/client";

type EventWithPlace = Prisma.EventGetPayload<{
  include: {
    place: true;
  };
}>;

export function mapEventToDto(event: Event): EventDto {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate ? event.endDate.toISOString() : null,
    locationName: event.locationName,
    address: event.address,
  };
}

export function mapEventListItemToDto(event: EventWithPlace): EventListItemDto {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate ? event.endDate.toISOString() : null,
    locationName: event.locationName,
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
