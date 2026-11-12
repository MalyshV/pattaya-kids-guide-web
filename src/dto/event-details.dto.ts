import type { TipDto } from "@/dto/tip.dto";
import type { EventDto } from "@/dto/event.dto";
import type { EventPlacePreviewDto } from "@/dto/event-list-item.dto";

export type EventDetailsDto = EventDto & {
  place: EventPlacePreviewDto | null;
  /** «Полезно знать» — как у места */
  tips: TipDto[];
};
