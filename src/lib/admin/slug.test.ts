import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

// slugify генерит адреса страниц для новых записей из админки — регресс в
// транслитерации или в fallback давал бы битые/пустые URL, и раньше ничем
// не ловился.
describe("slugify", () => {
  it("транслитерирует кириллицу (в т.ч. многобуквенные щ/ж/х)", () => {
    expect(slugify("Щётка Ёжик")).toBe("shchetka-ezhik");
    expect(slugify("Живой уголок")).toBe("zhivoy-ugolok");
    expect(slugify("Хижина")).toBe("khizhina");
  });

  it("твёрдый и мягкий знаки выпадают", () => {
    expect(slugify("Объезд")).toBe("obezd");
    expect(slugify("Мультпарк")).toBe("multpark");
  });

  it("снимает диакритику латиницы через NFKD", () => {
    expect(slugify("Café Málaga")).toBe("cafe-malaga");
  });

  it("схлопывает пробелы/пунктуацию в дефис и обрезает по краям", () => {
    expect(slugify("  Hello,  World!  ")).toBe("hello-world");
    expect(slugify("The Little Gym — Pattaya")).toBe("the-little-gym-pattaya");
  });

  it("сохраняет цифры", () => {
    expect(slugify("Room 101")).toBe("room-101");
  });

  it("обрезает до 60 символов", () => {
    expect(slugify("a".repeat(80))).toHaveLength(60);
  });

  it("пустой результат → fallback 'item' (не пустой URL)", () => {
    expect(slugify("")).toBe("item");
    expect(slugify("!!!")).toBe("item");
    expect(slugify("的の")).toBe("item");
  });
});
