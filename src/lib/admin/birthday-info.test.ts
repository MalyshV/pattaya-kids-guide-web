import { describe, expect, it } from "vitest";
import {
  parseBirthdayForm,
  parseWholeNumber,
  type BirthdayFormRaw,
} from "./birthday-info";

const base: BirthdayFormRaw = {
  enabled: true,
  hasPackages: false,
  minGuests: "",
  maxGuests: "",
  depositRequired: "",
  preBookingDays: "",
  notes: "",
  notesEn: "",
};

describe("parseWholeNumber", () => {
  it("разбирает целые и обрезает пробелы", () => {
    expect(parseWholeNumber(" 12 ", 1)).toBe(12);
    expect(parseWholeNumber("0", 0)).toBe(0);
  });

  it("пусто, мусор, дроби, отрицательные → null", () => {
    for (const raw of ["", "  ", "abc", "12abc", "1.5", "1,5", "-3", "NaN", "1e3"]) {
      expect(parseWholeNumber(raw, 0)).toBeNull();
    }
  });

  it("ниже минимума → null", () => {
    expect(parseWholeNumber("0", 1)).toBeNull();
  });
});

describe("parseBirthdayForm", () => {
  it("чекбокс снят → запись удаляется (info: null)", () => {
    expect(parseBirthdayForm({ ...base, enabled: false, minGuests: "5" })).toEqual({
      ok: true,
      info: null,
    });
  });

  it("пустые поля → null, залог «уточняется»", () => {
    expect(parseBirthdayForm(base)).toEqual({
      ok: true,
      info: {
        hasPackages: false,
        minGuests: null,
        maxGuests: null,
        depositRequired: null,
        preBookingDays: null,
        notes: null,
        notesEn: null,
      },
    });
  });

  it("разбирает заполненную форму", () => {
    expect(
      parseBirthdayForm({
        enabled: true,
        hasPackages: true,
        minGuests: "5",
        maxGuests: "20",
        depositRequired: "true",
        preBookingDays: "3",
        notes: " Торт можно свой ",
        notesEn: "Own cake is fine",
      }),
    ).toEqual({
      ok: true,
      info: {
        hasPackages: true,
        minGuests: 5,
        maxGuests: 20,
        depositRequired: true,
        preBookingDays: 3,
        notes: "Торт можно свой",
        notesEn: "Own cake is fine",
      },
    });
  });

  it("залог «нет» — это false, а не null", () => {
    const result = parseBirthdayForm({ ...base, depositRequired: "false" });
    expect(result.ok && result.info?.depositRequired).toBe(false);
  });

  it("мусор и отрицательные числа → null", () => {
    const result = parseBirthdayForm({
      ...base,
      minGuests: "-5",
      maxGuests: "много",
      preBookingDays: "2 дня",
    });
    expect(result).toMatchObject({
      ok: true,
      info: { minGuests: null, maxGuests: null, preBookingDays: null },
    });
  });

  it("minGuests > maxGuests → ошибка guests", () => {
    expect(parseBirthdayForm({ ...base, minGuests: "20", maxGuests: "5" })).toEqual({
      ok: false,
      error: "guests",
    });
  });

  it("minGuests = maxGuests допустимо; одно из двух — тоже", () => {
    expect(parseBirthdayForm({ ...base, minGuests: "8", maxGuests: "8" }).ok).toBe(true);
    expect(parseBirthdayForm({ ...base, minGuests: "30" }).ok).toBe(true);
  });
});
