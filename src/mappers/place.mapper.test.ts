import { describe, expect, it } from "vitest";
import type { Place } from "@prisma/client";
import { mapPlaceToDto, mapPlaceToListItemDto } from "@/mappers/place.mapper";

const PLACE = {
  id: "p1",
  name: "Kids Land",
  slug: "kids-land",
  description: "Игровая",
  descriptionEn: "Playroom",
  descriptionTh: null,
  imageUrl: null,
  address: "ул. 1",
  latitude: 12.9,
  longitude: 100.8,
  googleMapsUrl: null,
  indoor: true,
  outdoor: false,
  hasFood: true,
  hasWifi: false,
  canLeaveChild: true,
  leaveChildFromMonths: 36,
  animalContact: false,
  hasAirCon: true,
  hasParking: false,
  hasCafeSeating: true,
  hasPowerOutlets: false,
  moderationNote: "служебное",
} as unknown as Place;

describe("mapPlaceToDto", () => {
  it("описание локализуется с каскадом th → en → ru", () => {
    expect(mapPlaceToDto(PLACE).description).toBe("Игровая");
    expect(mapPlaceToDto(PLACE, "en").description).toBe("Playroom");
    expect(mapPlaceToDto(PLACE, "th").description).toBe("Playroom");
  });

  it("служебные поля модели наружу не уходят", () => {
    expect(mapPlaceToDto(PLACE)).not.toHaveProperty("moderationNote");
  });

  it("точка сети: имя с меткой на языке страницы; без метки — как есть", () => {
    const zone = {
      ...PLACE,
      name: "Skippy Land",
      branchLabel: "Lotus's South",
      branchLabelEn: "Lotus's South",
      branchLabelTh: "Lotus's South",
    } as unknown as Place;
    expect(mapPlaceToDto(zone, "ru").name).toBe("Skippy Land · Lotus's South");
    expect(mapPlaceToListItemDto(zone, "en").name).toBe("Skippy Land · Lotus's South");
    expect(mapPlaceToDto(PLACE, "th").name).toBe("Kids Land");
  });
});

describe("mapPlaceToListItemDto", () => {
  it("описания отдаются сырыми — карточка локализует сама", () => {
    const dto = mapPlaceToListItemDto(PLACE);
    expect(dto.description).toBe("Игровая");
    expect(dto.descriptionEn).toBe("Playroom");
    expect(dto.descriptionTh).toBeNull();
    expect(dto).not.toHaveProperty("moderationNote");
  });
});
