import { describe, expect, it } from "vitest";
import { formatAge, formatAgeRange, fromAgeLabel } from "./format-age";

describe("fromAgeLabel («можно оставить с…»)", () => {
  it("месяцы до года, родительный падеж после года", () => {
    expect(fromAgeLabel(6)).toBe("с 6 мес");
    expect(fromAgeLabel(12)).toBe("с 12 мес");
    expect(fromAgeLabel(24)).toBe("с 2 лет");
    expect(fromAgeLabel(36)).toBe("с 3 лет");
  });
});

describe("fromAgeLabel — английский", () => {
  it("месяцы и годы с правильным числом", () => {
    expect(fromAgeLabel(6, "en")).toBe("from 6 months");
    expect(fromAgeLabel(12, "en")).toBe("from 12 months");
    expect(fromAgeLabel(36, "en")).toBe("from 3 years");
  });
});

describe("fromAgeLabel — тайский", () => {
  it("месяцы (เดือน) и детские годы (ขวบ)", () => {
    expect(fromAgeLabel(6, "th")).toBe("ตั้งแต่ 6 เดือน");
    expect(fromAgeLabel(12, "th")).toBe("ตั้งแต่ 12 เดือน");
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
    expect(formatAgeRange(12, 24, "en")).toBe("12 months – 2 years");
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
    expect(formatAgeRange(null, 12)).toBe("до 12 мес");
  });

  it("только нижняя граница → «от N»", () => {
    expect(formatAgeRange(36, null)).toBe("от 3 лет");
  });

  it("полный диапазон, месяцы и склонения лет", () => {
    expect(formatAgeRange(4, 144)).toBe("4 мес – 12 лет");
    expect(formatAgeRange(12, 24)).toBe("12 мес – 2 года");
  });
});

describe("formatAge — месяцы до 2 лет, дальше годы", () => {
  it("до 24 месяцев — месяцы", () => {
    expect(formatAge(0)).toBe("0 мес");
    expect(formatAge(6)).toBe("6 мес");
    expect(formatAge(18)).toBe("18 мес");
    expect(formatAge(23)).toBe("23 мес");
  });

  it("с 2 лет — годы со склонением", () => {
    expect(formatAge(24)).toBe("2 года");
    expect(formatAge(60)).toBe("5 лет");
    expect(formatAge(120)).toBe("10 лет");
    expect(formatAge(252)).toBe("21 год");
  });

  it("полтора года — через запятую, без «лет»", () => {
    expect(formatAge(30)).toBe("2,5 года");
    expect(formatAge(66)).toBe("5,5 года");
  });

  it("прочие месяцы — год и месяцы, без округления", () => {
    expect(formatAge(27)).toBe("2 года 3 мес");
    expect(formatAge(40)).toBe("3 года 4 мес");
  });

  it("английский и тайский", () => {
    expect(formatAge(18, "en")).toBe("18 months");
    expect(formatAge(30, "en")).toBe("2.5 years");
    expect(formatAge(27, "en")).toBe("2 years 3 months");
    expect(formatAge(30, "th")).toBe("2.5 ขวบ");
    expect(formatAge(27, "th")).toBe("2 ขวบ 3 เดือน");
  });
});

describe("родительный падеж после «от»/«до»", () => {
  it("целые, полтора, год + месяцы", () => {
    expect(formatAgeRange(30, null)).toBe("от 2,5 года");
    expect(formatAgeRange(null, 27)).toBe("до 2 лет 3 мес");
    expect(formatAgeRange(252, null)).toBe("от 21 года");
  });
});
