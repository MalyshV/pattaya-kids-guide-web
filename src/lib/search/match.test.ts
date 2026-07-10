import { describe, expect, it } from "vitest";
import { normalizeSearchText, scoreMatch, searchItems } from "./match";

function item(name: string, extra = ""): { name: string; searchText: string } {
  return { name, searchText: `${name} ${extra}` };
}

describe("normalizeSearchText", () => {
  it("нижний регистр, свёртка диакритики, лишние пробелы", () => {
    // NFKD раскладывает и й→и, и ё→е: симметрично для запроса и текста,
    // поэтому «новый» находит «новыи» и наоборот — матчинг консистентен
    expect(normalizeSearchText("  Ёлка   Новый  Год ")).toBe("елка новыи год");
    expect(normalizeSearchText("Café")).toBe("cafe");
  });
});

describe("scoreMatch", () => {
  it("однобуквенный запрос не совпадает ни с чем", () => {
    expect(scoreMatch(item("Little Gym"), normalizeSearchText("l"))).toBe(0);
  });

  it("многословный запрос из однобуквенных слов — тоже шум, не совпадает", () => {
    expect(scoreMatch(item("Little Gym"), normalizeSearchText("а и"))).toBe(0);
  });

  it("префикс названия — высший балл", () => {
    expect(scoreMatch(item("Little Gym"), "little")).toBe(4);
  });

  it("вхождение в название целиком — выше, чем по словам", () => {
    expect(scoreMatch(item("The Little Gym"), "little")).toBe(3);
  });

  it("все слова в названии, но не подряд — выше совпадения по категориям", () => {
    expect(scoreMatch(item("The Little Gym Pattaya"), "little pattaya")).toBe(2);
  });

  it("совпадение только по категориям/месту — базовый", () => {
    expect(scoreMatch(item("Play Barn", "батуты игровая"), "батуты")).toBe(1);
  });

  it("все слова запроса обязаны найтись (И, а не ИЛИ)", () => {
    expect(scoreMatch(item("Play Barn", "батуты"), "батуты кафе")).toBe(0);
  });

  it("регистр и ё не мешают", () => {
    expect(scoreMatch(item("Ёлка-парк"), normalizeSearchText("елка"))).toBe(4);
  });

  it("диакритика сворачивается: «cafe» находит «Café»", () => {
    expect(scoreMatch(item("LariDea Kids' Café"), normalizeSearchText("cafe"))).toBe(3);
    // и наоборот: запрос с акцентом находит текст без него
    expect(scoreMatch(item("Cafe Kids"), normalizeSearchText("café"))).toBe(4);
  });
});

describe("searchItems", () => {
  const catalog = [
    item("The Little Gym", "гимнастика спорт"),
    item("LariDea Kids' Café", "кафе игровая"),
    item("Play Barn", "игровая батуты кафе"),
    item("Gymnastics for kids", "The Little Gym спорт"),
  ];

  it("релевантные выше: префикс > вхождение > категории", () => {
    const results = searchItems(catalog, "gym");
    expect(results.map((r) => r.name)).toEqual(["Gymnastics for kids", "The Little Gym"]);
  });

  it("поиск по категории находит место", () => {
    const results = searchItems(catalog, "батуты");
    expect(results.map((r) => r.name)).toEqual(["Play Barn"]);
  });

  it("многословный запрос: слова в имени места важнее совпадения по searchText", () => {
    const pair = [
      item("Gymnastics for kids", "The Little Gym Pattaya спорт"),
      item("The Little Gym Pattaya", "гимнастика спорт"),
    ];
    const results = searchItems(pair, "little pattaya");
    expect(results.map((r) => r.name)).toEqual([
      "The Little Gym Pattaya",
      "Gymnastics for kids",
    ]);
  });

  it("пустой и короткий запрос — пусто", () => {
    expect(searchItems(catalog, "")).toEqual([]);
    expect(searchItems(catalog, "g")).toEqual([]);
  });

  it("limit ограничивает выдачу", () => {
    const many = Array.from({ length: 20 }, (_, i) => item(`Кафе ${i + 1}`));
    expect(searchItems(many, "кафе", 8)).toHaveLength(8);
  });

  it("не мутирует исходный массив", () => {
    const before = [...catalog];
    searchItems(catalog, "gym");
    expect(catalog).toEqual(before);
  });
});
