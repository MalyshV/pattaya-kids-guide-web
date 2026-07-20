import { describe, expect, it } from "vitest";
import { detectPreferredLang } from "./detect-lang";

describe("detectPreferredLang", () => {
  it("сохранённый выбор (cookie) главнее языка браузера", () => {
    expect(detectPreferredLang("en", "th-TH,th;q=0.9")).toBe("en");
    expect(detectPreferredLang("th", "ru-RU,ru;q=0.9")).toBe("th");
  });

  it("битый/чужой cookie игнорируется — падаем на браузер", () => {
    expect(detectPreferredLang("zz", "th-TH,th;q=0.9")).toBe("th");
    expect(detectPreferredLang("", "en-US")).toBe("en");
  });

  it("язык браузера: первый поддерживаемый по весу q", () => {
    expect(detectPreferredLang(undefined, "th-TH,th;q=0.9,en;q=0.8")).toBe("th");
    expect(detectPreferredLang(undefined, "en-GB,en;q=0.9")).toBe("en");
    // ru явно тяжелее en
    expect(detectPreferredLang(undefined, "en;q=0.5,ru;q=0.9")).toBe("ru");
  });

  it("непонятный язык браузера → русский по умолчанию", () => {
    expect(detectPreferredLang(undefined, "fr-FR,fr;q=0.9,de;q=0.8")).toBe("ru");
    expect(detectPreferredLang(undefined, "")).toBe("ru");
    expect(detectPreferredLang(undefined, null)).toBe("ru");
  });

  it("регистр и подтеги не мешают: EN-us → en, TH → th", () => {
    expect(detectPreferredLang(undefined, "EN-us")).toBe("en");
    expect(detectPreferredLang(undefined, "TH")).toBe("th");
  });
});
