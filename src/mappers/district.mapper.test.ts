import { describe, expect, it } from "vitest";
import { toDistrictDto } from "@/mappers/district.mapper";

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
