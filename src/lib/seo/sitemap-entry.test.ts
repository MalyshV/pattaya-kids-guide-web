import { describe, expect, it } from "vitest";
import { localizedSitemapEntry } from "@/lib/seo/sitemap-entry";

const BASE = "https://example.com";

describe("localizedSitemapEntry", () => {
  it("url на дефолтной локали, alternates на все переводы + x-default", () => {
    const entry = localizedSitemapEntry(BASE, "pattaya", "/places/skippy-land");
    expect(entry.url).toBe("https://example.com/ru/pattaya/places/skippy-land");
    expect(entry.alternates?.languages).toEqual({
      ru: "https://example.com/ru/pattaya/places/skippy-land",
      en: "https://example.com/en/pattaya/places/skippy-land",
      th: "https://example.com/th/pattaya/places/skippy-land",
      "x-default": "https://example.com/ru/pattaya/places/skippy-land",
    });
  });

  it("пустой subPath = корень города", () => {
    const entry = localizedSitemapEntry(BASE, "pattaya", "");
    expect(entry.url).toBe("https://example.com/ru/pattaya");
    expect(entry.alternates?.languages?.en).toBe("https://example.com/en/pattaya");
  });

  it("lastModified включается только когда передан (у занятий даты нет)", () => {
    const withDate = localizedSitemapEntry(
      BASE,
      "pattaya",
      "/places/x",
      new Date("2026-07-01T00:00:00Z"),
    );
    expect(withDate.lastModified).toEqual(new Date("2026-07-01T00:00:00Z"));

    const withoutDate = localizedSitemapEntry(BASE, "pattaya", "/activities/y");
    expect(withoutDate).not.toHaveProperty("lastModified");
  });
});
