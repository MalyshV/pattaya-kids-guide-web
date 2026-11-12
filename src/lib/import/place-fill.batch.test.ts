import { describe, expect, it } from "vitest";
import { HARVEST_2026_10_PLACES } from "../../../prisma/places/harvest-2026-10";
import { HARVEST_2026_10_PLACES_B } from "../../../prisma/places/harvest-2026-10-b";
import { TOP20_2026_11 } from "../../../prisma/places/top20-2026-11";
import { validatePlaceFill } from "./place-fill";

/// категории мест, которые есть в справочнике (prisma/seed.ts)
const KNOWN_CATEGORIES = new Set(["indoor-playground", "cafe", "playground"]);

describe("партия наполнения top20-2026-11", () => {
  it("в заготовках нет ошибок (время, пустые тексты, цены)", () => {
    expect(TOP20_2026_11.flatMap(validatePlaceFill)).toEqual([]);
  });

  it("каждое место — из сбора 21.10 и встречается один раз", () => {
    const harvested = new Set(
      [...HARVEST_2026_10_PLACES, ...HARVEST_2026_10_PLACES_B].map((place) => place.slug),
    );
    const slugs = TOP20_2026_11.map((fill) => fill.slug);
    expect(slugs.filter((slug) => !harvested.has(slug))).toEqual([]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("категории — только из справочника", () => {
    const unknown = TOP20_2026_11.flatMap((fill) =>
      (fill.categorySlugs ?? []).filter((slug) => !KNOWN_CATEGORIES.has(slug)),
    );
    expect(unknown).toEqual([]);
  });

  it("у каждого места есть содержательное описание на двух языках", () => {
    for (const fill of TOP20_2026_11) {
      expect((fill.description ?? "").length, fill.slug).toBeGreaterThan(80);
      expect((fill.descriptionEn ?? "").length, fill.slug).toBeGreaterThan(80);
    }
  });
});
