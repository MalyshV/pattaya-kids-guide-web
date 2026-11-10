import { describe, expect, it } from "vitest";
import { toDistrictDto, toPlaceDistrictDto } from "@/mappers/district.mapper";
import { PATTAYA_DISTRICTS } from "@/lib/districts/pattaya";

const ROW = { slug: "jomtien", name: "Джомтьен", nameEn: "Jomtien", nameTh: "จอมเทียน" };

describe("toDistrictDto — район на языке страницы", () => {
  it("название по языку", () => {
    expect(toDistrictDto(ROW, "ru")).toEqual({ slug: "jomtien", name: "Джомтьен" });
    expect(toDistrictDto(ROW, "en").name).toBe("Jomtien");
    expect(toDistrictDto(ROW, "th").name).toBe("จอมเทียน");
  });

  it("нет перевода — соседний язык, а не пустота", () => {
    expect(toDistrictDto({ ...ROW, nameTh: null }, "th").name).toBe("Jomtien");
    expect(toDistrictDto({ ...ROW, nameEn: null, nameTh: null }, "en").name).toBe(
      "Джомтьен",
    );
  });
});

describe("toPlaceDistrictDto — район места для карточки", () => {
  // пляж Джомтьен у Soi 7
  const JOMTIEN_POINT = { latitude: 12.891, longitude: 100.872 };

  it("по координатам, название на языке страницы", () => {
    const place = { ...JOMTIEN_POINT, districtManual: false };
    expect(toPlaceDistrictDto(place, PATTAYA_DISTRICTS, "ru")).toEqual({
      slug: "jomtien",
      name: "Джомтьен",
    });
    expect(toPlaceDistrictDto(place, PATTAYA_DISTRICTS, "en")?.name).toBe("Jomtien");
  });

  it("ручной выбор из админки побеждает координаты", () => {
    const place = {
      ...JOMTIEN_POINT,
      districtManual: true,
      district: { slug: "pratumnak" },
    };
    expect(toPlaceDistrictDto(place, PATTAYA_DISTRICTS, "ru")?.slug).toBe("pratumnak");
  });

  it("город без районов и точка вне районов — без района", () => {
    expect(
      toPlaceDistrictDto({ ...JOMTIEN_POINT, districtManual: false }, [], "ru"),
    ).toBeNull();
    expect(
      toPlaceDistrictDto(
        { latitude: 13.7563, longitude: 100.5018, districtManual: false },
        PATTAYA_DISTRICTS,
        "ru",
      ),
    ).toBeNull();
  });
});
