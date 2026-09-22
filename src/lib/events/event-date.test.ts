import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content/dictionary";
import { eventTimingNote } from "@/lib/events/event-date";

const ru = getDictionary("ru");

describe("eventTimingNote — пометка события в попапе карты", () => {
  it("будущее — день начала", () => {
    expect(eventTimingNote("upcoming", "2026-09-28T03:00:00.000Z", ru, "ru")).toBe(
      "Начало 28 сент.",
    );
  });

  it("идёт и прошло — статусом, как на карточке", () => {
    expect(eventTimingNote("ongoing", "2026-09-20T03:00:00.000Z", ru, "ru")).toBe(
      "Сейчас идёт",
    );
    expect(eventTimingNote("past", "2026-06-15T03:00:00.000Z", ru, "ru")).toBe(
      "Уже прошло",
    );
  });

  it("без даты — «уточняется»", () => {
    expect(eventTimingNote(undefined, null, ru, "ru")).toBe("Дата уточняется");
  });
});
