import { describe, expect, it } from "vitest";
import {
  hasItem,
  listByKind,
  MAX_ITEMS,
  parseStored,
  removeItem,
  serialize,
  toggleItem,
  type MemoryItem,
} from "./parent-memory";

function item(overrides: Partial<MemoryItem> = {}): MemoryItem {
  return {
    entity: "place",
    city: "pattaya",
    slug: "laridea",
    kind: "saved",
    name: "LariDea",
    imageUrl: "/images/places/laridea.jpg",
    savedAt: 1000,
    ...overrides,
  };
}

describe("toggleItem", () => {
  it("добавляет новую запись в начало (свежее сверху)", () => {
    const before = [item({ slug: "a", savedAt: 1 })];
    const after = toggleItem(before, item({ slug: "b", savedAt: 2 }));
    expect(after).toHaveLength(2);
    expect(after[0]?.slug).toBe("b");
  });

  it("повторный toggle той же тройки — снимает", () => {
    const one = toggleItem([], item());
    expect(one).toHaveLength(1);
    const two = toggleItem(one, item());
    expect(two).toHaveLength(0);
  });

  it("saved и visited одного места — независимы (разный kind)", () => {
    const saved = toggleItem([], item({ kind: "saved" }));
    const both = toggleItem(saved, item({ kind: "visited" }));
    expect(both).toHaveLength(2);
    expect(hasItem(both, "place", "laridea", "saved", "pattaya")).toBe(true);
    expect(hasItem(both, "place", "laridea", "visited", "pattaya")).toBe(true);
  });

  it("одинаковый slug в разных городах — разные записи (slug уникален в городе)", () => {
    const a = toggleItem([], item({ city: "pattaya", slug: "play-barn" }));
    const b = toggleItem(a, item({ city: "phuket", slug: "play-barn" }));
    expect(b).toHaveLength(2);
    // снятие в одном городе не трогает другой
    const c = toggleItem(b, item({ city: "phuket", slug: "play-barn" }));
    expect(c).toHaveLength(1);
    expect(c[0]?.city).toBe("pattaya");
  });

  it("одинаковый slug у place и event — разные записи (разный entity)", () => {
    const a = toggleItem([], item({ entity: "place", slug: "x" }));
    const b = toggleItem(a, item({ entity: "event", slug: "x" }));
    expect(b).toHaveLength(2);
  });

  it("не растёт выше MAX_ITEMS (выбрасывает самое старое)", () => {
    let items: MemoryItem[] = [];
    for (let i = 0; i < MAX_ITEMS + 20; i++) {
      items = toggleItem(items, item({ slug: `p-${i}`, savedAt: i }));
    }
    expect(items).toHaveLength(MAX_ITEMS);
    // последний добавленный — на месте, самые ранние вытеснены
    expect(hasItem(items, "place", `p-${MAX_ITEMS + 19}`, "saved", "pattaya")).toBe(true);
    expect(hasItem(items, "place", "p-0", "saved", "pattaya")).toBe(false);
  });
});

describe("hasItem / removeItem", () => {
  it("hasItem различает по (kind, city, entity, slug)", () => {
    const items = [item({ kind: "saved" })];
    expect(hasItem(items, "place", "laridea", "saved", "pattaya")).toBe(true);
    expect(hasItem(items, "place", "laridea", "visited", "pattaya")).toBe(false);
    expect(hasItem(items, "activity", "laridea", "saved", "pattaya")).toBe(false);
    expect(hasItem(items, "place", "laridea", "saved", "phuket")).toBe(false);
  });

  it("removeItem убирает только совпавшую тройку", () => {
    const items = [item({ kind: "saved" }), item({ kind: "visited" })];
    const after = removeItem(items, "place", "laridea", "saved", "pattaya");
    expect(after).toHaveLength(1);
    expect(after[0]?.kind).toBe("visited");
  });
});

describe("listByKind", () => {
  it("фильтрует по виду и сортирует свежие сверху, не мутируя вход", () => {
    const items = [
      item({ slug: "a", kind: "saved", savedAt: 1 }),
      item({ slug: "b", kind: "visited", savedAt: 2 }),
      item({ slug: "c", kind: "saved", savedAt: 3 }),
    ];
    const saved = listByKind(items, "saved");
    expect(saved.map((i) => i.slug)).toEqual(["c", "a"]);
    expect(items[0]?.slug).toBe("a"); // исходный порядок цел
  });
});

describe("parseStored — терпимость к мусору", () => {
  it("null / не-JSON / не-массив → []", () => {
    expect(parseStored(null)).toEqual([]);
    expect(parseStored("не json")).toEqual([]);
    expect(parseStored('{"foo":1}')).toEqual([]);
  });

  it("битые записи выбрасываются, валидные остаются", () => {
    const raw = JSON.stringify([
      item({ slug: "ok" }),
      { entity: "place", kind: "saved" }, // нет slug/name/savedAt
      { entity: "spaceship", kind: "saved", slug: "x", name: "X", savedAt: 1 }, // чужой entity
      { entity: "place", kind: "loved", slug: "y", name: "Y", savedAt: 1 }, // чужой kind
      { entity: "place", kind: "saved", slug: "z", name: "Z", savedAt: "вчера" }, // savedAt не число
    ]);
    const parsed = parseStored(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.slug).toBe("ok");
  });

  it("дубли по ключу схлопываются (первое вхождение)", () => {
    const raw = JSON.stringify([
      item({ slug: "dup", name: "Первый" }),
      item({ slug: "dup", name: "Второй" }),
    ]);
    const parsed = parseStored(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.name).toBe("Первый");
  });

  it("старые записи без города (до мультигорода) — Паттайя, отметки не теряются", () => {
    const old = {
      entity: "place",
      slug: "laridea",
      kind: "visited",
      name: "LariDea",
      imageUrl: null,
      savedAt: 5,
    };
    const parsed = parseStored(JSON.stringify([old, { ...old, city: "" }]));
    expect(parsed).toHaveLength(1); // пустой город = тот же город по умолчанию → дубль
    expect(parsed[0]?.city).toBe("pattaya");
    expect(hasItem(parsed, "place", "laridea", "visited", "pattaya")).toBe(true);
  });

  it("город записи сохраняется при чтении", () => {
    expect(parseStored(JSON.stringify([item({ city: "phuket" })]))[0]?.city).toBe(
      "phuket",
    );
  });

  it("пустой imageUrl нормализуется в null", () => {
    const raw = JSON.stringify([item({ imageUrl: "" as unknown as string })]);
    expect(parseStored(raw)[0]?.imageUrl).toBeNull();
  });

  it("serialize → parseStored — круговая устойчивость", () => {
    const items = [item({ slug: "a" }), item({ slug: "b", kind: "visited" })];
    expect(parseStored(serialize(items))).toEqual(items);
  });
});
