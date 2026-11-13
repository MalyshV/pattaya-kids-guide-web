import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HARVEST_2026_10_PLACES } from "../../../prisma/places/harvest-2026-10";
import { HARVEST_2026_10_PLACES_B } from "../../../prisma/places/harvest-2026-10-b";
import {
  IG_CENTER_FILL,
  IG_CENTER_PLACE,
} from "../../../prisma/places/ig-center-2026-11";
import { OVERTURE_BATCH_1 } from "../../../prisma/places/overture-batch-1";
import { OVERTURE_BATCH_2 } from "../../../prisma/places/overture-batch-2";
import {
  IG_CENTER_NEW_PROGRAMS,
  IG_CENTER_PROGRAM_FILLS,
  IG_CENTER_PROGRAM_LINKS,
} from "../../../prisma/programs/ig-center-2026-11";
import { OVERTURE_PROGRAMS_1 } from "../../../prisma/programs/overture-batch-1";
import { findDuplicate } from "./draft-dedup";
import { validatePlaceFill } from "./place-fill";
import { validateProgramFill } from "./program-fill";
import { validateProgramPlaceLink } from "./program-place-link";

const PUBLIC_DIR = path.join(process.cwd(), "public");
/// категории мест и занятий из справочников (prisma/seed.ts)
const PLACE_CATEGORIES = new Set(["indoor-playground", "cafe", "playground"]);
const PROGRAM_CATEGORIES = new Set([
  "early-development",
  "swimming",
  "art",
  "music",
  "robotics",
]);

describe("партия ig-center-2026-11", () => {
  it("заготовки без ошибок", () => {
    expect(validatePlaceFill(IG_CENTER_FILL)).toEqual([]);
    expect(IG_CENTER_PROGRAM_FILLS.flatMap(validateProgramFill)).toEqual([]);
    expect(IG_CENTER_PROGRAM_LINKS.flatMap(validateProgramPlaceLink)).toEqual([]);
  });

  it("место новое: не повторяет прежние черновики мест", () => {
    const known = [
      ...OVERTURE_BATCH_1,
      ...OVERTURE_BATCH_2,
      ...HARVEST_2026_10_PLACES,
      ...HARVEST_2026_10_PLACES_B,
    ];
    expect(findDuplicate(IG_CENTER_PLACE, known)).toBeNull();
  });

  it("четыре занятия — прежние черновики, пятое — новое", () => {
    const earlier = new Set(OVERTURE_PROGRAMS_1.map((program) => program.slug));
    const fresh = new Set(IG_CENTER_NEW_PROGRAMS.map((program) => program.slug));
    for (const link of IG_CENTER_PROGRAM_LINKS) {
      expect(earlier.has(link.slug) !== fresh.has(link.slug), link.slug).toBe(true);
      expect(link.placeSlug).toBe(IG_CENTER_PLACE.slug);
    }
    expect(IG_CENTER_PROGRAM_LINKS).toHaveLength(5);
  });

  it("каждое привязанное занятие наполняется ровно один раз", () => {
    const linked = IG_CENTER_PROGRAM_LINKS.map((link) => link.slug).sort();
    const filled = IG_CENTER_PROGRAM_FILLS.map((fill) => fill.slug).sort();
    expect(filled).toEqual(linked);
  });

  it("переименование — от имени, под которым занятие лежит в сборе", () => {
    const names = new Map(
      OVERTURE_PROGRAMS_1.map((program) => [program.slug, program.name]),
    );
    for (const link of IG_CENTER_PROGRAM_LINKS) {
      if (link.rename) {
        expect(link.rename.from, link.slug).toBe(names.get(link.slug));
      }
    }
  });

  it("категории из справочников", () => {
    expect(
      (IG_CENTER_PLACE.categorySlugs ?? []).filter((slug) => !PLACE_CATEGORIES.has(slug)),
    ).toEqual([]);
    const programCategories = [
      ...IG_CENTER_PROGRAM_FILLS.flatMap((fill) => fill.categorySlugs ?? []),
      ...IG_CENTER_NEW_PROGRAMS.flatMap((program) =>
        program.categorySlug ? [program.categorySlug] : [],
      ),
    ];
    expect(programCategories.filter((slug) => !PROGRAM_CATEGORIES.has(slug))).toEqual([]);
  });

  it("все фото лежат в public", () => {
    const urls = [
      ...(IG_CENTER_FILL.cover ? [IG_CENTER_FILL.cover.url] : []),
      ...(IG_CENTER_FILL.photos ?? []).map((photo) => photo.url),
      ...IG_CENTER_PROGRAM_FILLS.flatMap((fill) => [
        ...(fill.cover ? [fill.cover] : []),
        ...(fill.photos ?? []).map((photo) => photo.url),
      ]),
    ];
    expect(urls.filter((url) => !existsSync(path.join(PUBLIC_DIR, url)))).toEqual([]);
  });

  it("ссылки на Telegram — без t.me", () => {
    const text = JSON.stringify([IG_CENTER_FILL, IG_CENTER_PROGRAM_FILLS]);
    expect(text).not.toMatch(/\/\/t\.me\//);
  });
});
