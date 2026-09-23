import { describe, expect, it } from "vitest";
import { CARD_TARGET, cardHref, placePrefill } from "@/lib/admin/submission-card";

const BASE = {
  name: "Pa Boon Cafe 4",
  tip: "Детская площадка, динозавры, утки",
  location: "https://maps.app.goo.gl/XJAQmWuaSmUsvc7P9?g_st=ic",
  mapsUrl: "https://www.google.com/maps/place/Pa+Boon/@12.9,100.9,17z",
  latitude: 12.9123456,
  longitude: 100.8912345,
};

describe("cardHref — куда ведёт «Создать карточку»", () => {
  it("место и ДР — форма места с подстановкой, событие и занятие — просто форма", () => {
    expect(cardHref("PLACE", "abc")).toBe("/admin/places/new?from=abc");
    expect(cardHref("BIRTHDAY", "abc")).toBe("/admin/places/new?from=abc");
    expect(cardHref("EVENT", "abc")).toBe("/admin/events/new");
    expect(cardHref("ACTIVITY", "abc")).toBe("/admin/activities/new");
    expect(CARD_TARGET.PLACE.label).toContain("карточку");
  });

  it("id в адресе экранируется", () => {
    expect(cardHref("PLACE", "a b&c")).toBe("/admin/places/new?from=a%20b%26c");
  });
});

describe("placePrefill — чем заполняется форма места", () => {
  it("ссылка Карт идёт в своё поле, а не в адрес", () => {
    expect(placePrefill(BASE)).toEqual({
      name: "Pa Boon Cafe 4",
      description: "Детская площадка, динозавры, утки",
      address: "",
      latitude: "12.9123456",
      longitude: "100.8912345",
      googleMapsUrl: BASE.mapsUrl,
    });
  });

  it("обычный адрес остаётся адресом; без координат поля пустые", () => {
    expect(
      placePrefill({
        ...BASE,
        location: "111 M.13 Soi Pattanakarn 9/1",
        mapsUrl: null,
        latitude: null,
        longitude: null,
      }),
    ).toMatchObject({
      address: "111 M.13 Soi Pattanakarn 9/1",
      latitude: "",
      longitude: "",
      googleMapsUrl: "",
    });
  });

  it("короткая ссылка без раскрытия — тоже в поле ссылки", () => {
    const result = placePrefill({ ...BASE, mapsUrl: null });
    expect(result.address).toBe("");
    expect(result.googleMapsUrl).toBe(BASE.location);
  });

  it("мусор вместо ссылки в поле ссылки не попадает", () => {
    const result = placePrefill({
      ...BASE,
      location: "javascript:alert(1)",
      mapsUrl: null,
    });
    expect(result.googleMapsUrl).toBe("");
  });
});
