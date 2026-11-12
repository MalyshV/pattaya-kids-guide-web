import { describe, expect, it } from "vitest";
import { listHref } from "./list-href";

describe("listHref", () => {
  it("без параметров — чистый путь", () => {
    expect(listHref("/ru/pattaya/places", {})).toBe("/ru/pattaya/places");
  });

  it("пропускает пустые значения и page", () => {
    expect(
      listHref("/ru/pattaya/places", {
        age: "3-6",
        category: "cafe",
        district: undefined,
        indoor: "",
        page: "3",
      }),
    ).toBe("/ru/pattaya/places?age=3-6&category=cafe");
  });

  it("добавляет якорь в конец", () => {
    expect(listHref("/ru/pattaya/places", { category: "cafe" }, "place-type")).toBe(
      "/ru/pattaya/places?category=cafe#place-type",
    );
    expect(listHref("/ru/pattaya/places", {}, "place-type")).toBe(
      "/ru/pattaya/places#place-type",
    );
  });

  it("кодирует значения", () => {
    expect(listHref("/p", { category: "a b&c" })).toBe("/p?category=a+b%26c");
  });
});
