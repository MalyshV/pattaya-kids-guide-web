import { describe, expect, it } from "vitest";
import type { MemoryItem } from "@/lib/memory/parent-memory";
import {
  filterByVisited,
  parseVisitedParam,
  visitedPlaceSlugs,
} from "@/lib/memory/visited-filter";

function memoryItem(overrides: Partial<MemoryItem>): MemoryItem {
  return {
    entity: "place",
    city: "pattaya",
    slug: "gaya",
    kind: "visited",
    name: "Gaya",
    imageUrl: null,
    savedAt: 1,
    ...overrides,
  };
}

describe("parseVisitedParam", () => {
  it("узнаёт оба режима", () => {
    expect(parseVisitedParam("hidden")).toBe("hidden");
    expect(parseVisitedParam("only")).toBe("only");
  });

  it("незнакомое и пустое — «показывать все»", () => {
    expect(parseVisitedParam(undefined)).toBeNull();
    expect(parseVisitedParam("")).toBeNull();
    expect(parseVisitedParam("true")).toBeNull();
    expect(parseVisitedParam("HIDDEN")).toBeNull();
  });
});

describe("visitedPlaceSlugs", () => {
  it("берёт только ✓-отметки мест: сохранённые и другие сущности не в счёт", () => {
    const slugs = visitedPlaceSlugs(
      [
        memoryItem({ slug: "gaya" }),
        memoryItem({ slug: "skippy", kind: "saved" }),
        memoryItem({ slug: "pilates", entity: "event" }),
      ],
      "pattaya",
    );
    expect(slugs).toEqual(new Set(["gaya"]));
  });

  it("только отметки текущего города: такой же slug в другом городе не в счёт", () => {
    const items = [
      memoryItem({ slug: "play-barn", city: "pattaya" }),
      memoryItem({ slug: "kids-club", city: "phuket" }),
    ];
    expect(visitedPlaceSlugs(items, "pattaya")).toEqual(new Set(["play-barn"]));
    expect(visitedPlaceSlugs(items, "phuket")).toEqual(new Set(["kids-club"]));
  });
});

describe("filterByVisited", () => {
  const places = [{ slug: "gaya" }, { slug: "skippy" }, { slug: "tara" }];
  const visited = new Set(["gaya", "tara"]);

  it("hidden: убирает посещённые", () => {
    expect(filterByVisited(places, "hidden", (p) => p.slug, visited)).toEqual([
      { slug: "skippy" },
    ]);
  });

  it("only: оставляет только посещённые (в исходном порядке)", () => {
    expect(filterByVisited(places, "only", (p) => p.slug, visited)).toEqual([
      { slug: "gaya" },
      { slug: "tara" },
    ]);
  });

  it("без отметок: hidden отдаёт всё, only — ничего", () => {
    const none = new Set<string>();
    expect(filterByVisited(places, "hidden", (p) => p.slug, none)).toHaveLength(3);
    expect(filterByVisited(places, "only", (p) => p.slug, none)).toHaveLength(0);
  });
});
