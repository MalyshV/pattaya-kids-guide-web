import { describe, expect, it } from "vitest";
import {
  CARD_TARGET,
  activityPrefill,
  cardHref,
  clipToField,
  eventPrefill,
  placePrefill,
} from "@/lib/admin/submission-card";
import { ADMIN_FIELDS } from "@/lib/admin/field-limits";

const BASE = {
  name: "Pa Boon Cafe 4",
  tip: "Детская площадка, динозавры, утки",
  location: "https://maps.app.goo.gl/XJAQmWuaSmUsvc7P9?g_st=ic",
  mapsUrl: "https://www.google.com/maps/place/Pa+Boon/@12.9,100.9,17z",
  latitude: 12.9123456,
  longitude: 100.8912345,
};

describe("cardHref — куда ведёт «Создать карточку»", () => {
  it("место, ДР, событие и занятие — форма с подстановкой из предложения", () => {
    expect(cardHref("PLACE", "abc")).toBe("/admin/places/new?from=abc");
    expect(cardHref("BIRTHDAY", "abc")).toBe("/admin/places/new?from=abc");
    expect(cardHref("EVENT", "abc")).toBe("/admin/events/new?from=abc");
    expect(cardHref("ACTIVITY", "abc")).toBe("/admin/activities/new?from=abc");
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

const NOW = new Date("2026-10-02T05:00:00Z");

describe("eventPrefill — чем заполняется форма события", () => {
  const base = {
    name: "Детский мастер-класс",
    tip: "Лепка из глины для детей 4-8 лет",
    location: "Art Space, Jomtien",
    whenText: "18 октября, 15:00-16:00",
  };

  it("название, описание, площадка; дата и возраст — из разбора афиши", () => {
    const prefill = eventPrefill(base, NOW);
    expect(prefill.title).toBe("Детский мастер-класс");
    expect(prefill.description).toBe(base.tip);
    expect(prefill.locationName).toBe("Art Space, Jomtien");
    expect(prefill.startDate?.toISOString()).toBe("2026-10-18T08:00:00.000Z");
    expect(prefill.endDate?.toISOString()).toBe("2026-10-18T09:00:00.000Z");
    expect(prefill.minAgeMonths).toBe(48);
    expect(prefill.maxAgeMonths).toBe(96);
    expect(prefill.whenText).toBe(base.whenText);
  });

  it("дату достать не удалось — поля пустые, исходный текст сохранён", () => {
    const prefill = eventPrefill({ ...base, tip: null, whenText: "по выходным" }, NOW);
    expect(prefill.startDate).toBeNull();
    expect(prefill.endDate).toBeNull();
    expect(prefill.whenText).toBe("по выходным");
    expect(prefill.minAgeMonths).toBeNull();
    expect(prefill.description).toBe("");
  });

  it("без «когда» не падает", () => {
    const prefill = eventPrefill({ ...base, whenText: null }, NOW);
    expect(prefill.startDate).toBeNull();
    expect(prefill.whenText).toBe("");
  });

  it("ссылка в «где» — не площадка", () => {
    const prefill = eventPrefill(
      { ...base, location: "https://maps.app.goo.gl/XJAQmWuaSmUsvc7P9" },
      NOW,
    );
    expect(prefill.locationName).toBe("");
  });

  it("длинный текст обрезается до предела поля", () => {
    const prefill = eventPrefill(
      {
        ...base,
        name: "а".repeat(500),
        tip: "б".repeat(9000),
        location: "в".repeat(400),
      },
      NOW,
    );
    expect(prefill.title).toHaveLength(ADMIN_FIELDS.title.max);
    expect(prefill.description).toHaveLength(ADMIN_FIELDS.description.max);
    expect(prefill.locationName).toHaveLength(ADMIN_FIELDS.locationName.max);
  });
});

describe("activityPrefill — чем заполняется форма занятия", () => {
  it("название, описание и площадка текстом", () => {
    expect(
      activityPrefill({
        name: "Робототехника",
        tip: "Занятия по субботам",
        location: "Дом творчества, Наклуа",
      }),
    ).toEqual({
      name: "Робототехника",
      description: "Занятия по субботам",
      venueName: "Дом творчества, Наклуа",
    });
  });

  it("ссылка в «где» — площадка пустая; нет подсказки — описание пустое", () => {
    expect(
      activityPrefill({
        name: "Йога",
        tip: null,
        location: "https://instagram.com/yoga",
      }),
    ).toEqual({ name: "Йога", description: "", venueName: "" });
  });

  it("длинные названия обрезаются до предела поля", () => {
    const prefill = activityPrefill({
      name: "а".repeat(300),
      tip: null,
      location: "б".repeat(300),
    });
    expect(prefill.name).toHaveLength(ADMIN_FIELDS.name.max);
    expect(prefill.venueName).toHaveLength(ADMIN_FIELDS.venueName.max);
  });
});

describe("clipToField", () => {
  it("короткий текст не трогает, пробелы по краям убирает", () => {
    expect(clipToField("  привет ", "title")).toBe("привет");
  });

  it("не рвёт эмодзи на границе", () => {
    const text = "а".repeat(ADMIN_FIELDS.title.max - 1) + "😀";
    const clipped = clipToField(text, "title");
    expect(clipped).toBe("а".repeat(ADMIN_FIELDS.title.max - 1));
  });
});
