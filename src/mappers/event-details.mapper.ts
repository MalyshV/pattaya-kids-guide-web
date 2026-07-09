import type { EventDetailsDto } from "@/dto/event-details.dto";
import type { EventDetailsResult } from "@/services/events.service";
import { mapEventToDto } from "@/mappers/event.mapper";

export function mapEventDetailsToDto(
  event: EventDetailsResult,
  lang: string = "ru",
): EventDetailsDto {
  return {
    ...mapEventToDto(event, lang),
    place: event.place
      ? {
          id: event.place.id,
          name: event.place.name,
          slug: event.place.slug,
        }
      : null,
  };
}
