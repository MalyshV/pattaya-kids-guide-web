import { describe, expect, it } from "vitest";
import {
  matchesAgeBucket,
  matchesAnyAgeBucket,
  parseAgeBuckets,
  placeAgeGroupsMatch,
} from "./age-buckets";

describe("matchesAgeBucket (строгое пересечение диапазонов)", () => {
  it("широкое занятие (4 мес – 12 лет) попадает во все корзины", () => {
    const gym = { minAgeMonths: 4, maxAgeMonths: 144 };
    for (const key of ["0-1", "1-3", "3-6", "6-12"]) {
      expect(matchesAgeBucket(gym, key)).toBe(true);
    }
  });

  it("«до 3 лет» НЕ попадает в корзину 3–6 (стык — не пересечение)", () => {
    const playgroup = { minAgeMonths: 0, maxAgeMonths: 36 };
    expect(matchesAgeBucket(playgroup, "1-3")).toBe(true);
    expect(matchesAgeBucket(playgroup, "3-6")).toBe(false);
  });

  it("«от 3 лет» НЕ попадает в корзину 1–3", () => {
    const camp = { minAgeMonths: 36, maxAgeMonths: 96 };
    expect(matchesAgeBucket(camp, "1-3")).toBe(false);
    expect(matchesAgeBucket(camp, "3-6")).toBe(true);
  });

  it("без возраста и с неизвестным ключом — подходит", () => {
    expect(matchesAgeBucket({ minAgeMonths: null, maxAgeMonths: null }, "1-3")).toBe(
      true,
    );
    expect(matchesAgeBucket({ minAgeMonths: 4, maxAgeMonths: 12 }, "2-5")).toBe(true);
  });
});

describe("parseAgeBuckets (мультивыбор из URL)", () => {
  it("одиночный и множественный выбор", () => {
    expect(parseAgeBuckets("1-3")).toEqual(["1-3"]);
    expect(parseAgeBuckets("1-3,6-12")).toEqual(["1-3", "6-12"]);
  });

  it("порядок — как в AGE_BUCKETS, независимо от URL", () => {
    expect(parseAgeBuckets("6-12,0-1")).toEqual(["0-1", "6-12"]);
  });

  it("мусор и дубли отбрасываются, пусто → []", () => {
    expect(parseAgeBuckets("2-5,1-3,1-3")).toEqual(["1-3"]);
    expect(parseAgeBuckets("мусор")).toEqual([]);
    expect(parseAgeBuckets(undefined)).toEqual([]);
    expect(parseAgeBuckets("")).toEqual([]);
  });
});

describe("matchesAnyAgeBucket (двое детей)", () => {
  const toddlerOnly = { minAgeMonths: 0, maxAgeMonths: 36 };

  it("подходит, если попадает хотя бы в одну выбранную корзину", () => {
    expect(matchesAnyAgeBucket(toddlerOnly, ["1-3", "6-12"])).toBe(true);
    expect(matchesAnyAgeBucket(toddlerOnly, ["3-6", "6-12"])).toBe(false);
  });

  it("пустой выбор — фильтра нет", () => {
    expect(matchesAnyAgeBucket(toddlerOnly, [])).toBe(true);
  });
});

describe("placeAgeGroupsMatch (возраст места в годах)", () => {
  const lariDea = [{ minAge: 1, maxAge: 7 }];
  const playBarn = [
    { minAge: 0, maxAge: 2 },
    { minAge: 3, maxAge: 6 },
  ];

  it("группа «1–7 лет» пересекает свои корзины, но не «до 1 года» (стык)", () => {
    expect(placeAgeGroupsMatch(lariDea, ["1-3"])).toBe(true);
    expect(placeAgeGroupsMatch(lariDea, ["6-12"])).toBe(true);
    // место заявило «с 1 года» — малышу до года его честно не обещаем,
    // та же строгая семантика стыков, что у занятий («от 3 лет» ≠ «1–3»)
    expect(placeAgeGroupsMatch(lariDea, ["0-1"])).toBe(false);
  });

  it("место 0–2 и 3–6 лет НЕ подходит только школьникам 6–12… кроме стыка", () => {
    // группа 3–6 лет = 36–72 мес, корзина 6-12 = 72–144: стык, не пересечение
    expect(placeAgeGroupsMatch(playBarn, ["6-12"])).toBe(false);
    expect(placeAgeGroupsMatch(playBarn, ["1-3"])).toBe(true);
  });

  it("двое детей: подходит, если место годится хотя бы одному", () => {
    expect(placeAgeGroupsMatch(playBarn, ["1-3", "6-12"])).toBe(true);
  });

  it("без групп или без выбора — показываем", () => {
    expect(placeAgeGroupsMatch([], ["1-3"])).toBe(true);
    expect(placeAgeGroupsMatch(lariDea, [])).toBe(true);
  });
});
