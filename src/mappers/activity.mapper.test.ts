import { describe, expect, it } from "vitest";
import type { ActivityWithPlace } from "@/services/activities.service";
import { mapActivityToListItem } from "@/mappers/activity.mapper";

const ACTIVITY = {
  id: "a1",
  slug: "camp",
  imageUrl: null,
  type: "CAMP",
  name: "Лагерь",
  nameEn: "Camp",
  nameTh: null,
  description: null,
  descriptionEn: null,
  descriptionTh: null,
  price: 5000,
  oldPrice: null,
  currency: "THB",
  priceUnit: "за неделю",
  priceUnitEn: "per week",
  priceUnitTh: null,
  minAgeMonths: 36,
  maxAgeMonths: 144,
  startDate: new Date("2026-11-01T00:00:00.000Z"),
  endDate: null,
  place: null,
  venueName: null,
  venueNameEn: null,
  venueNameTh: null,
  venueAddress: null,
  categories: [
    {
      category: { id: "c1", name: "Спорт", nameEn: null, nameTh: "กีฬา", slug: "sport" },
    },
  ],
  classes: [
    {
      id: "k1",
      name: "Группа А",
      ageLabel: "3–5 лет",
      ageLabelEn: "3–5 y.o.",
      ageLabelTh: null,
      minAgeMonths: 36,
      maxAgeMonths: 60,
      parentRequired: false,
      schedule: "пн, ср",
      scheduleEn: null,
      scheduleTh: null,
    },
  ],
} as unknown as ActivityWithPlace;

describe("mapActivityToListItem — цены и расписание", () => {
  it("единица цены локализуется, сама цена не трогается", () => {
    const dto = mapActivityToListItem(ACTIVITY, "en");
    expect(dto.price).toBe(5000);
    expect(dto.oldPrice).toBeNull();
    expect(dto.priceUnit).toBe("per week");
    expect(mapActivityToListItem(ACTIVITY, "ru").priceUnit).toBe("за неделю");
  });

  it("даты-строки с кэш-хита возвращаются Date, пустые — null", () => {
    const cached = {
      ...ACTIVITY,
      startDate: "2026-11-01T00:00:00.000Z",
      endDate: "2026-11-08T00:00:00.000Z",
    } as unknown as ActivityWithPlace;
    const dto = mapActivityToListItem(cached);
    expect(dto.startDate).toBeInstanceOf(Date);
    expect(dto.startDate?.getTime()).toBe(Date.parse("2026-11-01T00:00:00.000Z"));
    expect(dto.endDate).toBeInstanceOf(Date);

    const open = mapActivityToListItem(ACTIVITY);
    expect(open.startDate).toBeInstanceOf(Date);
    expect(open.endDate).toBeNull();
  });

  it("занятия группы: возраст и расписание по языку, с каскадом", () => {
    const th = mapActivityToListItem(ACTIVITY, "th").classes[0];
    expect(th.ageLabel).toBe("3–5 y.o.");
    expect(th.schedule).toBe("пн, ср");
    expect(th.parentRequired).toBe(false);
    expect(th.name).toBe("Группа А");
  });

  it("категории: тайское название на th, иначе русское", () => {
    expect(mapActivityToListItem(ACTIVITY, "th").categories[0].name).toBe("กีฬา");
    expect(mapActivityToListItem(ACTIVITY, "en").categories[0].name).toBe("Спорт");
  });

  it("площадка: место сжимается до name/slug/address, без места — null", () => {
    const withPlace = {
      ...ACTIVITY,
      place: { id: "p", name: "Клуб", slug: "club", address: "ул. 2", notes: "x" },
    } as unknown as ActivityWithPlace;
    expect(mapActivityToListItem(withPlace).place).toEqual({
      name: "Клуб",
      slug: "club",
      address: "ул. 2",
    });
    expect(mapActivityToListItem(ACTIVITY).place).toBeNull();
  });
});
