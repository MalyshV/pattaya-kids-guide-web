import { describe, expect, it } from "vitest";
import { placeHasCategory } from "./place-category";

const cafe = { category: { slug: "cafe" } };
const playground = { category: { slug: "playground" } };

describe("placeHasCategory", () => {
  it("совпадает по slug любой из категорий места", () => {
    expect(placeHasCategory({ categories: [playground, cafe] }, "cafe")).toBe(true);
  });

  it("не совпадает с чужой категорией", () => {
    expect(placeHasCategory({ categories: [playground] }, "cafe")).toBe(false);
  });

  it("место без категорий не совпадает", () => {
    expect(placeHasCategory({ categories: [] }, "cafe")).toBe(false);
  });

  it("старая выборка без поля categories не падает", () => {
    expect(placeHasCategory({}, "cafe")).toBe(false);
  });
});
