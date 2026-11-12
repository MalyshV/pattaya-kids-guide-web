import { describe, expect, it } from "vitest";
import {
  activityItemMeta,
  eventItemMeta,
  placeItemMeta,
  toDistrictItem,
} from "@/mappers/district-item.mapper";
import type { PlaceListItemDto } from "@/dto/place-list-item.dto";
import type { EventListItemDto } from "@/dto/event-list-item.dto";
import type { ActivityListItemDto } from "@/dto/activity-list-item.dto";

const PLACE: PlaceListItemDto = {
  id: "p1",
  closure: null,
  name: "Kids Land",
  slug: "kids-land",
  description: null,
  imageUrl: null,
  address: "ул. 1",
  district: null,
  latitude: 12.9,
  longitude: 100.87,
  googleMapsUrl: null,
  indoor: true,
  outdoor: false,
  hasFood: true,
  hasWifi: true,
  canLeaveChild: true,
  leaveChildFromMonths: 36,
  animalContact: null,
  hasAirCon: true,
  hasParking: null,
  hasCafeSeating: null,
  hasPowerOutlets: null,
};

describe("placeItemMeta", () => {
  it("формат и удобства, не больше трёх частей", () => {
    expect(placeItemMeta(PLACE, "ru")).toBe("В помещении · Кондиционер · Еда");
  });

  it("закрытое место говорит только о закрытии", () => {
    expect(placeItemMeta({ ...PLACE, closure: "temporarily" }, "ru")).toBe(
      "Временно закрыто",
    );
    expect(placeItemMeta({ ...PLACE, closure: "permanently" }, "ru")).toBe("Закрылось");
  });

  it("нечего сказать — подписи нет", () => {
    expect(
      placeItemMeta(
        {
          ...PLACE,
          indoor: false,
          hasFood: null,
          hasAirCon: null,
          canLeaveChild: null,
        },
        "ru",
      ),
    ).toBeNull();
  });
});

const EVENT: EventListItemDto = {
  id: "e1",
  title: "Мастер-класс",
  slug: "master-class",
  imageUrl: null,
  description: null,
  // 28 ноября 01:30 по Бангкоку — в UTC это ещё 27-е
  startDate: "2026-11-27T18:30:00.000Z",
  endDate: null,
  minAgeMonths: null,
  maxAgeMonths: null,
  locationName: "Парк у моря",
  address: null,
  place: null,
};

describe("eventItemMeta", () => {
  it("день считается по времени города, а не сервера", () => {
    expect(eventItemMeta(EVENT, "ru", "Asia/Bangkok")).toBe("28 нояб. · Парк у моря");
  });

  it("место события важнее текстовой площадки", () => {
    expect(
      eventItemMeta(
        {
          ...EVENT,
          place: { id: "p1", name: "Kids Land", slug: "kids-land", address: "Soi 2" },
        },
        "en",
        "Asia/Bangkok",
      ),
    ).toBe("28 Nov · Kids Land");
  });
});

const ACTIVITY: ActivityListItemDto = {
  id: "a1",
  slug: "art",
  imageUrl: null,
  type: "COURSE",
  name: "Рисование",
  description: null,
  price: null,
  oldPrice: null,
  currency: "THB",
  priceUnit: null,
  minAgeMonths: 36,
  maxAgeMonths: null,
  startDate: null,
  endDate: null,
  place: null,
  venueName: "Студия у рынка",
  venueAddress: null,
  categories: [],
  classes: [],
};

describe("activityItemMeta", () => {
  it("возраст и площадка", () => {
    expect(activityItemMeta(ACTIVITY, "ru")).toBe("от 3 лет · Студия у рынка");
  });

  it("без возраста и площадки подписи нет", () => {
    expect(
      activityItemMeta({ ...ACTIVITY, minAgeMonths: null, venueName: null }, "ru"),
    ).toBeNull();
  });
});

describe("toDistrictItem", () => {
  it("точка карты с подписью", () => {
    const point = {
      id: "p1",
      kind: "place" as const,
      name: "Kids Land",
      href: "/ru/pattaya/places/kids-land",
      latitude: 12.9,
      longitude: 100.87,
      imageUrl: null,
    };
    expect(toDistrictItem(point, "В помещении")).toEqual({
      ...point,
      meta: "В помещении",
    });
  });
});
