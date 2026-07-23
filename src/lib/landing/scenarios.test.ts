import { describe, expect, it } from "vitest";
import {
  dropLateNightMorning,
  eligibleScenarios,
  isShelterPlace,
  isWorkFriendlyPlace,
  isWeekendDay,
  landingSlot,
  MIN_SCENARIO_PLACES,
  scenarioPriority,
  visibleScenarios,
  yearsToAgeBucket,
  type ScenarioKey,
} from "@/lib/landing/scenarios";

describe("landingSlot", () => {
  it("относит часы к слотам: утро с 5:00, день с 12:00, вечер с 17:00, ночь с 23:00", () => {
    expect(landingSlot(5 * 60)).toBe("morning");
    expect(landingSlot(11 * 60 + 59)).toBe("morning");
    expect(landingSlot(12 * 60)).toBe("day");
    expect(landingSlot(16 * 60 + 59)).toBe("day");
    expect(landingSlot(17 * 60)).toBe("evening");
    expect(landingSlot(22 * 60 + 59)).toBe("evening");
    expect(landingSlot(23 * 60)).toBe("night");
    expect(landingSlot(0)).toBe("night");
    expect(landingSlot(4 * 60 + 59)).toBe("night");
  });
});

describe("isWeekendDay", () => {
  it("суббота и воскресенье — выходные, остальные — нет", () => {
    expect(isWeekendDay("SAT")).toBe(true);
    expect(isWeekendDay("SUN")).toBe(true);
    expect(isWeekendDay("MON")).toBe(false);
    expect(isWeekendDay("FRI")).toBe(false);
  });
});

describe("scenarioPriority", () => {
  it("каждый слот содержит все сценарии без повторов", () => {
    const slots = ["morning", "day", "evening", "night"] as const;
    for (const slot of slots) {
      for (const isWeekend of [false, true]) {
        const priority = scenarioPriority(slot, isWeekend);
        expect(new Set(priority).size).toBe(priority.length);
        expect(priority).toHaveLength(8);
      }
    }
  });

  it("будни-утро начинается с развивашек и «поработать», выходные — нет", () => {
    expect(scenarioPriority("morning", false).slice(0, 3)).toEqual([
      "age",
      "workFriendly",
      "openMorning",
    ]);
    expect(scenarioPriority("morning", true)).not.toContain(undefined);
    expect(scenarioPriority("morning", true).slice(0, 3)).not.toContain("workFriendly");
  });

  it("ночью «пойти сейчас» не в первой тройке — сверху планирование утра", () => {
    const night = scenarioPriority("night", false);
    expect(night.slice(0, 3)).not.toContain("openNow");
    expect(night[0]).toBe("openMorning");
  });
});

describe("eligibleScenarios", () => {
  const priority: ScenarioKey[] = ["openNow", "shelter", "age", "events"];

  it("режет сценарии мест ниже порога, разделы без счётчика не трогает", () => {
    const pool = eligibleScenarios(priority, {
      openNow: MIN_SCENARIO_PLACES - 1,
      shelter: MIN_SCENARIO_PLACES,
    });
    expect(pool).toEqual(["shelter", "age", "events"]);
  });

  it("без счётчиков пул не меняется", () => {
    expect(eligibleScenarios(priority, {})).toEqual(priority);
  });

  it("разделы режутся порогом 1: пустая афиша выбывает, одна запись — остаётся", () => {
    expect(eligibleScenarios(priority, {}, { events: 0 })).toEqual([
      "openNow",
      "shelter",
      "age",
    ]);
    expect(eligibleScenarios(priority, {}, { events: 1 })).toEqual(priority);
  });
});

describe("dropLateNightMorning", () => {
  const pool: ScenarioKey[] = ["openMorning", "age", "events"];

  it("в 23:00–23:59 «открыто с утра» выпадает: «сегодня» — ещё уходящий день", () => {
    expect(dropLateNightMorning(pool, "night", 23 * 60 + 30)).toEqual(["age", "events"]);
  });

  it("после полуночи и в остальных слотах пул не меняется", () => {
    expect(dropLateNightMorning(pool, "night", 30)).toEqual(pool);
    expect(dropLateNightMorning(pool, "morning", 23 * 60 + 30)).toEqual(pool);
  });
});

describe("visibleScenarios", () => {
  const pool: ScenarioKey[] = [
    "age",
    "workFriendly",
    "openMorning",
    "openNow",
    "shelter",
    "events",
    "birthdays",
    "near",
  ];

  it("offset=0 — первые три", () => {
    expect(visibleScenarios(pool, 0)).toEqual(["age", "workFriendly", "openMorning"]);
  });

  it("каждое «показать другие» сдвигает тройку, конец пула заворачивается", () => {
    expect(visibleScenarios(pool, 1)).toEqual(["openNow", "shelter", "events"]);
    expect(visibleScenarios(pool, 2)).toEqual(["birthdays", "near", "age"]);
    // полный круг: offset 8 * 3 % 8 = 0 — снова первые три
    expect(visibleScenarios(pool, 8)).toEqual(visibleScenarios(pool, 0));
  });

  it("пул из трёх и меньше отдаётся как есть, без повторов", () => {
    const short: ScenarioKey[] = ["age", "events"];
    expect(visibleScenarios(short, 0)).toEqual(short);
    expect(visibleScenarios(short, 5)).toEqual(short);
  });
});

describe("зеркала композитов places-where", () => {
  const base = {
    hasWifi: null,
    hasAirCon: null,
    hasCafeSeating: null,
    indoor: null,
    hasCoveredArea: null,
    hasFans: null,
  };

  it("workFriendly: wifi И кондиционер И кафе; null не проходит как true", () => {
    expect(
      isWorkFriendlyPlace({
        ...base,
        hasWifi: true,
        hasAirCon: true,
        hasCafeSeating: true,
      }),
    ).toBe(true);
    expect(isWorkFriendlyPlace({ ...base, hasWifi: true, hasAirCon: true })).toBe(false);
  });

  it("shelter: (в помещении ИЛИ навес) И (кондиционер ИЛИ вентиляторы)", () => {
    expect(isShelterPlace({ ...base, indoor: true, hasFans: true })).toBe(true);
    expect(isShelterPlace({ ...base, hasCoveredArea: true, hasAirCon: true })).toBe(true);
    expect(isShelterPlace({ ...base, indoor: true })).toBe(false);
    expect(isShelterPlace({ ...base, hasAirCon: true })).toBe(false);
  });
});

describe("yearsToAgeBucket", () => {
  it("годы крутилки ложатся в корзины каталога", () => {
    expect(yearsToAgeBucket(0)).toBe("0-1");
    expect(yearsToAgeBucket(1)).toBe("1-3");
    expect(yearsToAgeBucket(2)).toBe("1-3");
    expect(yearsToAgeBucket(3)).toBe("3-6");
    expect(yearsToAgeBucket(5)).toBe("3-6");
    expect(yearsToAgeBucket(6)).toBe("6-12");
    expect(yearsToAgeBucket(12)).toBe("6-12");
  });
});
