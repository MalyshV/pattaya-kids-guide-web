import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ACTIVITIES_FILL_2026_11 } from "../../../prisma/programs/activities-fill-2026-11";
import { HARVEST_2026_10_PROGRAMS } from "../../../prisma/programs/harvest-2026-10";
import { HARVEST_2026_10_PROGRAMS_B } from "../../../prisma/programs/harvest-2026-10-b";
import { validateProgramFill } from "./program-fill";

const CATEGORIES = new Set([
  "early-development",
  "swimming",
  "gymnastics",
  "dance",
  "art",
  "music",
  "math",
  "cooking",
  "martial-arts",
  "sport",
  "languages",
  "robotics",
]);

describe("партия наполнения занятий activities-fill-2026-11", () => {
  const fills = ACTIVITIES_FILL_2026_11;

  it("заготовки без ошибок", () => {
    expect(fills.flatMap(validateProgramFill)).toEqual([]);
  });

  it("только занятия из сбора 21.10, каждое один раз", () => {
    const harvest = new Set(
      [...HARVEST_2026_10_PROGRAMS, ...HARVEST_2026_10_PROGRAMS_B].map((p) => p.slug),
    );
    const slugs = fills.map((fill) => fill.slug);
    expect(slugs.filter((slug) => !harvest.has(slug))).toEqual([]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("категории из справочника занятий", () => {
    const unknown = fills.flatMap((fill) =>
      (fill.categorySlugs ?? []).filter((slug) => !CATEGORIES.has(slug)),
    );
    expect(unknown).toEqual([]);
  });

  it("настоящие описания на трёх языках, без t.me", () => {
    for (const fill of fills) {
      expect(fill.description.length, fill.slug).toBeGreaterThan(80);
      expect(fill.descriptionEn.length, fill.slug).toBeGreaterThan(80);
      expect(fill.descriptionTh, fill.slug).toBeTruthy();
      const text = JSON.stringify(fill);
      expect(text, fill.slug).not.toMatch(/\/\/t\.me\//);
    }
  });

  it("файлы обложек и галерей лежат в public", () => {
    const files = fills.flatMap((fill) => [
      ...(fill.cover ? [fill.cover] : []),
      ...(fill.photos ?? []).map((photo) => photo.url),
    ]);
    const missing = files.filter(
      (url) => !existsSync(path.join(process.cwd(), "public", url)),
    );
    expect(missing).toEqual([]);
  });
});
