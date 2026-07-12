import { describe, expect, it } from "vitest";
import { parseSlugParam } from "./slug";
import { InvalidQueryParamError } from "@/lib/errors";

// parseSlugParam — входной валидатор slug из URL (/places/[slug] и т.п.),
// граница доверия к пользовательскому вводу. Покрытия не было.
describe("parseSlugParam", () => {
  it("валидный slug проходит и триммится", () => {
    expect(parseSlugParam("the-little-gym")).toBe("the-little-gym");
    expect(parseSlugParam("  play-barn  ")).toBe("play-barn");
    expect(parseSlugParam("room-101")).toBe("room-101");
    expect(parseSlugParam("abc")).toBe("abc");
  });

  it("пустая или пробельная строка → 400", () => {
    expect(() => parseSlugParam("")).toThrow(InvalidQueryParamError);
    expect(() => parseSlugParam("   ")).toThrow(InvalidQueryParamError);
  });

  it("невалидные формы → 400", () => {
    const bad = [
      "Abc", // верхний регистр
      "-abc", // ведущий дефис
      "abc-", // замыкающий дефис
      "a--b", // двойной дефис
      "a_b", // подчёркивание
      "место", // кириллица
      "a b", // пробел внутри
      "a.b", // точка
    ];
    for (const value of bad) {
      expect(() => parseSlugParam(value), value).toThrow(InvalidQueryParamError);
    }
  });
});
