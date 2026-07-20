import type { PlaceDto } from "@/dto/place.dto";

// Список мест не проходит через маппер (карточка локализует сама по basePath),
// поэтому DTO допускает сырые en/th-поля из Prisma.
export type PlaceListItemDto = PlaceDto & {
  descriptionEn?: string | null;
  descriptionTh?: string | null;
};
