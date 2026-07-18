import { describe, expect, it } from "vitest";
import { cleanOcrText } from "./ocr-text";

describe("cleanOcrText", () => {
  it("нормализует переводы строк и лишние пробелы", () => {
    expect(cleanOcrText("KID   PILATES\r\n  SATURDAY\t18 JULY  ")).toBe(
      "KID PILATES\nSATURDAY 18 JULY",
    );
  });

  it("выбрасывает строки без букв и цифр (рамки, завитушки)", () => {
    expect(cleanOcrText("----\nKID PILATES\n| | |\n~ © ~\n699 BAHT")).toBe(
      "KID PILATES\n699 BAHT",
    );
  });

  it("сохраняет кириллицу и цифры", () => {
    expect(cleanOcrText("Детский пилатес\n18 июля 10:00")).toBe(
      "Детский пилатес\n18 июля 10:00",
    );
  });

  it("схлопывает пачки пустых строк до одной пустой", () => {
    expect(cleanOcrText("A\n\n\n\n\nB")).toBe("A\n\nB");
  });

  it("обрезает пустоту по краям", () => {
    expect(cleanOcrText("\n\n  \nA\n \n\n")).toBe("A");
  });

  it("пустой вход остаётся пустым", () => {
    expect(cleanOcrText("")).toBe("");
    expect(cleanOcrText(" \n---\n ")).toBe("");
  });
});
