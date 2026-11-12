import { describe, expect, it } from "vitest";
import {
  countByVisibility,
  filterAdminItems,
  firstParam,
  matchesQuery,
  normalizeSearch,
  parseVisibility,
  type AdminListItem,
} from "./list-search";

function item(name: string, hidden = false, extra = ""): AdminListItem {
  return {
    id: name,
    href: `/admin/places/${name}`,
    name,
    meta: "",
    hidden,
    searchText: `${name} ${extra}`,
  };
}

const ITEMS = [
  item("Skoop Beach Café", true, "skoop-beach-cafe Na Jomtien Soi 4"),
  item("Skippy Land · Lotus's South", false, "skippy-land-lotus-south"),
  item("Ёлочный базар", false, "elochnyi-bazar"),
  item("สวนไดโนเสาร์พัทยา Pattaya Dinosaur Kingdom", true),
];

describe("normalizeSearch", () => {
  it("убирает регистр, диакритику, «ё» и лишние пробелы", () => {
    expect(normalizeSearch("  Skoop   Beach CAFÉ ")).toBe("skoop beach cafe");
    expect(normalizeSearch("Ёлка")).toBe("елка");
  });
});

describe("matchesQuery", () => {
  it("пустой запрос подходит всем", () => {
    expect(matchesQuery("что угодно", "   ")).toBe(true);
  });

  it("нужны все слова запроса, в любом порядке и по частям", () => {
    expect(matchesQuery("Skoop Beach Café", "cafe sko")).toBe(true);
    expect(matchesQuery("Skoop Beach Café", "skoop pool")).toBe(false);
  });

  it("находит по тайскому названию", () => {
    expect(matchesQuery("สวนไดโนเสาร์พัทยา", "ไดโนเสาร์")).toBe(true);
  });
});

describe("filterAdminItems", () => {
  it("ищет и по slug и адресу, а не только по названию", () => {
    expect(filterAdminItems(ITEMS, "jomtien", "all").map((i) => i.id)).toEqual([
      "Skoop Beach Café",
    ]);
  });

  it("«ё» в запросе и в названии — одно и то же", () => {
    expect(filterAdminItems(ITEMS, "елочный", "all")).toHaveLength(1);
  });

  it("фильтр «скрытые» и «на сайте» вместе с поиском", () => {
    expect(filterAdminItems(ITEMS, "", "hidden")).toHaveLength(2);
    expect(filterAdminItems(ITEMS, "", "live")).toHaveLength(2);
    expect(filterAdminItems(ITEMS, "skoop", "live")).toEqual([]);
  });
});

describe("parseVisibility и countByVisibility", () => {
  it("незнакомое значение в адресе — «все»", () => {
    expect(parseVisibility("hidden")).toBe("hidden");
    expect(parseVisibility("whatever")).toBe("all");
    expect(parseVisibility(null)).toBe("all");
  });

  it("считает записи в каждом фильтре", () => {
    expect(countByVisibility(ITEMS)).toEqual({ all: 4, live: 2, hidden: 2 });
  });
});

describe("firstParam", () => {
  it("берёт первое значение или пустую строку", () => {
    expect(firstParam("skoop")).toBe("skoop");
    expect(firstParam(["a", "b"])).toBe("a");
    expect(firstParam(undefined)).toBe("");
  });
});
