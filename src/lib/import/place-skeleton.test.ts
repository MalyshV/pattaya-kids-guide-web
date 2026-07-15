import { describe, expect, it } from "vitest";
import {
  mapGooglePlaceToSkeleton,
  openingHoursToSchedules,
  parseGoogleMapsUrl,
  slugifyPlaceName,
} from "./place-skeleton";
import type { GooglePlace } from "./google-places-types";

// Реальный ответ Place Details (New) в сокращении — структура с документации.
const FULL_PLACE: GooglePlace = {
  id: "ChIJN1t_tDeuEmsRUsoyG83frY4",
  displayName: { text: "Gaya Wellness  Studio", languageCode: "en" },
  formattedAddress: "512/10 Moo 9, Pattaya City, Bang Lamung District, Chon Buri 20150",
  location: { latitude: 12.9328173, longitude: 100.8973319 },
  regularOpeningHours: {
    periods: [
      { open: { day: 1, hour: 8, minute: 0 }, close: { day: 1, hour: 21, minute: 0 } },
      { open: { day: 6, hour: 9, minute: 30 }, close: { day: 6, hour: 13, minute: 0 } },
      { open: { day: 0, hour: 9, minute: 30 }, close: { day: 0, hour: 13, minute: 0 } },
    ],
  },
  nationalPhoneNumber: "087 834 4455",
  internationalPhoneNumber: "+66 87 834 4455",
  websiteUri: "https://example.com",
  googleMapsUri: "https://maps.google.com/?cid=123",
  types: ["gym", "health"],
};

describe("openingHoursToSchedules", () => {
  it("обычные периоды → дни нашего enum, время с паддингом, порядок стабильный", () => {
    const schedules = openingHoursToSchedules(FULL_PLACE.regularOpeningHours?.periods);
    expect(schedules).toEqual([
      { day: "SUN", openTime: "09:30", closeTime: "13:00", isClosed: false },
      { day: "MON", openTime: "08:00", closeTime: "21:00", isClosed: false },
      { day: "SAT", openTime: "09:30", closeTime: "13:00", isClosed: false },
    ]);
  });

  it("два интервала в один день (обед) — оба сохраняются", () => {
    const schedules = openingHoursToSchedules([
      { open: { day: 2, hour: 9, minute: 0 }, close: { day: 2, hour: 12, minute: 0 } },
      { open: { day: 2, hour: 13, minute: 0 }, close: { day: 2, hour: 18, minute: 0 } },
    ]);
    expect(schedules).toEqual([
      { day: "TUE", openTime: "09:00", closeTime: "12:00", isClosed: false },
      { day: "TUE", openTime: "13:00", closeTime: "18:00", isClosed: false },
    ]);
  });

  it("круглосуточно (один период без close) → все 7 дней 00:00–23:59", () => {
    const schedules = openingHoursToSchedules([{ open: { day: 0, hour: 0, minute: 0 } }]);
    expect(schedules).toHaveLength(7);
    expect(new Set(schedules.map((s) => s.day)).size).toBe(7);
    for (const s of schedules) {
      expect(s.openTime).toBe("00:00");
      expect(s.closeTime).toBe("23:59");
    }
  });

  it("дубль (день, открытие) схлопывается — защита unique-индекса расписания", () => {
    const schedules = openingHoursToSchedules([
      { open: { day: 3, hour: 10, minute: 0 }, close: { day: 3, hour: 20, minute: 0 } },
      { open: { day: 3, hour: 10, minute: 0 }, close: { day: 3, hour: 21, minute: 0 } },
    ]);
    expect(schedules).toHaveLength(1);
  });

  it("интервал через полночь приписывается дню открытия (закрытие как есть)", () => {
    const schedules = openingHoursToSchedules([
      { open: { day: 5, hour: 22, minute: 0 }, close: { day: 6, hour: 1, minute: 0 } },
    ]);
    expect(schedules).toEqual([
      { day: "FRI", openTime: "22:00", closeTime: "01:00", isClosed: false },
    ]);
  });

  it("битые данные не роняют: open без close (не 24/7), неизвестный день", () => {
    const schedules = openingHoursToSchedules([
      { open: { day: 1, hour: 9, minute: 0 } },
      { open: { day: 9, hour: 9, minute: 0 }, close: { day: 9, hour: 18, minute: 0 } },
      { open: { day: 2, hour: 9, minute: 0 }, close: { day: 2, hour: 18, minute: 0 } },
    ]);
    expect(schedules).toEqual([
      { day: "TUE", openTime: "09:00", closeTime: "18:00", isClosed: false },
    ]);
  });

  it("пусто/undefined → []", () => {
    expect(openingHoursToSchedules(undefined)).toEqual([]);
    expect(openingHoursToSchedules([])).toEqual([]);
  });
});

