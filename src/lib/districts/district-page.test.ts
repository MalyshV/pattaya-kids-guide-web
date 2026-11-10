import { describe, expect, it } from "vitest";
import { landVertices, meanPoint } from "@/lib/districts/district-page";
import { PATTAYA_DISTRICTS, PATTAYA_SEA_LONGITUDE } from "@/lib/districts/pattaya";
import type { LatLng } from "@/lib/districts/resolve-district";

describe("landVertices", () => {
  const SEA = 100;
  const boundary: LatLng[] = [
    [1, SEA],
    [1, 101],
    [0, 101.5],
    [0, SEA],
  ];

  it("отбрасывает вершины на морской долготе", () => {
    expect(landVertices(boundary, SEA)).toEqual([
      [1, 101],
      [0, 101.5],
    ]);
  });

  it("у города без моря остаются все вершины", () => {
    expect(landVertices(boundary, null)).toEqual(boundary);
  });

  it("у каждого района Паттайи есть хотя бы две вершины на суше", () => {
    for (const district of PATTAYA_DISTRICTS) {
      expect(
        landVertices(district.boundary, PATTAYA_SEA_LONGITUDE).length,
        district.slug,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("внутренний район Паттайи вершин не теряет", () => {
    const east = PATTAYA_DISTRICTS.find((district) => district.slug === "east-pattaya");
    expect(east).toBeDefined();
    expect(landVertices(east?.boundary ?? [], PATTAYA_SEA_LONGITUDE)).toHaveLength(
      east?.boundary.length ?? 0,
    );
  });
});

describe("meanPoint", () => {
  it("среднее по широте и долготе", () => {
    expect(
      meanPoint([
        { latitude: 12, longitude: 100 },
        { latitude: 13, longitude: 101 },
        { latitude: 14, longitude: 102 },
      ]),
    ).toEqual({ latitude: 13, longitude: 101 });
  });

  it("одна точка — она же", () => {
    expect(meanPoint([{ latitude: 12.9, longitude: 100.87 }])).toEqual({
      latitude: 12.9,
      longitude: 100.87,
    });
  });

  it("пусто — подписывать нечего", () => {
    expect(meanPoint([])).toBeNull();
  });
});
