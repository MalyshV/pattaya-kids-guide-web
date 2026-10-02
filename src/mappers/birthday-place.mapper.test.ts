import { describe, expect, it } from "vitest";
import type { BirthdayPlace } from "@/services/places.service";
import { mapBirthdayPlaceToDto } from "@/mappers/birthday-place.mapper";

const PLACE = {
  id: "p1",
  slug: "kids-land",
  name: "Kids Land",
  imageUrl: null,
  address: "ул. 1",
  latitude: 12.9,
  longitude: 100.8,
  birthdayInfo: {
    minGuests: 5,
    maxGuests: 20,
    depositRequired: true,
    preBookingDays: 7,
    notes: "Торт можно свой",
    notesEn: "Own cake allowed",
    notesTh: null,
  },
  contacts: [{ id: "c1", type: "PHONE", value: "+66", extra: "не отдаём" }],
} as unknown as BirthdayPlace;

describe("mapBirthdayPlaceToDto — карточка места для дня рождения", () => {
  it("условия ДР переносятся как есть", () => {
    const dto = mapBirthdayPlaceToDto(PLACE);
    expect(dto).toMatchObject({
      minGuests: 5,
      maxGuests: 20,
      depositRequired: true,
      preBookingDays: 7,
    });
  });

  it("заметка по языку с каскадом th → en → ru", () => {
    expect(mapBirthdayPlaceToDto(PLACE, "ru").notes).toBe("Торт можно свой");
    expect(mapBirthdayPlaceToDto(PLACE, "en").notes).toBe("Own cake allowed");
    expect(mapBirthdayPlaceToDto(PLACE, "th").notes).toBe("Own cake allowed");
  });

  it("нет birthdayInfo — все поля условий null, без падения", () => {
    const dto = mapBirthdayPlaceToDto({ ...PLACE, birthdayInfo: null } as BirthdayPlace);
    expect(dto.minGuests).toBeNull();
    expect(dto.maxGuests).toBeNull();
    expect(dto.depositRequired).toBeNull();
    expect(dto.preBookingDays).toBeNull();
    expect(dto.notes).toBeNull();
  });

  it("контакты отдаются только id/type/value", () => {
    expect(mapBirthdayPlaceToDto(PLACE).contacts).toEqual([
      { id: "c1", type: "PHONE", value: "+66" },
    ]);
  });
});
