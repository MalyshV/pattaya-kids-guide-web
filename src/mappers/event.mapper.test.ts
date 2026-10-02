import { describe, expect, it } from "vitest";
import type { Event, Prisma } from "@prisma/client";
import { mapEventListItemToDto, mapEventToDto } from "@/mappers/event.mapper";

type EventWithPlace = Prisma.EventGetPayload<{ include: { place: true } }>;

const EVENT = {
  id: "e1",
  title: "Фестиваль",
  titleEn: "Festival",
  titleTh: null,
  slug: "festival",
  imageUrl: null,
  description: "Описание",
  descriptionEn: null,
  descriptionTh: null,
  startDate: new Date("2026-10-05T03:00:00.000Z"),
  endDate: null,
  minAgeMonths: 12,
  maxAgeMonths: null,
  locationName: "Парк",
  locationNameEn: "Park",
  locationNameTh: null,
  address: "ул. 1",
} as unknown as Event;

describe("mapEventToDto", () => {
  it("даты уходят ISO-строками, пустая endDate — null", () => {
    const dto = mapEventToDto(EVENT);
    expect(dto.startDate).toBe("2026-10-05T03:00:00.000Z");
    expect(dto.endDate).toBeNull();
  });

  it("дата-строка с кэш-хита даёт тот же ISO, что и Date", () => {
    const cached = {
      ...EVENT,
      startDate: "2026-10-05T03:00:00.000Z",
      endDate: "2026-10-06T03:00:00.000Z",
    } as unknown as Event;
    const dto = mapEventToDto(cached);
    expect(dto.startDate).toBe("2026-10-05T03:00:00.000Z");
    expect(dto.endDate).toBe("2026-10-06T03:00:00.000Z");
  });

  it("поля локализуются с каскадом, язык по умолчанию — русский", () => {
    expect(mapEventToDto(EVENT).title).toBe("Фестиваль");
    expect(mapEventToDto(EVENT, "en").title).toBe("Festival");
    // тайского нет → английский; описания нет ни на en, ни на th → русский
    const th = mapEventToDto(EVENT, "th");
    expect(th.title).toBe("Festival");
    expect(th.locationName).toBe("Park");
    expect(th.description).toBe("Описание");
  });

  it("описание-null остаётся null", () => {
    const dto = mapEventToDto({ ...EVENT, description: null } as Event, "en");
    expect(dto.description).toBeNull();
  });
});

describe("mapEventListItemToDto", () => {
  it("место сжимается до id/name/slug", () => {
    const withPlace = {
      ...EVENT,
      place: { id: "p1", name: "Парк", slug: "park", address: "x", notes: "секрет" },
    } as unknown as EventWithPlace;
    expect(mapEventListItemToDto(withPlace).place).toEqual({
      id: "p1",
      name: "Парк",
      slug: "park",
    });
  });

  it("событие без места — place: null", () => {
    const noPlace = { ...EVENT, place: null } as unknown as EventWithPlace;
    expect(mapEventListItemToDto(noPlace).place).toBeNull();
  });
});
