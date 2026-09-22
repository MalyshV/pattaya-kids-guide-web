import { describe, expect, it } from "vitest";
import { parseListView, viewHref } from "@/lib/params/view-href";

describe("viewHref — переключатель «Список | Карта»", () => {
  it("карта: фильтры сохраняются, page уходит", () => {
    expect(
      viewHref("/ru/pattaya/events", { type: "upcoming", age: "1-3", page: "2" }, "map"),
    ).toBe("/ru/pattaya/events?type=upcoming&age=1-3&view=map");
  });

  it("список: view убирается, пустые значения не пишутся", () => {
    expect(
      viewHref("/ru/pattaya/events", { type: undefined, view: "map", age: "" }, "list"),
    ).toBe("/ru/pattaya/events");
  });

  it("неизвестный вид — список", () => {
    expect(parseListView("map")).toBe("map");
    expect(parseListView("grid")).toBe("list");
    expect(parseListView(undefined)).toBe("list");
  });
});
