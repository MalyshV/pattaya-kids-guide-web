import type { DistrictDefinition, LatLng } from "@/lib/districts/resolve-district";

/**
 * Районы Паттайи — как их называют родители, а не административное деление
 * (список и названия — решения 10.10, docs/BACKLOG.md).
 *
 * Границы грубые, но сверены с картой (10.10): опорные точки сняты с линий
 * железной дороги, Таппрайи и главных улиц. Три правила, по которым они
 * проведены:
 *
 * 1. Прибрежные районы кончаются у железной дороги, а не у Сукхумвита.
 *    Дорога идёт в 400–900 м восточнее трассы, поэтому места «на Сукхумвите»
 *    по обе стороны остаются в своём городском районе, а «Восточная Паттайя»
 *    начинается там, где её и ищут, — за переездом.
 * 2. Граница идёт между улицами-тёзками, а не по ним: Северная, Центральная
 *    и Южная улицы лежат каждая внутри своего района, иначе два места напротив
 *    друг друга на одной улице оказались бы в разных районах.
 * 3. Соседние районы делят одни и те же вершины (константы ниже), поэтому
 *    между ними нет щелей и наложений.
 *
 * Со стороны моря границы уходят далеко в воду (долгота 100.80) — там мест
 * нет, зато береговую линию не надо рисовать. Без района остаются только
 * окраины: севернее Мабпрачана и восточнее полей Siam Country Club.
 */

/** Западный край — уже в море. */
const SEA = 100.8;

/** Железная дорога с севера на юг — восточный край прибрежных районов. */
const RAIL_BANG_LAMUNG: LatLng = [13.0, 100.934];
const RAIL_NAKLUA: LatLng = [12.975, 100.9246];
/** севернее Северной улицы: Terminal 21 и Lotus's North остаются в Северной */
const RAIL_NORTH: LatLng = [12.955, 100.917];
/** между Северной (12.950) и Центральной (12.935) улицами */
const RAIL_NORTH_CENTRAL: LatLng = [12.9425, 100.9104];
/** между Центральной (12.935) и Южной (12.922) улицами */
const RAIL_CENTRAL_SOUTH: LatLng = [12.929, 100.9046];
/** чуть южнее Тепразита: улица целиком в Южной */
const RAIL_THEPPRASIT: LatLng = [12.905, 100.901];
const RAIL_JOMTIEN_NORTH: LatLng = [12.895, 100.9];
const RAIL_JOMTIEN_SOUTH: LatLng = [12.885, 100.903];
/** на широте улицы Чайяпрук — там кончается пляж Джомтьен */
const RAIL_CHAIYAPRUEK: LatLng = [12.876, 100.9069];
const RAIL_NA_JOMTIEN: LatLng = [12.85, 100.918];
const RAIL_OCEAN_MARINA: LatLng = [12.83, 100.921];
const RAIL_AMBASSADOR: LatLng = [12.8, 100.9225];
/** между аквапарком Aquaverse (На Джомтьен) и пляжем Банг Сарай */
const RAIL_BANG_SARAY: LatLng = [12.778, 100.9235];
const RAIL_NONG_NOOCH: LatLng = [12.76, 100.927];
const RAIL_KHAO_CHI_CHAN: LatLng = [12.735, 100.951];

/** Таппрайя — дорога по гребню холма Пратамнак. */
const THAPPRAYA_NORTH: LatLng = [12.921, 100.8722];
const THAPPRAYA_THEPPRASIT: LatLng = [12.905, 100.8685];
const THAPPRAYA_SOUTH: LatLng = [12.899, 100.867];

/** За железной дорогой: где кончается «Восточная» и начинаются названные районы. */
const EAST_EDGE = 100.935;
const EAST_NORTH: LatLng = [12.975, EAST_EDGE];
/** отсюда граница Мабпрачана и Siam Country Club уходит наискосок к озеру */
const EAST_LAKE_ROAD: LatLng = [12.945, EAST_EDGE];
const EAST_HUAY_YAI: LatLng = [12.89, EAST_EDGE];
const EAST_CHAIYAPRUEK: LatLng = [12.876, EAST_EDGE];

/** Южная оконечность озера Мабпрачан: севернее — озеро, южнее — Siam Country Club. */
const LAKE_SOUTH: LatLng = [12.921, 100.957];
const LAKE_SOUTH_EAST: LatLng = [12.921, 101.0];
/** восточнее поля Plantation — край Siam Country Club */
const SIAM_COUNTRY_EAST: LatLng = [12.89, 101.03];
/** суша за железной дорогой на юге: Нонг Нуч, Рамаяна, Silverlake — На Джомтьен */
const INLAND_NORTH_EAST: LatLng = [12.8, 101.0];
const INLAND_SOUTH_EAST: LatLng = [12.735, 101.0];

