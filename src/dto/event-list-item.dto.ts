import type { EventDto } from "@/dto/event.dto";

export type EventPlacePreviewDto = {
  id: string;
  name: string;
  slug: string;
};

export type EventListItemDto = EventDto & {
  place: EventPlacePreviewDto | null;
};
