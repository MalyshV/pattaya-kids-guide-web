import type { Event } from "@prisma/client";
import type { EventDto } from "@/dto/event.dto";

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
