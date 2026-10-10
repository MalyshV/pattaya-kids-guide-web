import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content/dictionary";
import { eventTimingNote, formatEventDay } from "@/lib/events/event-date";

const ru = getDictionary("ru");
const TZ = "Asia/Bangkok";

describe("eventTimingNote — пометка события в попапе карты", () => {
  it("будущее — день начала", () => {
    expect(eventTimingNote("upcoming", "2026-09-28T03:00:00.000Z", ru, "ru", TZ)).toBe(
      "Начало 28 сент.",
    );
  });

  it("идёт и прошло — статусом, как на карточке", () => {
    expect(eventTimingNote("ongoing", "2026-09-20T03:00:00.000Z", ru, "ru", TZ)).toBe(
      "Сейчас идёт",
    );
    expect(eventTimingNote("past", "2026-06-15T03:00:00.000Z", ru, "ru", TZ)).toBe(
      "Уже прошло",
    );
  });

  it("без даты — «уточняется»", () => {
    expect(eventTimingNote(undefined, null, ru, "ru", TZ)).toBe("Дата уточняется");
  });
});

describe("formatEventDay — день события по времени города", () => {
  it("раннее утро в Паттайе — тот же день, хотя по UTC ещё вчера", () => {
    // 06:30 28 сентября в Паттайе = 23:30 27 сентября по UTC
    expect(formatEventDay("2026-09-27T23:30:00.000Z", "ru", TZ)).toBe("28 сент.");
  });

  it("поздний вечер в Паттайе — тот же день", () => {
    expect(formatEventDay("2026-09-28T15:30:00.000Z", "ru", TZ)).toBe("28 сент.");
  });

  it("нет даты — null", () => {
    expect(formatEventDay(null, "ru", TZ)).toBeNull();
  });
});
