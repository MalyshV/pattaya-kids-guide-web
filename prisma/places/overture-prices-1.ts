/**
 * Цены и контакты для черновиков из отбора Overture (партия 12.10.2026).
 * Источники — сайты и официальные страницы самих мест; сумма и условия
 * сверены вручную. Контакты: именные Facebook-адреса вместо числовых,
 * чужой сайт у Family Park убран.
 */

export type EntryRow = {
  label: string;
  labelEn: string;
  /// цена в колонке «Ребёнок» (null — пусто)
  child: number | null;
  /// цена в колонке «Взрослый» (null — пусто)
  adult: number | null;
};

export type ContactInput = { type: string; value: string };

export type PlaceExtras = {
  slug: string;
  /// вход бесплатный (PlacePricing FREE), таблицы цен нет
  free?: boolean;
  entryRows?: readonly EntryRow[];
  note?: string;
  noteEn?: string;
  contacts?: readonly ContactInput[];
  /// типы контактов, которые заменяем целиком (старые значения убираем)
  replaceTypes?: readonly string[];
};

const FB = (path: string): ContactInput => ({
  type: "facebook",
  value: `https://www.facebook.com/${path}`,
});

const EASYKART_ROWS: readonly EntryRow[] = [
  {
    label: "Детский карт (7–13 лет, от 125 см) — 1 заезд",
    labelEn: "Kid kart (ages 7–13, 125 cm+) — 1 race",
    child: 499,
    adult: null,
  },
  {
    label: "Обычный карт (от 12 лет, от 135 см) — 1 заезд",
    labelEn: "Regular kart (12+, 135 cm+) — 1 race",
    child: null,
    adult: 699,
  },
  {
    label: "Обычный карт — 3 заезда + футболка",
    labelEn: "Regular kart — 3 races + T-shirt",
    child: null,
    adult: 1999,
  },
  {
    label: "Быстрый карт (от 15 лет, от 150 см) — 2 заезда",
    labelEn: "Fast kart (15+, 150 cm+) — 2 races",
    child: null,
    adult: 1499,
  },
  {
    label: "Быстрый карт — 3 заезда + футболка",
    labelEn: "Fast kart — 3 races + T-shirt",
    child: null,
    adult: 1999,
  },
  {
    label: "Двухместный карт (водитель от 20 лет, пассажир от 110 см) — 1 заезд",
    labelEn: "Two-seater kart (driver 20+, passenger 110 cm+) — 1 race",
    child: null,
    adult: 699,
  },
  {
    label: "Двухместный карт — 3 заезда + футболка",
    labelEn: "Two-seater kart — 3 races + T-shirt",
    child: null,
    adult: 1999,
  },
];

const EASYKART_NOTE =
  "Заезд длится 8 минут. При покупке трёх заездов футболка в подарок. Пакет заездов персональный.";
const EASYKART_NOTE_EN =
  "A race lasts 8 minutes. A T-shirt is included with a 3-race package. Race packages are personal.";

const EASYKART_COMMON: readonly ContactInput[] = [
  FB("easykart.net"),
  { type: "instagram", value: "https://www.instagram.com/easykartthailand/" },
  { type: "youtube", value: "https://www.youtube.com/@easykartthailand4979" },
  { type: "x", value: "https://x.com/easykart_net" },
];

