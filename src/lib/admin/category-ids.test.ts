import { describe, expect, it } from "vitest";
import { pickCategoryIds } from "./category-ids";

describe("pickCategoryIds", () => {
  const known = new Set(["music", "math", "sport"]);

  it("оставляет известные категории в исходном порядке", () => {
    expect(pickCategoryIds(["sport", "music"], known)).toEqual(["sport", "music"]);
  });

  it("убирает повторы", () => {
    expect(pickCategoryIds(["math", "math", "music"], known)).toEqual(["math", "music"]);
  });

  it("отбрасывает неизвестные id", () => {
    expect(pickCategoryIds(["math", "deleted-one", ""], known)).toEqual(["math"]);
  });

  it("пустой выбор — пустой набор", () => {
    expect(pickCategoryIds([], known)).toEqual([]);
  });
});
