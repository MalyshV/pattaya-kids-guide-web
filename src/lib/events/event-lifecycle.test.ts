import { describe, expect, it } from "vitest";
import { computeEventStatus, eventSortRank } from "./event-lifecycle";

const NOW = new Date("2026-07-08T12:00:00Z");

function d(iso: string): Date {
  return new Date(iso);
}

describe("computeEventStatus", () => {
  it("ещё не началось → upcoming", () => {
    expect(computeEventStatus(d("2026-07-09T10:00:00Z"), null, NOW)).toBe("upcoming");
  });

  it("началось и конец в будущем → ongoing", () => {
    expect(
      computeEventStatus(d("2026-07-08T10:00:00Z"), d("2026-07-08T15:00:00Z"), NOW),
    ).toBe("ongoing");
  });

  it("конец ровно сейчас — ещё идёт (граница включена)", () => {
    expect(
      computeEventStatus(d("2026-07-08T10:00:00Z"), d("2026-07-08T12:00:00Z"), NOW),
    ).toBe("ongoing");
  });

  it("закончилось → past", () => {
    expect(
      computeEventStatus(d("2026-07-01T10:00:00Z"), d("2026-07-02T15:00:00Z"), NOW),
    ).toBe("past");
  });

  it("точечное событие без endDate в прошлом → past", () => {
    expect(computeEventStatus(d("2026-07-08T10:00:00Z"), null, NOW)).toBe("past");
  });
});

describe("eventSortRank (идущие → будущие → прошедшие)", () => {
  it("ongoing 0, upcoming 1, past 2, неизвестно — в конец", () => {
    expect(eventSortRank("ongoing")).toBe(0);
    expect(eventSortRank("upcoming")).toBe(1);
    expect(eventSortRank("past")).toBe(2);
    expect(eventSortRank(undefined)).toBe(2);
  });
});
