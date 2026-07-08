import { describe, expect, it } from "vitest";
import { metaDescription } from "./meta";

const FALLBACK = "Спокойный гид по детским местам Паттайи.";

describe("metaDescription", () => {
  it("пусто/null/пробелы → запасной вариант", () => {
    expect(metaDescription(null, FALLBACK)).toBe(FALLBACK);
    expect(metaDescription(undefined, FALLBACK)).toBe(FALLBACK);
    expect(metaDescription("   ", FALLBACK)).toBe(FALLBACK);
  });

  it("короткий текст возвращается как есть", () => {
    expect(metaDescription("Детское кафе с игровой.", FALLBACK)).toBe(
      "Детское кафе с игровой.",
    );
  });

  it("длинный текст обрезается по границе слова с многоточием", () => {
    const long = "слово ".repeat(60).trim(); // ~360 символов
    const result = metaDescription(long, FALLBACK);

    expect(result.length).toBeLessThanOrEqual(161); // 160 + «…»
    expect(result.endsWith("…")).toBe(true);
    // не рвём слово посередине: перед «…» — целое «слово»
    expect(result.slice(0, -1).endsWith("слово")).toBe(true);
  });
});
