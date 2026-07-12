import { describe, expect, it } from "vitest";
import { activitySortRank, isActivityActive } from "./activity-sort";

const NOW = new Date("2026-07-08T12:00:00Z");

function d(iso: string): Date {
  return new Date(iso);
}

// Продуктовый смысл: прошедшие лагеря уходят вниз ленты, всё остальное —
// активно. Логика завязана на computeEventStatus, регресс тихий. Сиблинг
// activity-filter покрыт тестом, activity-sort был нет.
describe("isActivityActive", () => {
  it("регулярное занятие (COURSE) активно всегда — даже с прошедшими датами", () => {
    expect(
      isActivityActive({ type: "COURSE", startDate: null, endDate: null }, NOW),
    ).toBe(true);
    expect(
      isActivityActive(
        {
          type: "COURSE",
          startDate: d("2026-01-01T00:00:00Z"),
          endDate: d("2026-02-01T00:00:00Z"),
        },
        NOW,
      ),
    ).toBe(true);
  });

  it("лагерь (CAMP) без даты начала — активен", () => {
    expect(isActivityActive({ type: "CAMP", startDate: null, endDate: null }, NOW)).toBe(
      true,
    );
  });

  it("идущий и будущий лагерь — активны", () => {
    // идёт: начался вчера, кончится завтра
    expect(
      isActivityActive(
        {
          type: "CAMP",
          startDate: d("2026-07-07T00:00:00Z"),
          endDate: d("2026-07-09T00:00:00Z"),
        },
        NOW,
      ),
    ).toBe(true);
    // будущий: начнётся завтра
    expect(
      isActivityActive(
        { type: "CAMP", startDate: d("2026-07-09T00:00:00Z"), endDate: null },
        NOW,
      ),
    ).toBe(true);
  });

  it("прошедший лагерь — неактивен (в т.ч. разовый с endDate=null)", () => {
    expect(
      isActivityActive(
        {
          type: "CAMP",
          startDate: d("2026-07-01T00:00:00Z"),
          endDate: d("2026-07-05T00:00:00Z"),
        },
        NOW,
      ),
    ).toBe(false);
    expect(
      isActivityActive(
        { type: "CAMP", startDate: d("2026-07-07T00:00:00Z"), endDate: null },
        NOW,
      ),
    ).toBe(false);
  });
});

describe("activitySortRank (активные выше прошедших лагерей)", () => {
  it("активное → 0, прошедший лагерь → 1", () => {
    expect(
      activitySortRank({ type: "COURSE", startDate: null, endDate: null }, NOW),
    ).toBe(0);
    expect(
      activitySortRank(
        {
          type: "CAMP",
          startDate: d("2026-07-01T00:00:00Z"),
          endDate: d("2026-07-05T00:00:00Z"),
        },
        NOW,
      ),
    ).toBe(1);
  });
});
