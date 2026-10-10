import { describe, expect, it } from "vitest";
import { PATTAYA_DISTRICTS } from "@/lib/districts/pattaya";
import { getCityDistrictDefinitions } from "@/lib/districts/city-districts";
import { isPointInPolygon, resolveDistrictSlug } from "@/lib/districts/resolve-district";

function resolve(latitude: number, longitude: number): string | null {
  return resolveDistrictSlug(latitude, longitude, PATTAYA_DISTRICTS);
}

describe("районы Паттайи — справочник", () => {
  it("рабочий список решения 10.10 — 11 районов", () => {
    expect(PATTAYA_DISTRICTS.map((d) => d.name)).toEqual([
      "Наклуа и Вонгамат",
      "Северная",
      "Центральная",
      "Южная",
      "Пратамнак",
      "Джомтьен",
      "На Джомтьен",
      "Банг Сарай",
      "Мабпрачан",
      "Siam Country Club",
      "Хуай Яй",
    ]);
  });

  it("slug и порядок уникальны, названия на трёх языках заполнены", () => {
    const slugs = PATTAYA_DISTRICTS.map((d) => d.slug);
    const orders = PATTAYA_DISTRICTS.map((d) => d.order);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(orders).size).toBe(orders.length);
    for (const d of PATTAYA_DISTRICTS) {
      expect(d.slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(d.name.trim()).not.toBe("");
      expect(d.nameEn.trim()).not.toBe("");
      expect(d.nameTh.trim()).not.toBe("");
      expect(d.boundary.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("районы не налезают друг на друга", () => {
    // сетка ~100 м по всему городу; шаг со сдвигом, чтобы не попадать
    // ровно на общие границы (там точка честно достаётся первому району)
    const overlaps: string[] = [];
    for (let lat = 12.6803; lat < 13.01; lat += 0.0009) {
      for (let lng = 100.8103; lng < 101.06; lng += 0.0009) {
        const hits = PATTAYA_DISTRICTS.filter((d) =>
          isPointInPolygon(lat, lng, d.boundary),
        );
        if (hits.length > 1) {
          overlaps.push(
            `${lat.toFixed(4)},${lng.toFixed(4)}: ${hits.map((d) => d.slug)}`,
          );
        }
      }
    }
    expect(overlaps).toEqual([]);
  });

  it("город без районов — пустой список", () => {
    expect(getCityDistrictDefinitions("pattaya")).toBe(PATTAYA_DISTRICTS);
    expect(getCityDistrictDefinitions("hua-hin")).toEqual([]);
  });
});

describe("районы Паттайи — места из каталога", () => {
  it.each([
    ["Terminal 21", 12.9498756, 100.8897673, "north-pattaya"],
    ["Lotus's North", 12.9508423, 100.8933732, "north-pattaya"],
    ["LariDea Kids' Café", 12.9517251, 100.8891907, "north-pattaya"],
    ["Central Festival", 12.9343, 100.8838, "central-pattaya"],
    ["Gaya Wellness Studio", 12.9328173, 100.8973319, "central-pattaya"],
    ["Lotus's South", 12.9065193, 100.8948078, "south-pattaya"],
    ["Winter Wonderland", 12.8671072, 100.9043178, "na-jomtien"],
    ["The Play Barn", 12.9180161, 100.9727834, "siam-country-club"],
    ["Sanctuary of Truth", 12.9727, 100.889, "naklua-wongamat"],
    ["Пляж Джомтьен", 12.885, 100.872, "jomtien"],
    ["Холм Пратамнак", 12.913, 100.866, "pratumnak"],
    ["Бухта Банг Сарай", 12.737, 100.906, "bang-saray"],
    ["Ramayana Water Park", 12.77, 100.958, "huay-yai"],
  ])("%s → %s", (_name, latitude, longitude, slug) => {
    expect(resolve(latitude, longitude)).toBe(slug);
  });

  it("полоса за Сукхумвитом (открытый вопрос) пока без района", () => {
    // Pattaya City Park — между трассой и Siam Country Club
    expect(resolve(12.8854685, 100.9221101)).toBeNull();
  });

  it("за пределами города — без района", () => {
    expect(resolve(13.7563, 100.5018)).toBeNull(); // Бангкок
    expect(resolve(12.65, 100.95)).toBeNull(); // Саттахип
  });
});
