import { describe, expect, it } from "vitest";
import { buildDistrictField, chooseDistrict } from "@/lib/districts/choose-district";
import type { DistrictDefinition, LatLng } from "@/lib/districts/resolve-district";

function district(slug: string, order: number, boundary: LatLng[]): DistrictDefinition {
  return { slug, name: `Район ${slug}`, nameEn: slug, nameTh: slug, order, boundary };
}

const WEST = district("west", 20, [
  [0, 0],
  [0, 10],
  [10, 10],
  [10, 0],
]);
const EAST = district("east", 10, [
  [0, 10],
  [0, 20],
  [10, 20],
  [10, 10],
]);
const DISTRICTS = [WEST, EAST];

describe("chooseDistrict — район при сохранении", () => {
  it("без ручного выбора — по координатам", () => {
    expect(
      chooseDistrict({
        manualSlug: null,
        latitude: 5,
        longitude: 5,
        districts: DISTRICTS,
      }),
    ).toEqual({ slug: "west", manual: false });
    expect(
      chooseDistrict({
        manualSlug: "",
        latitude: 5,
        longitude: 15,
        districts: DISTRICTS,
      }),
    ).toEqual({ slug: "east", manual: false });
  });

  it("ручной выбор побеждает координаты", () => {
    expect(
      chooseDistrict({
        manualSlug: "east",
        latitude: 5,
        longitude: 5,
        districts: DISTRICTS,
      }),
    ).toEqual({ slug: "east", manual: true });
  });

  it("ручной выбор держится, даже если место вне всех районов", () => {
    expect(
      chooseDistrict({
        manualSlug: "west",
        latitude: 50,
        longitude: 50,
        districts: DISTRICTS,
      }),
    ).toEqual({ slug: "west", manual: true });
  });

  it("вне районов и без ручного выбора — «без района»", () => {
    expect(
      chooseDistrict({
        manualSlug: null,
        latitude: 50,
        longitude: 50,
        districts: DISTRICTS,
      }),
    ).toEqual({ slug: null, manual: false });
  });

  it("района из ручного выбора больше нет — назад к координатам", () => {
    expect(
      chooseDistrict({
        manualSlug: "gone",
        latitude: 5,
        longitude: 5,
        districts: DISTRICTS,
      }),
    ).toEqual({ slug: "west", manual: false });
  });
});

describe("buildDistrictField — поле «Район» в форме", () => {
  it("новое место: все районы по порядку, выбор «по координатам»", () => {
    expect(buildDistrictField({ districts: DISTRICTS, place: null })).toEqual({
      options: [
        { slug: "east", name: "Район east" },
        { slug: "west", name: "Район west" },
      ],
      manualSlug: null,
      byCoordinates: null,
    });
  });

  it("сохранённое место по координатам — видно, какой район определился", () => {
    const field = buildDistrictField({
      districts: DISTRICTS,
      place: { latitude: 5, longitude: 5, districtManual: false, districtSlug: "west" },
    });
    expect(field.manualSlug).toBeNull();
    expect(field.byCoordinates).toEqual({ slug: "west", name: "Район west" });
  });

  it("ручной выбор — выбран он, а район по координатам виден рядом", () => {
    const field = buildDistrictField({
      districts: DISTRICTS,
      place: { latitude: 5, longitude: 5, districtManual: true, districtSlug: "east" },
    });
    expect(field.manualSlug).toBe("east");
    expect(field.byCoordinates?.slug).toBe("west");
  });

  it("флаг ручного выбора без района (район удалили) — показываем «по координатам»", () => {
    const field = buildDistrictField({
      districts: DISTRICTS,
      place: { latitude: 50, longitude: 50, districtManual: true, districtSlug: null },
    });
    expect(field.manualSlug).toBeNull();
    expect(field.byCoordinates).toBeNull();
  });
});
