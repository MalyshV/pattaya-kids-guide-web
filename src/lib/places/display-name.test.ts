import { describe, expect, it } from "vitest";
import { placeDisplayName, placeDisplayNames } from "@/lib/places/display-name";

const ZONE = {
  name: "Skippy Land",
  branchLabel: "Lotus's North, у фудкорта",
  branchLabelEn: "Lotus's North, by the food court",
  branchLabelTh: "Lotus's North ติดฟู้ดคอร์ต",
};

describe("placeDisplayName", () => {
  it("бренд + метка на языке страницы через « · »", () => {
    expect(placeDisplayName(ZONE, "ru")).toBe("Skippy Land · Lotus's North, у фудкорта");
    expect(placeDisplayName(ZONE, "en")).toBe(
      "Skippy Land · Lotus's North, by the food court",
    );
    expect(placeDisplayName(ZONE, "th")).toBe("Skippy Land · Lotus's North ติดฟู้ดคอร์ต");
  });

  it("метка каскадом th → en → ru, когда перевода нет", () => {
    const partial = { ...ZONE, branchLabelTh: null };
    expect(placeDisplayName(partial, "th")).toBe(
      "Skippy Land · Lotus's North, by the food court",
    );
    expect(placeDisplayName({ ...partial, branchLabelEn: "" }, "en")).toBe(
      "Skippy Land · Lotus's North, у фудкорта",
    );
  });

  it("место без метки показывается как есть", () => {
    expect(placeDisplayName({ name: "LariDea" }, "ru")).toBe("LariDea");
    expect(placeDisplayName({ name: "LariDea", branchLabel: "  " }, "ru")).toBe(
      "LariDea",
    );
    expect(placeDisplayName({ name: "LariDea", branchLabel: null }, "th")).toBe(
      "LariDea",
    );
  });

  it("placeDisplayNames — все написания без повторов", () => {
    expect(placeDisplayNames(ZONE)).toEqual([
      "Skippy Land · Lotus's North, у фудкорта",
      "Skippy Land · Lotus's North, by the food court",
      "Skippy Land · Lotus's North ติดฟู้ดคอร์ต",
    ]);
    expect(placeDisplayNames({ name: "LariDea" })).toEqual(["LariDea"]);
  });
});
