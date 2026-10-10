import { describe, expect, it } from "vitest";
import {
  isPointInPolygon,
  resolveDistrictSlug,
  type DistrictDefinition,
  type LatLng,
} from "@/lib/districts/resolve-district";

const SQUARE: LatLng[] = [
  [0, 0],
  [0, 10],
  [10, 10],
  [10, 0],
];

/** Буква «Г»: вырез в правом верхнем углу. */
const L_SHAPE: LatLng[] = [
  [0, 0],
  [0, 10],
  [5, 10],
  [5, 5],
  [10, 5],
  [10, 0],
];

function district(slug: string, boundary: LatLng[]): DistrictDefinition {
  return { slug, name: slug, nameEn: slug, nameTh: slug, order: 0, boundary };
}

describe("isPointInPolygon", () => {
  it("точка внутри и снаружи квадрата", () => {
    expect(isPointInPolygon(5, 5, SQUARE)).toBe(true);
    expect(isPointInPolygon(11, 5, SQUARE)).toBe(false);
    expect(isPointInPolygon(5, -1, SQUARE)).toBe(false);
  });

  it("невыпуклая граница: вырез не считается районом", () => {
    expect(isPointInPolygon(2, 8, L_SHAPE)).toBe(true);
    expect(isPointInPolygon(8, 2, L_SHAPE)).toBe(true);
    expect(isPointInPolygon(8, 8, L_SHAPE)).toBe(false);
  });

  it("порядок обхода вершин не важен", () => {
    expect(isPointInPolygon(5, 5, [...SQUARE].reverse())).toBe(true);
  });
});

describe("resolveDistrictSlug", () => {
  const districts = [
    district("west", SQUARE),
    district("east", [
      [0, 10],
      [0, 20],
      [10, 20],
      [10, 10],
    ]),
  ];

  it("точка получает свой район", () => {
    expect(resolveDistrictSlug(5, 5, districts)).toBe("west");
    expect(resolveDistrictSlug(5, 15, districts)).toBe("east");
  });

  it("вне всех районов — «без района», не ошибка", () => {
    expect(resolveDistrictSlug(50, 50, districts)).toBeNull();
    expect(resolveDistrictSlug(5, 5, [])).toBeNull();
  });

  it("на общей границе результат детерминирован — ровно один район", () => {
    const slug = resolveDistrictSlug(5, 10, districts);
    expect(["west", "east"]).toContain(slug);
    expect(resolveDistrictSlug(5, 10, districts)).toBe(slug);
  });

  it("нет координат или они битые — null", () => {
    expect(resolveDistrictSlug(null, 5, districts)).toBeNull();
    expect(resolveDistrictSlug(5, undefined, districts)).toBeNull();
    expect(resolveDistrictSlug(Number.NaN, 5, districts)).toBeNull();
    expect(resolveDistrictSlug(5, Number.POSITIVE_INFINITY, districts)).toBeNull();
  });
});
