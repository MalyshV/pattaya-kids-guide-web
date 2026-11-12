import { describe, expect, it } from "vitest";
import { eventCardLocation, eventVenue, type EventVenueSource } from "./event-venue";

const GAYA = { name: "Gaya Wellness Studio", address: "Pattaya Klang" };
const TBD = "Место уточняется";

function event(overrides: Partial<EventVenueSource>): EventVenueSource {
  return { locationName: null, address: null, place: null, ...overrides };
}

describe("eventVenue", () => {
  it("только место из каталога — берём его имя и адрес", () => {
    expect(eventVenue(event({ place: GAYA }))).toEqual({
      name: "Gaya Wellness Studio",
      address: "Pattaya Klang",
    });
  });

  it("своё поле события главнее места", () => {
    expect(
      eventVenue(event({ locationName: "Зал 2", address: "Soi 5", place: GAYA })),
    ).toEqual({ name: "Зал 2", address: "Soi 5" });
  });

  it("недостающее добирается из места по отдельности", () => {
    expect(eventVenue(event({ locationName: "Зал 2", place: GAYA }))).toEqual({
      name: "Зал 2",
      address: "Pattaya Klang",
    });
  });

  it("ни поля, ни места — null, подпись решает страница", () => {
    expect(eventVenue(event({}))).toEqual({ name: null, address: null });
  });
});

describe("eventCardLocation", () => {
  it("место есть, своего поля нет — строку не рисуем (а не «уточняется»)", () => {
    expect(eventCardLocation(event({ place: GAYA }), TBD)).toBeNull();
  });

  it("своё поле повторяет имя места — строку не дублируем", () => {
    expect(
      eventCardLocation(
        event({ locationName: "Gaya Wellness Studio", place: GAYA }),
        TBD,
      ),
    ).toBeNull();
  });

  it("своё поле уточняет место — показываем", () => {
    expect(eventCardLocation(event({ locationName: "Зал 2", place: GAYA }), TBD)).toBe(
      "Зал 2",
    );
  });

  it("без места — своё поле, затем адрес", () => {
    expect(eventCardLocation(event({ locationName: "Парк" }), TBD)).toBe("Парк");
    expect(eventCardLocation(event({ address: "Soi 5" }), TBD)).toBe("Soi 5");
  });

  it("ни поля, ни места — честное «уточняется»", () => {
    expect(eventCardLocation(event({}), TBD)).toBe(TBD);
  });
});
