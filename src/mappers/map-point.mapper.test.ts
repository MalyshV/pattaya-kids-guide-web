import { describe, expect, it } from "vitest";
import type { ActivityWithPlace } from "@/services/activities.service";
import type { EventWithPlace } from "@/services/events.service";
import { activityToMapPoint, eventToMapPoint } from "@/mappers/map-point.mapper";

const BASE = "/ru/pattaya";

function event(over: Record<string, unknown>): EventWithPlace {
  return {
    id: "e1",
    slug: "fest",
    title: "Фест",
    titleEn: "Fest",
    titleTh: null,
    imageUrl: null,
    latitude: null,
    longitude: null,
    place: null,
    ...over,
  } as unknown as EventWithPlace;
}

function activity(over: Record<string, unknown>): ActivityWithPlace {
  return {
    id: "a1",
    slug: "camp",
    name: "Лагерь",
    nameEn: null,
    nameTh: null,
    imageUrl: null,
    venueLatitude: null,
    venueLongitude: null,
    place: null,
    ...over,
  } as unknown as ActivityWithPlace;
}

describe("eventToMapPoint", () => {
  it("свои координаты события важнее координат места", () => {
    const point = eventToMapPoint(
      event({ latitude: 1, longitude: 2, place: { latitude: 9, longitude: 9 } }),
      BASE,
      "ru",
    );
    expect(point).toMatchObject({ kind: "event", latitude: 1, longitude: 2 });
    expect(point?.href).toBe("/ru/pattaya/events/fest");
  });

  it("нет своих координат — берём у места", () => {
    const point = eventToMapPoint(
      event({ place: { latitude: 9, longitude: 8 } }),
      BASE,
      "ru",
    );
    expect(point).toMatchObject({ latitude: 9, longitude: 8 });
  });

  it("координата 0 — это координата, а не «нет»", () => {
    const point = eventToMapPoint(event({ latitude: 0, longitude: 0 }), BASE, "ru");
    expect(point).not.toBeNull();
  });

  it("нигде нет координат — null; название по языку", () => {
    expect(eventToMapPoint(event({}), BASE, "ru")).toBeNull();
    const point = eventToMapPoint(event({ latitude: 1, longitude: 2 }), BASE, "th");
    expect(point?.name).toBe("Fest");
  });
});

describe("activityToMapPoint", () => {
  it("координаты места важнее координат площадки", () => {
    const point = activityToMapPoint(
      activity({
        place: { latitude: 5, longitude: 6 },
        venueLatitude: 1,
        venueLongitude: 2,
      }),
      BASE,
      "ru",
    );
    expect(point).toMatchObject({ kind: "activity", latitude: 5, longitude: 6 });
    expect(point?.href).toBe("/ru/pattaya/activities/camp");
  });

  it("без места — координаты площадки", () => {
    const point = activityToMapPoint(
      activity({ venueLatitude: 1, venueLongitude: 2 }),
      BASE,
      "ru",
    );
    expect(point).toMatchObject({ latitude: 1, longitude: 2 });
  });

  it("абонемент без slug и занятие без координат на карту не попадают", () => {
    expect(activityToMapPoint(activity({ slug: null }), BASE, "ru")).toBeNull();
    expect(activityToMapPoint(activity({}), BASE, "ru")).toBeNull();
  });
});
