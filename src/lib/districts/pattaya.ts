import type { DistrictDefinition, LatLng } from "@/lib/districts/resolve-district";

/**
 * Районы Паттайи — как их называют родители, а не административное деление
 * (рабочий список — решение 10.10, docs/BACKLOG.md).
 *
 * ЧЕРНОВИК ГРАНИЦ: проведены грубо, по главным улицам, и ждут утверждения
 * на карте. Соседние районы делят общие вершины (константы ниже), поэтому
 * между ними нет щелей. Со стороны моря границы уходят далеко в воду
 * (долгота 100.80) — там мест нет, зато береговую линию не надо рисовать.
 *
 * Сознательно не покрыто (точка там — «без района»): полоса за Сукхумвитом
 * между трассой и Siam Country Club / Мабпрачаном / Хуай Яй — Кхао Тало,
 * Кхао Ной, Нерн Плаб Ван, Нонг Прю у трассы. Что с ней делать — открытый
 * вопрос, до решения она честно остаётся без района.
 */

/** Западный край — уже в море. */
const SEA = 100.8;

/** Сукхумвит (трасса 3) с севера на юг — граница прибрежных районов. */
const SUKHUMVIT_NORTH: LatLng = [13.0, 100.915];
const SUKHUMVIT_NORTH_ROAD: LatLng = [12.955, 100.906];
const SUKHUMVIT_CENTRAL_ROAD: LatLng = [12.936, 100.905];
const SUKHUMVIT_SOUTH_ROAD: LatLng = [12.925, 100.905];
const SUKHUMVIT_THEPPRASIT: LatLng = [12.905, 100.907];
const SUKHUMVIT_NA_JOMTIEN: LatLng = [12.87, 100.907];
const SUKHUMVIT_KM_150: LatLng = [12.83, 100.912];
const SUKHUMVIT_OCEAN_MARINA: LatLng = [12.8, 100.917];
const SUKHUMVIT_BANG_SARAY: LatLng = [12.76, 100.922];
const SUKHUMVIT_SOUTH: LatLng = [12.69, 100.935];

/** Холм Пратамнак: Бали Хай → Таппрайя → начало пляжа Джомтьен. */
const BALI_HAI: LatLng = [12.921, 100.874];
const THAPPRAYA_NORTH: LatLng = [12.912, 100.879];
const THAPPRAYA_THEPPRASIT: LatLng = [12.905, 100.876];
const JOMTIEN_BEACH_NORTH: LatLng = [12.9, 100.874];

export const PATTAYA_DISTRICTS: readonly DistrictDefinition[] = [
  {
    slug: "naklua-wongamat",
    name: "Наклуа и Вонгамат",
    nameEn: "Naklua & Wongamat",
    nameTh: "นาเกลือ-วงศ์อมาตย์",
    order: 10,
    boundary: [[13.0, SEA], SUKHUMVIT_NORTH, SUKHUMVIT_NORTH_ROAD, [12.955, SEA]],
  },
  {
    slug: "north-pattaya",
    name: "Северная",
    nameEn: "North Pattaya",
    nameTh: "พัทยาเหนือ",
    order: 20,
    boundary: [
      [12.955, SEA],
      SUKHUMVIT_NORTH_ROAD,
      SUKHUMVIT_CENTRAL_ROAD,
      [12.936, SEA],
    ],
  },
  {
    slug: "central-pattaya",
    name: "Центральная",
    nameEn: "Central Pattaya",
    nameTh: "พัทยากลาง",
    order: 30,
    boundary: [
      [12.936, SEA],
      SUKHUMVIT_CENTRAL_ROAD,
      SUKHUMVIT_SOUTH_ROAD,
      [12.925, SEA],
    ],
  },
  {
    slug: "south-pattaya",
    name: "Южная",
    nameEn: "South Pattaya",
    nameTh: "พัทยาใต้",
    order: 40,
    boundary: [
      [12.925, SEA],
      SUKHUMVIT_SOUTH_ROAD,
      SUKHUMVIT_THEPPRASIT,
      THAPPRAYA_THEPPRASIT,
      THAPPRAYA_NORTH,
      BALI_HAI,
      [12.921, SEA],
    ],
  },
  {
    slug: "pratumnak",
    name: "Пратамнак",
    nameEn: "Pratumnak",
    nameTh: "พระตำหนัก",
    order: 50,
    boundary: [
      [12.921, SEA],
      BALI_HAI,
      THAPPRAYA_NORTH,
      THAPPRAYA_THEPPRASIT,
      JOMTIEN_BEACH_NORTH,
      [12.896, SEA],
    ],
  },
  {
    slug: "jomtien",
    name: "Джомтьен",
    nameEn: "Jomtien",
    nameTh: "จอมเทียน",
    order: 60,
    boundary: [
      THAPPRAYA_THEPPRASIT,
      SUKHUMVIT_THEPPRASIT,
      SUKHUMVIT_NA_JOMTIEN,
      [12.87, SEA],
      [12.896, SEA],
      JOMTIEN_BEACH_NORTH,
    ],
  },
  {
    slug: "na-jomtien",
    name: "На Джомтьен",
    nameEn: "Na Jomtien",
    nameTh: "นาจอมเทียน",
    order: 70,
    boundary: [
      [12.87, SEA],
      SUKHUMVIT_NA_JOMTIEN,
      SUKHUMVIT_KM_150,
      SUKHUMVIT_OCEAN_MARINA,
      SUKHUMVIT_BANG_SARAY,
      [12.76, SEA],
    ],
  },
  {
    slug: "bang-saray",
    name: "Банг Сарай",
    nameEn: "Bang Saray",
    nameTh: "บางเสร่",
    order: 80,
    boundary: [[12.76, SEA], SUKHUMVIT_BANG_SARAY, SUKHUMVIT_SOUTH, [12.69, SEA]],
  },
  {
    slug: "mabprachan",
    name: "Мабпрачан",
    nameEn: "Mabprachan",
    nameTh: "มาบประชัน",
    order: 90,
    boundary: [
      [12.975, 100.935],
      [12.975, 101.0],
      [12.93, 101.0],
      [12.93, 100.935],
    ],
  },
  {
    slug: "siam-country-club",
    name: "Siam Country Club",
    nameEn: "Siam Country Club",
    nameTh: "สยามคันทรีคลับ",
    order: 100,
    boundary: [
      [12.93, 100.925],
      [12.93, 101.0],
      [12.895, 101.0],
      [12.895, 100.925],
    ],
  },
  {
    slug: "huay-yai",
    name: "Хуай Яй",
    nameEn: "Huay Yai",
    nameTh: "ห้วยใหญ่",
    order: 110,
    boundary: [
      [12.895, 100.935],
      [12.895, 101.05],
      [12.76, 101.05],
      [12.76, 100.935],
    ],
  },
];
