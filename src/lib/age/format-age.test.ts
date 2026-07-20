import { describe, expect, it } from "vitest";
import { formatAgeRange, fromAgeLabel } from "./format-age";

describe("fromAgeLabel («можно оставить с…»)", () => {
  it("месяцы до года, родительный падеж после года", () => {
    expect(fromAgeLabel(6)).toBe("с 6 мес");
    expect(fromAgeLabel(12)).toBe("с 1 года");
    expect(fromAgeLabel(36)).toBe("с 3 лет");
  });
});

describe("fromAgeLabel — английский", () => {
  it("месяцы и годы с правильным числом", () => {
    expect(fromAgeLabel(6, "en")).toBe("from 6 months");
    expect(fromAgeLabel(12, "en")).toBe("from 1 year");
    expect(fromAgeLabel(36, "en")).toBe("from 3 years");
  });
});

describe("fromAgeLabel — тайский", () => {
  it("месяцы (เดือน) и детские годы (ขวบ)", () => {
    expect(fromAgeLabel(6, "th")).toBe("ตั้งแต่ 6 เดือน");
    expect(fromAgeLabel(12, "th")).toBe("ตั้งแต่ 1 ขวบ");
    expect(fromAgeLabel(36, "th")).toBe("ตั้งแต่ 3 ขวบ");
  });
});

describe("formatAgeRange — тайский", () => {
  it("ไม่เกิน / ตั้งแต่ / полный диапазон", () => {
    expect(formatAgeRange(null, 36, "th")).toBe("ไม่เกิน 3 ขวบ");
    expect(formatAgeRange(36, null, "th")).toBe("ตั้งแต่ 3 ขวบ");
    expect(formatAgeRange(4, 144, "th")).toBe("4 เดือน – 12 ขวบ");
    expect(formatAgeRange(null, null, "th")).toBeNull();
  });
});

describe("formatAgeRange — английский", () => {
  it("up to / from / полный диапазон", () => {
    expect(formatAgeRange(null, 36, "en")).toBe("up to 3 years");
    expect(formatAgeRange(36, null, "en")).toBe("from 3 years");
    expect(formatAgeRange(4, 144, "en")).toBe("4 months – 12 years");
    expect(formatAgeRange(12, 24, "en")).toBe("1 year – 2 years");
    expect(formatAgeRange(null, null, "en")).toBeNull();
  });
});

describe("formatAgeRange (возраст занятия)", () => {
  it("нет данных → null (секция не показывается)", () => {
    expect(formatAgeRange(null, null)).toBeNull();
  });

  it("только потолок → «до N»", () => {
    expect(formatAgeRange(null, 36)).toBe("до 3 лет");
    expect(formatAgeRange(0, 36)).toBe("до 3 лет");
    expect(formatAgeRange(null, 12)).toBe("до 1 года");
  });

  it("только нижняя граница → «от N»", () => {
    expect(formatAgeRange(36, null)).toBe("от 3 лет");
  });

  it("полный диапазон, месяцы и склонения лет", () => {
    expect(formatAgeRange(4, 144)).toBe("4 мес – 12 лет");
    expect(formatAgeRange(12, 24)).toBe("1 год – 2 года");
  });
});
