import { describe, expect, it } from "vitest";
import { HARVEST_2026_10_PLACES } from "../../../prisma/places/harvest-2026-10";
import { HARVEST_2026_10_PLACES_B } from "../../../prisma/places/harvest-2026-10-b";
import { HARVEST_FILL_2026_11 } from "../../../prisma/places/harvest-fill-2026-11";
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

describe("партия наполнения harvest-fill-2026-11", () => {
  const harvested = new Set(
    [...HARVEST_2026_10_PLACES, ...HARVEST_2026_10_PLACES_B].map((place) => place.slug),
  );
  const categories = new Set([...KNOWN_CATEGORIES, "cafe-kids-zone", "waterpark"]);

  it("в заготовках нет ошибок (время, пустые тексты, цены, фото)", () => {
    expect(HARVEST_FILL_2026_11.flatMap(validatePlaceFill)).toEqual([]);
  });

  it("каждое место — из сбора 21.10, один раз и не повторяет топ-20", () => {
    const slugs = HARVEST_FILL_2026_11.map((fill) => fill.slug);
    const top20 = new Set(TOP20_2026_11.map((fill) => fill.slug));
    expect(slugs.filter((slug) => !harvested.has(slug))).toEqual([]);
    expect(slugs.filter((slug) => top20.has(slug))).toEqual([]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("категории — только из справочника", () => {
    const unknown = HARVEST_FILL_2026_11.flatMap((fill) =>
      (fill.categorySlugs ?? []).filter((slug) => !categories.has(slug)),
    );
    expect(unknown).toEqual([]);
  });

  it("у каждого места есть содержательное описание на двух языках", () => {
    for (const fill of HARVEST_FILL_2026_11) {
      expect((fill.description ?? "").length, fill.slug).toBeGreaterThan(80);
      expect((fill.descriptionEn ?? "").length, fill.slug).toBeGreaterThan(80);
    }
  });

  it("ссылки на Telegram — через telegram.me", () => {
    const tme = HARVEST_FILL_2026_11.flatMap((fill) =>
      (fill.contacts ?? []).filter(
        (contact) =>
          contact.value.includes("t.me/") && !contact.value.includes("telegram.me/"),
      ),
    );
    expect(tme).toEqual([]);
  });
});
