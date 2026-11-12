import type { EventDto } from "@/dto/event.dto";

export type EventPlacePreviewDto = {
  id: string;
  name: string;
  slug: string;
  /** адрес места — запасной адрес события, если своего нет */
  address: string;
};

export type EventListItemDto = EventDto & {
  place: EventPlacePreviewDto | null;
};
