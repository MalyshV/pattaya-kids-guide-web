import { describe, expect, it } from "vitest";
import { districtFacet, placeDistrictMap } from "@/lib/districts/district-facet";
import type { DistrictDefinition } from "@/lib/districts/resolve-district";

const square = (slug: string, west: number, order: number): DistrictDefinition => ({
  slug,
  name: `Район ${slug}`,
  nameEn: `District ${slug}`,
  nameTh: slug,
  order,
  boundary: [
    [0, west],
    [0, west + 1],
    [1, west + 1],
    [1, west],
  ],
});
const DISTRICTS = [square("a", 0, 20), square("b", 1, 10), square("c", 2, 30)];

describe("districtFacet", () => {
  const entries = [
    { id: 1, districtSlug: "a" },
    { id: 2, districtSlug: "b" },
    { id: 3, districtSlug: "a" },
    { id: 4, districtSlug: null },
  ];

  it("без выбора — все записи и все районы, пустые с нулём", () => {
    const facet = districtFacet(entries, null, DISTRICTS, "ru");
    expect(facet.entries).toHaveLength(4);
    expect(facet.options).toEqual([
      { slug: "b", name: "Район b", count: 1 },
      { slug: "a", name: "Район a", count: 2 },
      { slug: "c", name: "Район c", count: 0 },
    ]);
  });

  it("выбранный район оставляет только свои записи, числа — по всем", () => {
    const facet = districtFacet(entries, "a", DISTRICTS, "en");
    expect(facet.entries.map((entry) => entry.id)).toEqual([1, 3]);
    expect(facet.options.map((option) => [option.name, option.count])).toEqual([
      ["District b", 1],
      ["District a", 2],
      ["District c", 0],
    ]);
  });

  it("пустой район можно выбрать — записей нет, в выборе он с нулём", () => {
    const facet = districtFacet(entries, "c", DISTRICTS, "ru");
    expect(facet.entries).toEqual([]);
    expect(facet.options.at(-1)).toEqual({ slug: "c", name: "Район c", count: 0 });
  });
});

describe("placeDistrictMap", () => {
  it("район места: ручной выбор, координаты, вне районов", () => {
    const map = placeDistrictMap(
      [
        { id: "by-point", latitude: 0.5, longitude: 1.5, districtManual: false },
        {
          id: "manual",
          latitude: 0.5,
          longitude: 1.5,
          districtManual: true,
          district: { slug: "a" },
        },
        { id: "outside", latitude: 9, longitude: 9, districtManual: false },
      ],
      DISTRICTS,
    );
    expect(map.get("by-point")).toBe("b");
    expect(map.get("manual")).toBe("a");
    expect(map.get("outside")).toBeNull();
  });
});