export const OVERTURE_PRICES_1: readonly PlaceExtras[] = [
  {
    slug: "angry-birds-play-park-jomtien",
    free: true,
  },
  {
    slug: "art-in-paradise-pattaya",
    entryRows: [{ label: "Входной билет", labelEn: "Admission", child: 200, adult: 400 }],
    contacts: [FB("Mymintzgallary/"), { type: "phone", value: "085 999 3374" }],
    replaceTypes: ["facebook"],
  },
  {
    slug: "big-bee-farm-pattaya",
    free: true,
    contacts: [
      { type: "website", value: "https://bigbeefarm.com/" },
      FB("Bigbeefarm.pattaya/"),
      { type: "phone", value: "038 172 004" },
    ],
    replaceTypes: ["facebook"],
  },
  {
    slug: "columbia-pictures-aquaverse",
    entryRows: [
      { label: "Входной билет", labelEn: "Admission", child: 1594, adult: 1808 },
      { label: "Старше 65 лет", labelEn: "Seniors (65+)", child: null, adult: 1290 },
    ],
    note: "Ребёнок — от 3 до 12 лет, дети до 3 лет бесплатно. Катание на картах, сёрфинг и бамперные машинки оплачиваются отдельно. Полотенце — 107 ฿ и залог 300 ฿.",
    noteEn:
      "Child ticket — ages 3 to 12; children under 3 enter free. Go-karts, surfing and bumper cars are paid separately. Towel — 107 ฿ plus a 300 ฿ deposit.",
    contacts: [
      FB("ColumbiaPicturesAquaverse"),
      {
        type: "instagram",
        value: "https://www.instagram.com/columbiapicturesaquaverse.th",
      },
      { type: "line", value: "https://page.line.me/das1327d" },
      { type: "tiktok", value: "https://www.tiktok.com/@aquaversethailand" },
      {
        type: "youtube",
        value: "https://www.youtube.com/channel/UCwJFiXrmevrQ9swa8Hh1OZA",
      },
      { type: "phone", value: "+66 33 004 999" },
    ],
    replaceTypes: ["facebook"],
  },
  {
    slug: "dinopark-petting-zoo",
    entryRows: [
      {
        label: "Входной билет (с человека)",
        labelEn: "Admission (per person)",
        child: 300,
        adult: 300,
      },
    ],
    note: "Корм для животных и фото включены в стоимость.",
    noteEn: "Animal food and photos are included in the price.",
    contacts: [
      { type: "website", value: "https://linktr.ee/dinoparkpettingzoo" },
      FB("people/Dinopark-Petting-zoo/61582525764531/"),
      { type: "instagram", value: "https://www.instagram.com/dinopark_petting_zoo" },
      { type: "tiktok", value: "https://www.tiktok.com/@dinoparkpettingzoo" },
      { type: "phone", value: "064 571 8729" },
    ],
    replaceTypes: ["facebook"],
  },
  {
    slug: "easykart-bali-hai-pier",
    entryRows: EASYKART_ROWS,
    note: EASYKART_NOTE,
    noteEn: EASYKART_NOTE_EN,
    contacts: [
      { type: "website", value: "https://easykart.net/pattaya-bali-hai-pier/" },
      ...EASYKART_COMMON,
      { type: "phone", value: "+66 33 005 009" },
    ],
    replaceTypes: ["website", "facebook"],
  },
  {
    slug: "easykart-thepprasit",
    entryRows: EASYKART_ROWS,
    note: EASYKART_NOTE,
    noteEn: EASYKART_NOTE_EN,
    contacts: [
      { type: "website", value: "https://easykart.net/pattaya-thepprasit/" },
      ...EASYKART_COMMON,
      { type: "phone", value: "+66 33 042 455" },
    ],
    replaceTypes: ["website", "facebook"],
  },
  {
    slug: "frost-magical-ice-of-siam",
    entryRows: [
      { label: "Входной билет", labelEn: "Admission", child: 600, adult: 600 },
      {
        label: "Прокат сапог (обязателен, в своей обуви нельзя)",
        labelEn: "Boot rental (required — own shoes not allowed)",
        child: 90,
        adult: 90,
      },
      {
        label: "Перчатки (по желанию)",
        labelEn: "Gloves (optional)",
        child: 60,
        adult: 60,
      },
      {
        label: "Вход на каток (по желанию)",
        labelEn: "Ice-rink entry (optional)",
        child: 199,
        adult: 199,
      },
    ],
    note: "Куртка входит в билет. Дети до 90 см проходят бесплатно.",
    noteEn: "A jacket is included in the ticket. Children under 90 cm enter free.",
    contacts: [FB("frostpattaya/"), { type: "phone", value: "063 669 4559" }],
    replaceTypes: ["facebook"],
  },
  {
    slug: "family-park-pattaya",
    entryRows: [{ label: "Входной билет", labelEn: "Admission", child: 250, adult: 250 }],
    note: "Корм для животных покупается отдельно, около 20 ฿ за порцию.",
    noteEn: "Animal food is bought separately, about 20 ฿ per portion.",
    contacts: [
      FB("Familyparkpattaya"),
      { type: "instagram", value: "https://www.instagram.com/familyparkpattaya" },
      { type: "tiktok", value: "https://www.tiktok.com/@familyparkpattaya" },
      { type: "phone", value: "097 459 9919" },
    ],
    // сайт familyparkpattaya.com — витрина тигров и слонов, не фермы овец
    replaceTypes: ["facebook", "website"],
  },
  // именные Facebook-адреса вместо числовых (проверено: ведут на ту же страницу)
  {
    slug: "ramayana-water-park",
    contacts: [FB("RamayanaWaterParkThailand/")],
    replaceTypes: ["facebook"],
  },
  {
    slug: "ripleys-believe-it-or-not-pattaya",
    contacts: [FB("ripleysthailand/")],
    replaceTypes: ["facebook"],
  },
  { slug: "mini-siam", contacts: [FB("MiniSiam1988/")], replaceTypes: ["facebook"] },
  {
    slug: "pattaya-dinosaur-kingdom",
    contacts: [FB("PattayaPDK/")],
    replaceTypes: ["facebook"],
  },
  {
    slug: "pattaya-kart-speedway",
    contacts: [FB("people/Pattaya-Kart/100062923706793/")],
    replaceTypes: ["facebook"],
  },
  {
    slug: "monster-aquarium-pattaya",
    contacts: [FB("MonstersaquariumPattaya/")],
    replaceTypes: ["facebook"],
  },
  {
    slug: "the-view-ferris-wheel-pattaya",
    contacts: [FB("TheViewPattaya/")],
    replaceTypes: ["facebook"],
  },
  {
    slug: "pattaya-elephant-sanctuary",
    contacts: [FB("PattayaElephantSanctuary/")],
    replaceTypes: ["facebook"],
  },
  {
    slug: "pipo-pony-club",
    contacts: [FB("PipoPonyClubPattaya/")],
    replaceTypes: ["facebook"],
  },
  {
    slug: "tiger-park-pattaya",
    contacts: [FB("tigerparkofficial/")],
    replaceTypes: ["facebook"],
  },
  {
    slug: "pattaya-dolphinarium",
    contacts: [FB("PattayaDolphinarium/")],
    replaceTypes: ["facebook"],
  },
  {
    slug: "harbor-land-terminal-21",
    contacts: [FB("HarborLandTerminal21Pattaya/")],
    replaceTypes: ["facebook"],
  },
  { slug: "sanook-park", contacts: [FB("sanookpark/")], replaceTypes: ["facebook"] },
  {
    slug: "international-riding-school-horseshoe-point",
    contacts: [FB("internationalridingschool/")],
    replaceTypes: ["facebook"],
  },
  {
    slug: "portal-vr-arena",
    contacts: [FB("people/VR-Arena-Pattaya/61551217141103/")],
    replaceTypes: ["facebook"],
  },
];
