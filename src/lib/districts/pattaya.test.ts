import { describe, expect, it } from "vitest";
import { PATTAYA_DISTRICTS } from "@/lib/districts/pattaya";
import { getCityDistrictDefinitions } from "@/lib/districts/city-districts";
import { isPointInPolygon, resolveDistrictSlug } from "@/lib/districts/resolve-district";

function resolve(latitude: number, longitude: number): string | null {
  return resolveDistrictSlug(latitude, longitude, PATTAYA_DISTRICTS);
}

describe("районы Паттайи — справочник", () => {
  it("список решения 10.10 — 12 районов: побережье с севера на юг, потом восток", () => {
    expect(PATTAYA_DISTRICTS.map((d) => d.name)).toEqual([
      "Наклуа и Вонгамат",
      "Северная Паттайя",
      "Центральная Паттайя",
      "Южная Паттайя",
      "Пратамнак",
      "Джомтьен",
      "На Джомтьен",
      "Банг Сарай",
      "Восточная Паттайя",
      "Siam Country Club",
      "Мабпрачан",
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

  it("внутри города нет дыр: каждая точка попадает в какой-то район", () => {
    // от Банг Сарая до Наклуа и от моря до восточного берега Мабпрачана
    const holes: string[] = [];
    for (let lat = 12.7403; lat < 12.975; lat += 0.0009) {
      for (let lng = 100.8103; lng < 101.0; lng += 0.0009) {
        if (resolve(lat, lng) === null) {
          holes.push(`${lat.toFixed(4)},${lng.toFixed(4)}`);
        }
      }
    }
    expect(holes).toEqual([]);
  });

  it("город без районов — пустой список", () => {
    expect(getCityDistrictDefinitions("pattaya")).toBe(PATTAYA_DISTRICTS);
    expect(getCityDistrictDefinitions("hua-hin")).toEqual([]);
  });
});

describe("районы Паттайи — места из каталога и ориентиры", () => {
  it.each([
    // каталог
    ["Terminal 21", 12.9498756, 100.8897673, "north-pattaya"],
    ["Lotus's North", 12.9508423, 100.8933732, "north-pattaya"],
    ["LariDea Kids' Café", 12.9517251, 100.8891907, "north-pattaya"],
    ["Central Festival", 12.9343, 100.8838, "central-pattaya"],
    ["Gaya Wellness Studio", 12.9328173, 100.8973319, "central-pattaya"],
    [
      "The Little Gym (Numchai, восточная сторона Сукхумвита)",
      12.9337251,
      100.9042526,
      "central-pattaya",
    ],
    ["Lotus's South", 12.9065193, 100.8948078, "south-pattaya"],
    ["Winter Wonderland", 12.8671072, 100.9043178, "na-jomtien"],
    ["The Play Barn", 12.9180161, 100.9727834, "siam-country-club"],
    ["Pattaya City Park", 12.8854685, 100.9221101, "east-pattaya"],
    // ориентиры
    ["Sanctuary of Truth", 12.9727, 100.889, "naklua-wongamat"],
    ["Central Marina", 12.9455, 100.8902, "north-pattaya"],
    [
      "Harbor Pattaya — та же Центральная улица, другая сторона",
      12.9333,
      100.8973,
      "central-pattaya",
    ],
    ["Walking Street", 12.9262, 100.8729, "south-pattaya"],
    ["Причал Бали Хай", 12.9254, 100.8678, "south-pattaya"],
    ["Outlet Mall на Тепразите", 12.908, 100.8953, "south-pattaya"],
    ["Холм Пратамнак", 12.913, 100.866, "pratumnak"],
    ["Пляж Джомтьен", 12.885, 100.872, "jomtien"],
    ["Плавучий рынок", 12.8678, 100.905, "na-jomtien"],
    ["Ocean Marina", 12.8279, 100.9102, "na-jomtien"],
    ["Columbia Pictures Aquaverse", 12.7844, 100.9142, "na-jomtien"],
    ["Нонг Нуч", 12.7647, 100.9345, "na-jomtien"],
    ["Ramayana Water Park", 12.751, 100.9621, "na-jomtien"],
    ["Silverlake", 12.7604, 100.9642, "na-jomtien"],
    ["Пляж Банг Сарай", 12.7675, 100.8954, "bang-saray"],
    ["Бухта Банг Сарай", 12.737, 100.906, "bang-saray"],
    ["Кхао Тало (школа Tara Pattana)", 12.9069, 100.9239, "east-pattaya"],
    ["Тунг Клом — Тал Ман", 12.9005, 100.9099, "east-pattaya"],
    ["Нерн Плаб Ван", 12.9272, 100.9179, "east-pattaya"],
    ["Сой 28 на дороге Siam Country Club", 12.9245, 100.9505, "siam-country-club"],
    ["Horseshoe Point", 12.9062, 100.9746, "siam-country-club"],
    ["Поле Siam Country Club Old Course", 12.9106, 100.9839, "siam-country-club"],
    ["Озеро Мабпрачан", 12.9349, 100.9651, "mabprachan"],
    ["Regents International School", 12.9689, 100.974, "mabprachan"],
    ["Храм Хуай Яй", 12.8555, 100.9365, "huay-yai"],
    ["Phoenix Golf", 12.8181, 100.9527, "huay-yai"],
  ])("%s → %s", (_name, latitude, longitude, slug) => {
    expect(resolve(latitude, longitude)).toBe(slug);
  });

  it("за пределами города — без района", () => {
    expect(resolve(13.7563, 100.5018)).toBeNull(); // Бангкок
    expect(resolve(12.65, 100.95)).toBeNull(); // Саттахип
    expect(resolve(12.99, 100.97)).toBeNull(); // севернее Мабпрачана
  });
});
