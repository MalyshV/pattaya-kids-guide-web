import { describe, expect, it } from "vitest";
import {
  activityDistrictSlug,
  eventDistrictSlug,
  landVertices,
  linkedDistrictSlug,
  meanPoint,
} from "@/lib/districts/district-page";
import { PATTAYA_DISTRICTS, PATTAYA_SEA_LONGITUDE } from "@/lib/districts/pattaya";
import type { DistrictDefinition, LatLng } from "@/lib/districts/resolve-district";

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

describe("linkedDistrictSlug", () => {
  const square = (slug: string, west: number): DistrictDefinition => ({
    slug,
    name: slug,
    nameEn: slug,
    nameTh: slug,
    order: 10,
    boundary: [
      [0, west],
      [0, west + 1],
      [1, west + 1],
      [1, west],
    ],
  });
  const districts = [square("a", 0), square("b", 1)];
  // точка по координатам лежит в районе «b»
  const point = { latitude: 0.5, longitude: 1.5 };

  it("район берётся у места, даже если координаты говорят иначе", () => {
    expect(
      linkedDistrictSlug({
        ...point,
        placeId: "studio",
        placeDistricts: new Map([["studio", "a"]]),
        districts,
      }),
    ).toBe("a");
  });

  it("место вне районов — и занятие при нём вне районов", () => {
    expect(
      linkedDistrictSlug({
        ...point,
        placeId: "studio",
        placeDistricts: new Map([["studio", null]]),
        districts,
      }),
    ).toBeNull();
  });

  it("своя площадка или незнакомое место — по координатам", () => {
    expect(
      linkedDistrictSlug({
        ...point,
        placeId: null,
        placeDistricts: new Map([["studio", "a"]]),
        districts,
      }),
    ).toBe("b");
    expect(
      linkedDistrictSlug({
        ...point,
        placeId: "unknown",
        placeDistricts: new Map([["studio", "a"]]),
        districts,
      }),
    ).toBe("b");
  });
});

describe("activityDistrictSlug и eventDistrictSlug", () => {
  const square = (slug: string, west: number): DistrictDefinition => ({
    slug,
    name: slug,
    nameEn: slug,
    nameTh: slug,
    order: 10,
    boundary: [
      [0, west],
      [0, west + 1],
      [1, west + 1],
      [1, west],
    ],
  });
  const districts = [square("a", 0), square("b", 1)];
  // место стоит в «b», но вручную отнесено к «a»
  const studio = { id: "studio", latitude: 0.5, longitude: 1.5 };
  const placeDistricts = new Map<string, string | null>([["studio", "a"]]);

  it("занятие при месте наследует его район", () => {
    expect(activityDistrictSlug({ place: studio }, placeDistricts, districts)).toBe("a");
  });

  it("занятие на своей площадке — по её координатам", () => {
    expect(
      activityDistrictSlug(
        { place: null, venueLatitude: 0.5, venueLongitude: 1.5 },
        placeDistricts,
        districts,
      ),
    ).toBe("b");
  });

  it("занятие без координат — без района", () => {
    expect(activityDistrictSlug({ place: null }, placeDistricts, districts)).toBeNull();
  });

  it("событие при месте наследует его район", () => {
    expect(eventDistrictSlug({ place: studio }, placeDistricts, districts)).toBe("a");
  });

  it("событие со своими координатами — по ним, даже при месте", () => {
    expect(
      eventDistrictSlug(
        { latitude: 0.5, longitude: 1.5, place: studio },
        placeDistricts,
        districts,
      ),
    ).toBe("b");
  });

  it("событие без координат — без района", () => {
    expect(eventDistrictSlug({ place: null }, placeDistricts, districts)).toBeNull();
  });
});
