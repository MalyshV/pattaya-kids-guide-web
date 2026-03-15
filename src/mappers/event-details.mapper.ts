import type { EventDetailsDto } from "@/dto/event-details.dto";
import { mapEventToDto } from "@/mappers/event.mapper";
import type { Prisma } from "@prisma/client";

type EventWithOptionalPlace = Prisma.EventGetPayload<{
  include: {
    place: true;
  };
}>;

export function mapEventDetailsToDto(event: EventWithOptionalPlace): EventDetailsDto {
  return {
    ...mapEventToDto(event),
    place: event.place
      ? {
          id: event.place.id,
          name: event.place.name,
          slug: event.place.slug,
        }
      : null,
  };
}
