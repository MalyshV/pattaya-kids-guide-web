import { describe, expect, it } from "vitest";
import { parseSavedTab, savedPageHref } from "@/lib/memory/saved-tab";

describe("parseSavedTab", () => {
  it("visited — вкладка «Уже были», остальное — «Нравится»", () => {
    expect(parseSavedTab("visited")).toBe("visited");
    expect(parseSavedTab("saved")).toBe("saved");
    expect(parseSavedTab("nonsense")).toBe("saved");
    expect(parseSavedTab("")).toBe("saved");
    expect(parseSavedTab(null)).toBe("saved");
    expect(parseSavedTab(undefined)).toBe("saved");
  });
});

describe("savedPageHref", () => {
  it("«Нравится» — адрес без параметра вкладки", () => {
    expect(savedPageHref("/ru/pattaya")).toBe("/ru/pattaya/saved");
    expect(savedPageHref("/ru/pattaya", { tab: "saved" })).toBe("/ru/pattaya/saved");
  });

  it("«Уже были» — с параметром вкладки", () => {
    expect(savedPageHref("/ru/pattaya", { tab: "visited" })).toBe(
      "/ru/pattaya/saved?tab=visited",
    );
  });

  it("возраст ребёнка сохраняется рядом с вкладкой", () => {
    expect(savedPageHref("/en/pattaya", { age: "3-6" })).toBe(
      "/en/pattaya/saved?age=3-6",
    );
    expect(savedPageHref("/en/pattaya", { age: "3-6", tab: "visited" })).toBe(
      "/en/pattaya/saved?age=3-6&tab=visited",
    );
    expect(savedPageHref("/en/pattaya", { age: null, tab: "visited" })).toBe(
      "/en/pattaya/saved?tab=visited",
    );
  });
});
