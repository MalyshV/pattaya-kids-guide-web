import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ALBUMS_2026_11_FILLS,
  ALBUMS_2026_11_NEW_FILLS,
  ALBUMS_2026_11_NEW_PLACES,
} from "../../../prisma/places/albums-2026-11";
import { HARVEST_2026_10_PLACES } from "../../../prisma/places/harvest-2026-10";
import { HARVEST_2026_10_PLACES_B } from "../../../prisma/places/harvest-2026-10-b";
import { OVERTURE_BATCH_1 } from "../../../prisma/places/overture-batch-1";
import { OVERTURE_BATCH_2 } from "../../../prisma/places/overture-batch-2";
import { ALBUMS_2026_11_PROGRAMS } from "../../../prisma/programs/albums-2026-11";
import { HARVEST_2026_10_PROGRAMS } from "../../../prisma/programs/harvest-2026-10";
import { HARVEST_2026_10_PROGRAMS_B } from "../../../prisma/programs/harvest-2026-10-b";
import { OVERTURE_PROGRAMS_1 } from "../../../prisma/programs/overture-batch-1";
import { findDuplicate } from "./draft-dedup";
import { validatePlaceFill } from "./place-fill";

/// категории мест, которые есть в справочнике (prisma/seed.ts)
const KNOWN_CATEGORIES = new Set(["indoor-playground", "cafe", "playground"]);
const PUBLIC_DIR = path.join(process.cwd(), "public");

const earlierDrafts = [
  ...OVERTURE_BATCH_1,
  ...OVERTURE_BATCH_2,
  ...HARVEST_2026_10_PLACES,
  ...HARVEST_2026_10_PLACES_B,
];
const allFills = [...ALBUMS_2026_11_NEW_FILLS, ...ALBUMS_2026_11_FILLS];

describe("партия albums-2026-11", () => {
  it("в заготовках нет ошибок (тексты, часы, пути фото, права)", () => {
    expect(allFills.flatMap(validatePlaceFill)).toEqual([]);
  });

  it("каждое место встречается один раз", () => {
    const slugs = allFills.map((fill) => fill.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("новые места не повторяют прежние черновики и друг друга", () => {
    const known = earlierDrafts.map((draft) => ({ ...draft }));
    for (const draft of ALBUMS_2026_11_NEW_PLACES) {
      expect(findDuplicate(draft, known), draft.slug).toBeNull();
      known.push({ ...draft });
    }
  });

  it("наполнение новых мест — только для мест из этой же партии", () => {
    const created = new Set(ALBUMS_2026_11_NEW_PLACES.map((place) => place.slug));
    expect(ALBUMS_2026_11_NEW_FILLS.filter((fill) => !created.has(fill.slug))).toEqual(
      [],
    );
  });

  it("у новых мест есть описание на двух языках, обложка и «Полезно знать»", () => {
    for (const fill of ALBUMS_2026_11_NEW_FILLS) {
      expect((fill.description ?? "").length, fill.slug).toBeGreaterThan(80);
      expect((fill.descriptionEn ?? "").length, fill.slug).toBeGreaterThan(80);
      expect(fill.cover, fill.slug).toBeDefined();
      expect(fill.tips?.length ?? 0, fill.slug).toBeGreaterThan(0);
    }
  });

  it("остальные карточки — из прежних партий черновиков", () => {
    const earlier = new Set(earlierDrafts.map((draft) => draft.slug));
    expect(ALBUMS_2026_11_FILLS.filter((fill) => !earlier.has(fill.slug))).toEqual([]);
  });

  it("каждый файл фото лежит в public и ни один не использован дважды", () => {
    const urls = allFills.flatMap((fill) => [
      ...(fill.cover ? [fill.cover.url] : []),
      ...(fill.photos ?? []).map((photo) => photo.url),
    ]);
    expect(urls.filter((url) => !existsSync(path.join(PUBLIC_DIR, url)))).toEqual([]);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("категории — только из справочника", () => {
    const slugs = [
      ...ALBUMS_2026_11_NEW_PLACES.flatMap((place) => place.categorySlugs ?? []),
      ...allFills.flatMap((fill) => fill.categorySlugs ?? []),
    ];
    expect(slugs.filter((slug) => !KNOWN_CATEGORIES.has(slug))).toEqual([]);
  });

  it("занятие не повторяет прежние черновики занятий", () => {
    const known = new Set(
      [
        ...OVERTURE_PROGRAMS_1,
        ...HARVEST_2026_10_PROGRAMS,
        ...HARVEST_2026_10_PROGRAMS_B,
      ].map((program) => program.slug),
    );
    expect(ALBUMS_2026_11_PROGRAMS.filter((program) => known.has(program.slug))).toEqual(
      [],
    );
  });
});
