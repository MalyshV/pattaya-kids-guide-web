import { describe, expect, it } from "vitest";
import {
  countInDays,
  entriesOfDay,
  hasEntry,
  MAX_PLAN_ENTRIES,
  parseStoredPlan,
  removeEntry,
  serializePlan,
  toggleEntry,
  type PlanEntry,
} from "./plan";

function entry(overrides: Partial<PlanEntry> = {}): PlanEntry {
  return {
    entity: "activity",
    city: "pattaya",
    slug: "little-gym-gymnastics",
    day: "2026-11-11",
    name: "Гимнастика",
    hint: "The Little Gym",
    addedAt: 1000,
    ...overrides,
  };
}

describe("toggleEntry", () => {
  it("ставит на день, повторное нажатие на тот же день — снимает", () => {
    const added = toggleEntry([], entry());
    expect(added).toHaveLength(1);
    expect(hasEntry(added, entry())).toBe(true);
    expect(toggleEntry(added, entry({ addedAt: 2000 }))).toEqual([]);
  });

  it("одно и то же можно поставить на разные дни", () => {
    const plan = toggleEntry(toggleEntry([], entry()), entry({ day: "2026-11-13" }));
    expect(plan.map((item) => item.day)).toEqual(["2026-11-11", "2026-11-13"]);
  });

  it("одинаковый slug в другом городе или у другого типа — другая запись", () => {
    const plan = [entry()];
    expect(hasEntry(plan, entry({ city: "phuket" }))).toBe(false);
    expect(hasEntry(plan, entry({ entity: "place" }))).toBe(false);
  });

  it("при переполнении вытесняются самые старые", () => {
    const full = Array.from({ length: MAX_PLAN_ENTRIES }, (_, index) =>
      entry({ slug: `item-${index}`, addedAt: index }),
    );
    const next = toggleEntry(full, entry({ slug: "fresh", addedAt: 99999 }));
    expect(next).toHaveLength(MAX_PLAN_ENTRIES);
    expect(next.some((item) => item.slug === "item-0")).toBe(false);
    expect(next.at(-1)?.slug).toBe("fresh");
  });
});

describe("removeEntry", () => {
  it("убирает только указанный день", () => {
    const plan = [entry(), entry({ day: "2026-11-13" })];
    expect(removeEntry(plan, entry()).map((item) => item.day)).toEqual(["2026-11-13"]);
  });
});

describe("entriesOfDay и countInDays", () => {
  const plan = [
    entry({ slug: "b", addedAt: 2 }),
    entry({ slug: "a", addedAt: 1 }),
    entry({ slug: "c", day: "2026-11-14", addedAt: 3 }),
  ];

  it("записи дня — в порядке добавления", () => {
    expect(entriesOfDay(plan, "2026-11-11").map((item) => item.slug)).toEqual(["a", "b"]);
    expect(entriesOfDay(plan, "2026-11-12")).toEqual([]);
  });

  it("счётчик недели считает только её дни", () => {
    expect(countInDays(plan, ["2026-11-11", "2026-11-12"])).toBe(2);
    expect(countInDays(plan, ["2026-11-20"])).toBe(0);
  });
});

describe("parseStoredPlan", () => {
  it("читает то, что записал serializePlan", () => {
    const plan = [entry(), entry({ day: "2026-11-13", hint: null })];
    expect(parseStoredPlan(serializePlan(plan))).toEqual(plan);
  });

  it("битый JSON, не массив, пусто — пустой план, а не падение", () => {
    expect(parseStoredPlan(null)).toEqual([]);
    expect(parseStoredPlan("{oops")).toEqual([]);
    expect(parseStoredPlan('{"a":1}')).toEqual([]);
  });

  it("чужие и испорченные записи отбрасывает, дубли схлопывает, лишние поля не тащит", () => {
    const raw = JSON.stringify([
      entry(),
      entry(), // дубль
      { ...entry({ slug: "x" }), day: "2026-02-31" }, // такого дня нет
      { ...entry({ slug: "y" }), entity: "hotel" },
      { ...entry({ slug: "z" }), extra: "лишнее" },
      "мусор",
    ]);
    const parsed = parseStoredPlan(raw);
    expect(parsed.map((item) => item.slug)).toEqual(["little-gym-gymnastics", "z"]);
    expect(parsed[1]).not.toHaveProperty("extra");
  });
});