describe("slugifyPlaceName", () => {
  it("диакритика сворачивается, апострофы удаляются", () => {
    expect(slugifyPlaceName("LariDea Kids' Café")).toBe("laridea-kids-cafe");
  });

  it("скобки и лишние пробелы → дефисы без хвостов", () => {
    expect(slugifyPlaceName("Gaya Wellness studio ( Branch 2 - Pattaya Klang)")).toBe(
      "gaya-wellness-studio-branch-2-pattaya-klang",
    );
  });

  it("типографский апостроф тоже удаляется", () => {
    expect(slugifyPlaceName("Lotus’s North")).toBe("lotuss-north");
  });

  it("не-латиница выпадает; пустой результат → fallback place", () => {
    expect(slugifyPlaceName("สวนสนุก")).toBe("place");
  });
});

describe("parseGoogleMapsUrl", () => {
  it("реальная ссылка Вероники (Gaya) → запрос + координаты", () => {
    const parsed = parseGoogleMapsUrl(
      "https://www.google.com/maps/place/Gaya+Wellness+studio+(+Branch+2+-+Pattaya+Klang)/@12.9328225,100.894757,1057m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31029500019e164b:0xaadbe130a9c424c0!8m2!3d12.9328173!4d100.8973319!16s%2Fg%2F11w8sf4vc5?entry=ttu",
    );
    expect(parsed).toEqual({
      query: "Gaya Wellness studio ( Branch 2 - Pattaya Klang)",
      latitude: 12.9328225,
      longitude: 100.894757,
    });
  });

  it("реальная ссылка Вероники (Lotus, с поисковым мусором в data) — имя чистое", () => {
    const parsed = parseGoogleMapsUrl(
      "https://www.google.com/maps/place/Lotus's+North+Pattaya/@12.9508423,100.8918368,528m/data=!3m1!1e3!4m9!1m2!2m1!1ssoft+play!3m5!1s0x3102bfb3a6501d63:0x4dad9ccd9cbf816f!8m2!3d12.9508423!4d100.8933732!16s%2Fg%2F11hd_yk9xg?entry=ttu",
    );
    expect(parsed?.query).toBe("Lotus's North Pattaya");
    expect(parsed?.latitude).toBe(12.9508423);
    expect(parsed?.longitude).toBe(100.8918368);
  });

  it("ссылка без сегмента @координат — запрос без координат", () => {
    const parsed = parseGoogleMapsUrl("https://www.google.com/maps/place/Some+Cafe/");
    expect(parsed).toEqual({ query: "Some Cafe", latitude: null, longitude: null });
  });

  it("не карточка Maps / не Google / мусор → null", () => {
    expect(parseGoogleMapsUrl("https://www.google.com/maps/@12.9,100.8,15z")).toBeNull();
    expect(parseGoogleMapsUrl("https://evil.com/maps/place/Fake")).toBeNull();
    expect(parseGoogleMapsUrl("не ссылка вовсе")).toBeNull();
  });
});

describe("mapGooglePlaceToSkeleton", () => {
  it("полный ответ → скелет с расписанием и контактами (нац. телефон в приоритете)", () => {
    const skeleton = mapGooglePlaceToSkeleton(FULL_PLACE);
    expect(skeleton).not.toBeNull();
    expect(skeleton?.googlePlaceId).toBe("ChIJN1t_tDeuEmsRUsoyG83frY4");
    // двойной пробел в displayName схлопнут
    expect(skeleton?.name).toBe("Gaya Wellness Studio");
    expect(skeleton?.latitude).toBe(12.9328173);
    expect(skeleton?.schedules).toHaveLength(3);
    expect(skeleton?.contacts).toEqual([
      { type: "phone", value: "087 834 4455" },
      { type: "website", value: "https://example.com" },
    ]);
    expect(skeleton?.googleTypes).toEqual(["gym", "health"]);
  });

  it("минимальный ответ (id + имя) → скелет с честными null", () => {
    const skeleton = mapGooglePlaceToSkeleton({
      id: "ChIJtest",
      displayName: { text: "Bare Place" },
    });
    expect(skeleton).toEqual({
      googlePlaceId: "ChIJtest",
      name: "Bare Place",
      address: null,
      latitude: null,
      longitude: null,
      googleMapsUrl: null,
      schedules: [],
      contacts: [],
      googleTypes: [],
    });
  });

  it("без id или без имени → null (нечем дедупить/нечего показывать)", () => {
    expect(mapGooglePlaceToSkeleton({ displayName: { text: "No Id" } })).toBeNull();
    expect(mapGooglePlaceToSkeleton({ id: "ChIJx" })).toBeNull();
    expect(mapGooglePlaceToSkeleton({ id: "  ", displayName: { text: "X" } })).toBeNull();
  });
});
