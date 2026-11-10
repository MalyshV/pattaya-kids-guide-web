import { describe, expect, it } from "vitest";
import {
  countByDistrict,
  parseDistrictParam,
  placeDistrictSlug,
} from "@/lib/districts/place-district";
import type { DistrictDefinition } from "@/lib/districts/resolve-district";

const SQUARE_A: DistrictDefinition = {
  slug: "a",
  name: "А",
  nameEn: "A",
  nameTh: "ก",
  order: 20,
  boundary: [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 0],
  ],
};
const SQUARE_B: DistrictDefinition = {
  slug: "b",
  name: "Б",
  nameEn: "B",
  nameTh: "ข",
  order: 10,
  boundary: [
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 1],
  ],
};
const DISTRICTS = [SQUARE_A, SQUARE_B];

describe("placeDistrictSlug", () => {
  it("считает район по координатам, когда ручного выбора нет", () => {
    expect(
      placeDistrictSlug(
        { latitude: 0.5, longitude: 1.5, districtManual: false, district: { slug: "a" } },
        DISTRICTS,
      ),
    ).toBe("b");
  });

  it("ручной выбор побеждает координаты", () => {
    expect(
      placeDistrictSlug(
        { latitude: 0.5, longitude: 1.5, districtManual: true, district: { slug: "a" } },
        DISTRICTS,
      ),
    ).toBe("a");
  });

  it("ручной выбор без связи в выборке — возврат к координатам", () => {
    expect(
      placeDistrictSlug(
        { latitude: 0.5, longitude: 0.5, districtManual: true },
        DISTRICTS,
      ),
    ).toBe("a");
  });

  it("точка вне районов и место без координат — без района", () => {
    expect(
      placeDistrictSlug({ latitude: 5, longitude: 5, districtManual: false }, DISTRICTS),
    ).toBeNull();
    expect(
      placeDistrictSlug(
        { latitude: null, longitude: null, districtManual: false },
        DISTRICTS,
      ),
    ).toBeNull();
  });
});

describe("parseDistrictParam", () => {
  it("знакомый slug проходит, незнакомый и пустой — нет", () => {
    expect(parseDistrictParam("a", DISTRICTS)).toBe("a");
    expect(parseDistrictParam("nowhere", DISTRICTS)).toBeNull();
    expect(parseDistrictParam("", DISTRICTS)).toBeNull();
    expect(parseDistrictParam(undefined, DISTRICTS)).toBeNull();
  });
});

describe("countByDistrict", () => {
  it("считает места по районам в порядке показа и прячет пустые", () => {
    const third: DistrictDefinition = { ...SQUARE_A, slug: "c", order: 30 };
    const result = countByDistrict(["a", "b", "a", null], [SQUARE_A, SQUARE_B, third]);
    expect(result.map((entry) => [entry.district.slug, entry.count])).toEqual([
      ["b", 1],
      ["a", 2],
    ]);
  });

  it("includeEmpty — все районы, пустые с нулём", () => {
    const third: DistrictDefinition = { ...SQUARE_A, slug: "c", order: 30 };
    const result = countByDistrict(["a"], [SQUARE_A, SQUARE_B, third], {
      includeEmpty: true,
    });
    expect(result.map((entry) => [entry.district.slug, entry.count])).toEqual([
      ["b", 0],
      ["a", 1],
      ["c", 0],
    ]);
  });

  it("slug не из справочника не создаёт района", () => {
    expect(countByDistrict(["ghost"], DISTRICTS)).toEqual([]);
  });
});
