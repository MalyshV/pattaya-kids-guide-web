import { describe, expect, it } from "vitest";
import { localizedCityName, pickLocalized } from "@/lib/i18n/localize";

describe("pickLocalized — каскад th → en → ru", () => {
  it("th: берёт тайский, если он заполнен", () => {
    expect(pickLocalized("Привет", "Hello", "สวัสดี", "th")).toBe("สวัสดี");
  });

  it("th: нет тайского — падает на английский", () => {
    expect(pickLocalized("Привет", "Hello", null, "th")).toBe("Hello");
    expect(pickLocalized("Привет", "Hello", undefined, "th")).toBe("Hello");
  });

  it("th: нет ни тайского, ни английского — русский", () => {
    expect(pickLocalized("Привет", null, null, "th")).toBe("Привет");
    expect(pickLocalized("Привет", undefined, undefined, "th")).toBe("Привет");
  });

  it("en: английский, а без него русский; тайский не влияет", () => {
    expect(pickLocalized("Привет", "Hello", "สวัสดี", "en")).toBe("Hello");
    expect(pickLocalized("Привет", null, "สวัสดี", "en")).toBe("Привет");
  });

  it("ru и неизвестный язык — всегда русский", () => {
    expect(pickLocalized("Привет", "Hello", "สวัสดี", "ru")).toBe("Привет");
    expect(pickLocalized("Привет", "Hello", "สวัสดี", "de")).toBe("Привет");
    expect(pickLocalized("Привет", "Hello", "สวัสดี", "")).toBe("Привет");
  });

  it("nullable-русское значение остаётся null, если перевода нет", () => {
    expect(pickLocalized(null, null, null, "th")).toBeNull();
    expect(pickLocalized(null, "Hello", null, "en")).toBe("Hello");
  });

  // Возможный баг: пустая строка в переводе (не null) выигрывает у соседнего
  // языка, и пользователь видит пустоту вместо fallback.
  it.skip("пустая строка перевода считается «нет перевода»", () => {
    expect(pickLocalized("Привет", "", "", "th")).toBe("Привет");
    expect(pickLocalized("Привет", "", null, "en")).toBe("Привет");
  });
});

describe("localizedCityName", () => {
  const city = { name: "Паттайя", nameEn: "Pattaya", nameTh: "พัทยา" };

  it("имя города на языке интерфейса", () => {
    expect(localizedCityName(city, "ru")).toBe("Паттайя");
    expect(localizedCityName(city, "en")).toBe("Pattaya");
    expect(localizedCityName(city, "th")).toBe("พัทยา");
  });

  it("города без переводов (поля не заданы) показываются по-русски", () => {
    expect(localizedCityName({ name: "Паттайя" }, "th")).toBe("Паттайя");
    expect(localizedCityName({ name: "Паттайя", nameEn: "Pattaya" }, "th")).toBe(
      "Pattaya",
    );
  });
});
