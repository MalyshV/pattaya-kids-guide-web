import { describe, expect, it } from "vitest";
import { matchesAgeBucket, matchesCategory, parseAgeBucket } from "./activity-filter";

describe("matchesAgeBucket (строгое пересечение диапазонов)", () => {
  it("широкое занятие (4 мес – 12 лет) попадает во все корзины", () => {
    const gym = { minAgeMonths: 4, maxAgeMonths: 144 };
    for (const key of ["0-1", "1-3", "3-6", "6-12"]) {
      expect(matchesAgeBucket(gym, key)).toBe(true);
    }
  });

  it("«до 3 лет» НЕ попадает в корзину 3–6 (стык — не пересечение)", () => {
    const playgroup = { minAgeMonths: 0, maxAgeMonths: 36 };
    expect(matchesAgeBucket(playgroup, "0-1")).toBe(true);
    expect(matchesAgeBucket(playgroup, "1-3")).toBe(true);
    expect(matchesAgeBucket(playgroup, "3-6")).toBe(false);
  });

  it("«от 3 лет» НЕ попадает в корзину 1–3", () => {
    const camp = { minAgeMonths: 36, maxAgeMonths: 96 };
    expect(matchesAgeBucket(camp, "1-3")).toBe(false);
    expect(matchesAgeBucket(camp, "3-6")).toBe(true);
    expect(matchesAgeBucket(camp, "6-12")).toBe(true);
  });

  it("занятие без возраста подходит любой корзине (пробел данных не прячет)", () => {
    expect(matchesAgeBucket({ minAgeMonths: null, maxAgeMonths: null }, "1-3")).toBe(
      true,
    );
  });

  it("только нижняя граница: «от 3 лет» без потолка", () => {
    const open = { minAgeMonths: 36, maxAgeMonths: null };
    expect(matchesAgeBucket(open, "1-3")).toBe(false);
    expect(matchesAgeBucket(open, "6-12")).toBe(true);
  });

  it("неизвестный ключ корзины не фильтрует", () => {
    expect(matchesAgeBucket({ minAgeMonths: 4, maxAgeMonths: 12 }, "2-5")).toBe(true);
  });
});

describe("parseAgeBucket", () => {
  it("валидный ключ проходит, мусор и пустота — нет", () => {
    expect(parseAgeBucket("1-3")).toBe("1-3");
    expect(parseAgeBucket("2-5")).toBeUndefined();
    expect(parseAgeBucket(undefined)).toBeUndefined();
  });
});

describe("matchesCategory", () => {
  const activity = { categories: [{ slug: "gymnastics" }, { slug: "swimming" }] };

  it("совпадение по slug", () => {
    expect(matchesCategory(activity, "swimming")).toBe(true);
    expect(matchesCategory(activity, "music")).toBe(false);
  });
});