export const PATTAYA_DISTRICTS: readonly DistrictDefinition[] = [
  {
    slug: "naklua-wongamat",
    name: "Наклуа и Вонгамат",
    nameEn: "Naklua & Wongamat",
    nameTh: "นาเกลือ-วงศ์อมาตย์",
    order: 10,
    boundary: [[13.0, SEA], RAIL_BANG_LAMUNG, RAIL_NAKLUA, RAIL_NORTH, [12.955, SEA]],
  },
  {
    slug: "north-pattaya",
    name: "Северная Паттайя",
    nameEn: "North Pattaya",
    nameTh: "พัทยาเหนือ",
    order: 20,
    boundary: [[12.955, SEA], RAIL_NORTH, RAIL_NORTH_CENTRAL, [12.9425, SEA]],
  },
  {
    slug: "central-pattaya",
    name: "Центральная Паттайя",
    nameEn: "Central Pattaya",
    nameTh: "พัทยากลาง",
    order: 30,
    boundary: [[12.9425, SEA], RAIL_NORTH_CENTRAL, RAIL_CENTRAL_SOUTH, [12.929, SEA]],
  },
  {
    slug: "south-pattaya",
    name: "Южная Паттайя",
    nameEn: "South Pattaya",
    nameTh: "พัทยาใต้",
    order: 40,
    boundary: [
      [12.929, SEA],
      RAIL_CENTRAL_SOUTH,
      RAIL_THEPPRASIT,
      THAPPRAYA_THEPPRASIT,
      THAPPRAYA_NORTH,
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
      THAPPRAYA_NORTH,
      THAPPRAYA_THEPPRASIT,
      THAPPRAYA_SOUTH,
      [12.899, SEA],
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
      RAIL_THEPPRASIT,
      RAIL_JOMTIEN_NORTH,
      RAIL_JOMTIEN_SOUTH,
      RAIL_CHAIYAPRUEK,
      [12.876, SEA],
      [12.899, SEA],
      THAPPRAYA_SOUTH,
    ],
  },
  {
    slug: "na-jomtien",
    name: "На Джомтьен",
    nameEn: "Na Jomtien",
    nameTh: "นาจอมเทียน",
    order: 70,
    boundary: [
      [12.876, SEA],
      RAIL_CHAIYAPRUEK,
      RAIL_NA_JOMTIEN,
      RAIL_OCEAN_MARINA,
      RAIL_AMBASSADOR,
      INLAND_NORTH_EAST,
      INLAND_SOUTH_EAST,
      RAIL_KHAO_CHI_CHAN,
      RAIL_NONG_NOOCH,
      RAIL_BANG_SARAY,
      [12.778, SEA],
    ],
  },
  {
    slug: "bang-saray",
    name: "Банг Сарай",
    nameEn: "Bang Saray",
    nameTh: "บางเสร่",
    order: 80,
    boundary: [
      [12.778, SEA],
      RAIL_BANG_SARAY,
      RAIL_NONG_NOOCH,
      RAIL_KHAO_CHI_CHAN,
      [12.69, 100.951],
      [12.69, SEA],
    ],
  },
  {
    slug: "east-pattaya",
    name: "Восточная Паттайя",
    nameEn: "East Pattaya",
    nameTh: "พัทยาตะวันออก",
    order: 90,
    boundary: [
      RAIL_NAKLUA,
      EAST_NORTH,
      EAST_LAKE_ROAD,
      EAST_HUAY_YAI,
      EAST_CHAIYAPRUEK,
      RAIL_CHAIYAPRUEK,
      RAIL_JOMTIEN_SOUTH,
      RAIL_JOMTIEN_NORTH,
      RAIL_THEPPRASIT,
      RAIL_CENTRAL_SOUTH,
      RAIL_NORTH_CENTRAL,
      RAIL_NORTH,
    ],
  },
  {
    slug: "siam-country-club",
    name: "Siam Country Club",
    nameEn: "Siam Country Club",
    nameTh: "สยามคันทรีคลับ",
    order: 100,
    boundary: [
      EAST_LAKE_ROAD,
      LAKE_SOUTH,
      LAKE_SOUTH_EAST,
      [12.921, 101.03],
      SIAM_COUNTRY_EAST,
      EAST_HUAY_YAI,
    ],
  },
  {
    slug: "mabprachan",
    name: "Мабпрачан",
    nameEn: "Mabprachan",
    nameTh: "มาบประชัน",
    order: 110,
    boundary: [EAST_NORTH, [12.975, 101.0], LAKE_SOUTH_EAST, LAKE_SOUTH, EAST_LAKE_ROAD],
  },
  {
    slug: "huay-yai",
    name: "Хуай Яй",
    nameEn: "Huay Yai",
    nameTh: "ห้วยใหญ่",
    order: 120,
    boundary: [
      EAST_HUAY_YAI,
      SIAM_COUNTRY_EAST,
      [12.89, 101.05],
      [12.8, 101.05],
      INLAND_NORTH_EAST,
      RAIL_AMBASSADOR,
      RAIL_OCEAN_MARINA,
      RAIL_NA_JOMTIEN,
      RAIL_CHAIYAPRUEK,
      EAST_CHAIYAPRUEK,
    ],
  },
];
