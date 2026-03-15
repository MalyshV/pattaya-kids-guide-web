import type { EventDto } from "@/dto/event.dto";

export type EventPlacePreviewDto = {
  id: string;
  name: string;
  slug: string;
};

export type EventDetailsDto = EventDto & {
  place: EventPlacePreviewDto | null;
};
