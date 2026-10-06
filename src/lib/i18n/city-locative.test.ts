import { describe, expect, it } from "vitest";
import { cityLocativeRu } from "@/lib/i18n/city-locative";

describe("cityLocativeRu", () => {
  it("известные города склоняются с нужным предлогом", () => {
    expect(cityLocativeRu("Паттайя")).toBe("в Паттайе");
    expect(cityLocativeRu("Пхукет")).toBe("на Пхукете");
    expect(cityLocativeRu(" Бангкок ")).toBe("в Бангкоке");
  });

  it("незнакомый город — «в {имя}» без угадывания окончания", () => {
    expect(cityLocativeRu("Районг")).toBe("в Районг");
  });
});
