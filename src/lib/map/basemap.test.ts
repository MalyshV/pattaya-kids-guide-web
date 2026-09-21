import { describe, expect, it } from "vitest";
import { OSM_BASEMAP, pickBasemap } from "@/lib/map/basemap";

describe("pickBasemap", () => {
  it("с ключом — CARTO: ключ в адресе, светлая/тёмная по теме, атрибуция OSM и CARTO", () => {
    const basemap = pickBasemap("cb1_test");
    expect(basemap.id).toBe("carto");
    expect(basemap.url(false)).toContain("/light_all/");
    expect(basemap.url(true)).toContain("/dark_all/");
    expect(basemap.url(false)).toMatch(/\?key=cb1_test$/);
    expect(basemap.attribution).toContain("OpenStreetMap</a> contributors");
    expect(basemap.attribution).toContain("CARTO");
  });

  it("без ключа (или пустой строкой) — запасная OSM, одна плитка на обе темы", () => {
    expect(pickBasemap(undefined)).toBe(OSM_BASEMAP);
    expect(pickBasemap("  ")).toBe(OSM_BASEMAP);
    expect(OSM_BASEMAP.url(true)).toBe(OSM_BASEMAP.url(false));
    expect(OSM_BASEMAP.attribution).toContain("OpenStreetMap</a> contributors");
  });
});
