/**
 * Цены и контакты Harbor Land (Terminal 21) — черновик из отбора Overture.
 * Источники: официальная страница филиала на harborlandgroup.com и прайс
 * сентября 2026 (картинка на ней); контакты уточнены по месту.
 */
import type { PlaceExtras } from "./overture-prices-1";

export const OVERTURE_PRICES_2: readonly PlaceExtras[] = [
  {
    slug: "harbor-land-terminal-21",
    entryRows: [
      {
        label: "Малыш (65–80 см) — 3 часа",
        labelEn: "Small toddler (65–80 cm) — 3 hours",
        child: 360,
        adult: null,
      },
      {
        label: "Ребёнок (от 81 см) — 3 часа",
        labelEn: "Child (81 cm and up) — 3 hours",
        child: 650,
        adult: null,
      },
      {
        label: "Родитель (от 18 лет) — 3 часа",
        labelEn: "Parent (18+) — 3 hours",
        child: null,
        adult: 260,
      },
    ],
    note:
      "Цена за 3 часа, сверх времени — 50 ฿ за каждые 30 минут. Бесплатно: малыши до 65 см или до 6 месяцев; " +
      "старше 60 лет, беременные и гости на коляске — по одному человеку на категорию при покупке хотя бы одного билета. " +
      "Нужны носки Harborland — 60 ฿ на месте. " +
      "Детям до 10 лет нужно сопровождение: родитель внутри вместе с ребёнком или Happy Care (присмотр сотрудника, оплачивается сверх билета): " +
      "3 часа — 970 ฿ иностранцам, 670 ฿ гражданам Таиланда. На каждого ребёнка — свой родитель или сотрудник. С 10 лет ребёнок может быть без взрослых.",
    noteEn:
      "Price is for 3 hours; overtime is 50 ฿ per 30 minutes. Free: babies under 65 cm or 6 months; " +
      "guests over 60, pregnant women and wheelchair users — one person per category with at least one paid ticket. " +
      "Harborland-brand socks are required — 60 ฿ on site. " +
      "Children under 10 must be accompanied: a parent inside with the child, or Happy Care (a staff carer, paid on top of the ticket): " +
      "3 hours — 970 ฿ for foreigners, 670 ฿ for Thai citizens. Each child needs their own parent or carer. From age 10, children may stay without adults.",
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/HarborLandTerminal21Pattaya/",
      },
      { type: "instagram", value: "https://www.instagram.com/harborland.th" },
      { type: "phone", value: "065 848 1000" },
      { type: "line", value: "https://line.me/R/ti/p/%40harborland" },
      { type: "tiktok", value: "https://www.tiktok.com/@harborland" },
    ],
    replaceTypes: ["facebook", "instagram"],
  },
];
