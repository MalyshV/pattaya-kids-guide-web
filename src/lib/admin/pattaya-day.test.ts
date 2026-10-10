import { describe, expect, it } from "vitest";
import { parsePattayaDay, pattayaDayInputValue } from "@/lib/admin/pattaya-day";

describe("день без времени в формах админки — по Паттайе", () => {
  it("разбор: полночь Паттайи, это 17:00 предыдущего дня по UTC", () => {
    expect(parsePattayaDay("2026-07-01")?.toISOString()).toBe("2026-06-30T17:00:00.000Z");
  });

  it("разбор: пусто и мусор — null", () => {
    expect(parsePattayaDay("")).toBeNull();
    expect(parsePattayaDay("01.07.2026")).toBeNull();
    expect(parsePattayaDay("2026-13-40")).toBeNull();
  });

  it("поле формы показывает день Паттайи, а не день по UTC", () => {
    expect(pattayaDayInputValue(new Date("2026-06-30T17:00:00.000Z"))).toBe("2026-07-01");
  });

  it("поле формы: дата строкой из кэша, пусто и мусор", () => {
    expect(pattayaDayInputValue("2026-06-30T17:00:00.000Z")).toBe("2026-07-01");
    expect(pattayaDayInputValue(null)).toBe("");
    expect(pattayaDayInputValue(undefined)).toBe("");
    expect(pattayaDayInputValue("не дата")).toBe("");
  });

  it("сохранение формы не сдвигает дату: разбор → поле → разбор", () => {
    const saved = parsePattayaDay("2026-07-01");
    const shown = pattayaDayInputValue(saved);
    expect(shown).toBe("2026-07-01");
    expect(parsePattayaDay(shown)?.getTime()).toBe(saved?.getTime());
  });
});
