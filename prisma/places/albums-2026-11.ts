/**
 * Партия «из личных альбомов» (11.11.2026): четыре новых места, черновик
 * второго кафе The Chocolate Factory и фото с описаниями для уже существующих
 * карточек. Занос — prisma/add-albums-2026-11.ts: сначала черновики новых мест
 * (PENDING), затем наполнение (заполняет только пустое).
 *
 * Источники:
 * - описания и «Полезно знать» — личные визиты 2025–2026 и снимки с них
 *   (вывески, таблички, прайсы в кадре);
 * - часы работы — с карточек мест на карте, сверены 11.11.2026;
 * - адрес, телефон, точка и ссылка на карточку — с карты; страницы в соцсетях —
 *   только официальные, открыты 11.11.2026 (свежие публикации есть у всех).
 * Чего ни снимки, ни официальные страницы не говорят, того здесь нет: признак
 * остаётся «уточняется». Список сомнений — в описании PR.
 *
 * Фото — свои, уменьшены до 1024 px, без метаданных; лица посторонних смазаны.
 * Решение 11–12.11: кадры с семьёй автора (ребёнок и родители) — можно;
 * лица посторонних смазываем или убираем обрезкой.
 * Строка о правах — у каждого места.
 */
import type { PlaceFill } from "../../src/lib/import/place-fill";
import type { DraftPlace } from "./overture-batch-1";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
type Day = (typeof DAYS)[number];
type Hours = NonNullable<PlaceFill["hours"]>;

function hours(open: string, close: string, days: readonly Day[] = DAYS): Hours {
  return Object.fromEntries(days.map((day) => [day, { open, close }]));
}

export const ALBUMS_2026_11_NEW_PLACES: readonly DraftPlace[] = [
  {
    slug: "skoop-beach-cafe",
    name: "Skoop Beach Café",
    address: "211 Soi Na Jomtien 4, Na Chom Thian, Sattahip District, Chon Buri 20250",
    latitude: 12.859251,
    longitude: 100.8972473,
    googleMapsUrl:
      "https://www.google.com/maps/place/Skoop+Beach+Caf%C3%A9+Pattaya/@12.859251,100.8972473,17z/data=!3m1!4b1!4m6!3m5!1s0x31029406a37b7cbf:0x46552d01db9aa471!8m2!3d12.859251!4d100.8972473!16s%2Fg%2F11bxfxw7c2",
    website: null,
    facebookUrl: "https://www.facebook.com/skoopbeachcafe",
    phone: "091 725 4569",
    animals: false,
    categorySlugs: ["cafe"],
    indoor: true,
    outdoor: true,
  },
  {
    slug: "kun-ying-hydroponic-farm",
    name: "Kun Ying Hydroponic Farm",
    address: "Wat Yannasangwararam, Huai Yai, Bang Lamung District, Chon Buri 20150",
    latitude: 12.7982135,
    longitude: 100.9659229,
    googleMapsUrl:
      "https://www.google.com/maps/place/Kun+Ying+Hydroponic+Farm/@12.7982135,100.9659229,17z/data=!3m1!4b1!4m6!3m5!1s0x310292dbb9a9ca27:0x3e1877aad39ba55f!8m2!3d12.7982135!4d100.9659229!16s%2Fg%2F11byxgnzs9",
    website: null,
    facebookUrl: "https://www.facebook.com/Kunyinghydro/",
    phone: "096 659 4198",
    animals: true,
    categorySlugs: ["cafe"],
    outdoor: true,
  },
  {
    slug: "black-forest-pattaya",
    name: "Black Forest Pattaya",
    address: "17/10 หมู่ 2, Huai Yai, Bang Lamung District, Chon Buri 20150",
    latitude: 12.8498808,
    longitude: 100.9357243,
    googleMapsUrl:
      "https://www.google.com/maps/place/Black+Forest+Pattaya/@12.8498808,100.9357243,17z/data=!3m1!4b1!4m6!3m5!1s0x3102931333f6b319:0xd62c154eb6468b18!8m2!3d12.8498808!4d100.9357243!16s%2Fg%2F11lgzhs3d8",
    website: null,
    facebookUrl: null,
    phone: "093 181 2341",
    animals: true,
    categorySlugs: ["cafe"],
    indoor: true,
    outdoor: true,
  },
  {
    slug: "the-chocolate-factory-sukhumvit",
    name: "The Chocolate Factory · Sukhumvit",
    address: "349/13 Sukhumvit Rd, Pattaya City, Bang Lamung District, Chon Buri 20150",
    latitude: 12.870176,
    longitude: 100.9028322,
    googleMapsUrl:
      "https://www.google.com/maps/place/The+Chocolate+Factory+Pattaya+Sukumvit/@12.870176,100.9028322,17z/data=!3m1!4b1!4m6!3m5!1s0x310295a1eb2594fd:0xa8d1409bcb70cac3!8m2!3d12.870176!4d100.9028322!16s%2Fg%2F11fljhyfk6",
    website: null,
    facebookUrl: "https://www.facebook.com/thechocolatefactorythailand/",
    instagramUrl: "https://www.instagram.com/thechocolatefactorythailand/",
    phone: "066 061 8882",
    animals: false,
    categorySlugs: ["cafe"],
    indoor: true,
  },
  {
    // без наполнения: там не были — остаётся черновиком до визита или звонка
    slug: "the-chocolate-factory-pratumnak",
    name: "The Chocolate Factory · Pratumnak",
    address: "Khao Phra Tamnak, Pattaya City, Bang Lamung District, Chon Buri 20150",
    latitude: 12.9211336,
    longitude: 100.8593798,
    googleMapsUrl:
      "https://www.google.com/maps/place/The+Chocolate+Factory+Pattaya+Khao+Phratamnak/@12.9211336,100.8593798,17z/data=!3m1!4b1!4m6!3m5!1s0x310296468b232af7:0x3acd1f39bd29f022!8m2!3d12.9211336!4d100.8593798!16s%2Fg%2F11b6g6904k",
    website: null,
    facebookUrl: "https://www.facebook.com/thechocolatefactorythailand/",
    instagramUrl: "https://www.instagram.com/thechocolatefactorythailand/",
    animals: false,
    categorySlugs: ["cafe"],
    indoor: true,
    about:
      "Второе кафе сети в Паттайе — на мысе Пратамнак, над морем. По обзорам, шоколатье тоже видно через стекло. " +
      "Детский мастер-класс по росписи шоколадом подтверждён только для кафе на Сукхумвите — уточнить на месте. (Уверенность низкая: не были.)",
    otherSources: [
      "https://www.pattayamail.com/ourcommunity/the-chocolate-factory-opens-in-pattaya-57583",
    ],
  },
  {
    // ресторан, не детское место: занесён ради пакетов дня рождения — решить при вычитке
    slug: "azur-restaurant-lounge-pattaya",
    name: "Azur Restaurant & Lounge",
    address: "46/9 Moo 1, Na Chom Thian, Sattahip District, Chon Buri 20250",
    latitude: 12.8599126,
    longitude: 100.9000611,
    googleMapsUrl:
      "https://www.google.com/maps/place/Azur+Restaurant+%26+Lounge+Pattaya/@12.8599126,100.9000611,17z/data=!3m1!4b1!4m6!3m5!1s0x310295d45eadca57:0x6c9922bade862ee5!8m2!3d12.8599126!4d100.9000611!16s%2Fg%2F11tndwfpfm",
    website: "https://azurpattaya.com",
    facebookUrl: null,
    instagramUrl: "https://www.instagram.com/azur_restaurant_th/",
    phone: "094 658 0105",
    animals: false,
    categorySlugs: [],
    indoor: true,
    about:
      "Европейский ресторан в На-Джомтьене с детскими днями рождения в отдельной лаунж-зоне (сторис 09.07.2026): " +
      "Mini — 890 ฿ с человека, от 5 детей, 3 часа; Classic — 990 ฿, от 10 детей, 3 часа; " +
      "Premium — 1 190 ฿, от 10 детей, до 4 часов, с тортом, шарами и видеосъёмкой. В пакеты входят пицца, наггетсы, картофель фри, фрукты, " +
      "лимонад или морс, оформление стола и фотозона. Допы: аниматор (1 ч) 3 500 ฿, аквагрим 3 000 ฿, шоу пузырей 5 000 ฿, " +
      "научное шоу 8 000 ฿, арка из шаров 5 000 ฿, фотограф 6 000 ฿, пиньята 1 500 ฿, торт от 1 200 ฿ за кг. " +
      "Налоги и сервисный сбор в сторис не упомянуты. Есть ли детская зона вне праздников — неизвестно. " +
      "(Уверенность средняя: оставить ли ресторан в гиде — решить.)",
  },
];

const OWN = (visit: string): string => `Своё фото (визит ${visit})`;

/** Наполнение новых мест — те же slug, что в ALBUMS_2026_11_NEW_PLACES. */
export const ALBUMS_2026_11_NEW_FILLS: readonly PlaceFill[] = [
  {
    slug: "skoop-beach-cafe",
    description:
      "Кафе прямо на пляже На-Джомтьена, рядом с отелем Veranda Resort Pattaya – MGallery. " +
      "Для детей — открытая площадка: игровой «замок» с горками на газоне, ряд качелей на песке (есть сиденье-люлька для малышей) " +
      "и верёвочные качели на деревьях, с видом на море. У столиков ровное застеленное покрытие: " +
      "можно взять с собой самокат, беговел или машинку и покататься. Столики есть и на улице, и внутри, с кондиционером. " +
      "В меню мороженое, бургеры и напитки; по вечерам играет живая музыка.",
    descriptionEn:
      "A café right on Na Jomtien beach, next to the Veranda Resort Pattaya – MGallery hotel. " +
      'For children there is an open-air playground: a play "castle" with slides on the lawn, a row of swings on the sand (one is a bucket seat for toddlers) ' +
      "and rope swings in the trees, all facing the sea. The ground by the tables is flat and covered, " +
      "so you can bring a scooter, balance bike or ride-on car. There are tables both outdoors and inside, with air conditioning. " +
      "The menu has ice cream, burgers and drinks; there is live music in the evenings.",
    tips: [
      {
        text: "Пройти к кафе можно через территорию отеля Veranda Resort Pattaya – MGallery.",
        textEn:
          "You can walk to the café through the grounds of the Veranda Resort Pattaya – MGallery hotel.",
      },
      {
        text: "Возьмите детский транспорт — самокат или беговел: у столиков ровное покрытие, есть где покататься.",
        textEn:
          "Bring a scooter or balance bike: the ground by the tables is flat, with room to ride.",
      },
      {
        text: "Тень есть только под деревьями и навесами: качели и газон на солнце. Днём пригодятся панама и крем, а спокойнее всего ближе к закату.",
        textEn:
          "Shade is only under the trees and canopies: the swings and lawn are in the sun. A hat and sunscreen help during the day; it is most pleasant towards sunset.",
      },
      {
        text: "Море рядом и не огорожено — пляж начинается сразу за газоном. Столики стоят у самых качелей, ребёнка видно с места.",
        textEn:
          "The sea is close and not fenced off — the beach starts right beyond the lawn. Tables stand next to the swings, so you can watch your child from your seat.",
      },
      {
        text: "Со своей едой и напитками на территорию нельзя — об этом таблички у входа.",
        textEn:
          "You cannot bring your own food and drinks — there are signs about it at the entrance.",
      },
      {
        text: "По вечерам живая музыка; с пятницы по воскресенье кафе открыто на час дольше, до 21:00.",
        textEn:
          "There is live music in the evenings; from Friday to Sunday the café stays open an hour longer, until 21:00.",
      },
    ],
    hours: {
      ...hours("11:00", "20:00", ["MON", "TUE", "WED", "THU"]),
      ...hours("11:00", "21:00", ["FRI", "SAT", "SUN"]),
    },
    flags: {
      indoor: true,
      outdoor: true,
      hasAirCon: true,
      hasFood: true,
      hasCafeSeating: true,
    },
    cover: { url: "/images/places/skoop-beach-cafe.jpg", rightsNote: OWN("2025-07") },
    photos: [
      {
        url: "/images/places/skoop-beach-cafe-castle.jpg",
        caption: "Игровой «замок» с горками, за ним море",
      },
      {
        url: "/images/places/skoop-beach-cafe-slide.jpg",
        caption: "Закрытая спиральная горка",
      },
      {
        url: "/images/places/skoop-beach-cafe-baby-swing.jpg",
        caption: "Качели-люлька для малышей",
      },
      {
        url: "/images/places/skoop-beach-cafe-rope-swing.jpg",
        caption: "Верёвочные качели под деревом",
      },
      {
        url: "/images/places/skoop-beach-cafe-tables.jpg",
        caption: "Столики на газоне у самого песка",
      },
      {
        url: "/images/places/skoop-beach-cafe-frame.jpg",
        caption: "Качели-рамка с названием кафе",
      },
      {
        url: "/images/places/skoop-beach-cafe-sunset.jpg",
        caption: "Вечером над газоном зажигают гирлянды",
      },
    ],
    photoRightsNote: OWN("2025-04"),
  },
  {
    slug: "kun-ying-hydroponic-farm",
    description:
      "Кафе при действующей гидропонной ферме к югу от города, в районе храма Ват Ян. В теплицах под затеняющей сеткой " +
      "растут салаты, зелень и томаты. Гостям выдают плетёные корзинки: овощи и зелень можно собрать самим прямо с кустов и купить домой — " +
      "детям это нравится больше всего. У входа в теплицы стоят деревянные лошадки-качалки, по дорожкам ходят куры. " +
      "В кафе готовят из своего урожая.",
    descriptionEn:
      "A café at a working hydroponic farm south of the city, near Wat Yan temple. Salad greens, herbs and tomatoes " +
      "grow in greenhouses under shade netting. Guests are given wicker baskets: you can pick vegetables and herbs straight from the plants " +
      "and buy them to take home — children enjoy this most of all. There are wooden rocking horses by the greenhouse entrance, and hens walk along the paths. " +
      "The café cooks with its own harvest.",
    tips: [
      {
        text: "Корзинку для сбора овощей и зелени выдают на месте; всё собранное можно купить с собой.",
        textEn:
          "You get a basket for picking vegetables and herbs on site; you can buy everything you pick to take home.",
      },
      {
        text: "По всей территории мелкий гравий: с коляской на маленьких колёсах тяжело, ребёнку удобнее закрытая обувь.",
        textEn:
          "The whole site is covered in fine gravel: hard going for small-wheeled strollers, and closed shoes are more comfortable for children.",
      },
      {
        text: "Куры и петух свободно ходят по дорожкам — предупредите ребёнка заранее. Есть и вольер, к сетке можно подойти вплотную.",
        textEn:
          "Hens and a rooster roam the paths freely — tell your child in advance. There is also a coop you can walk right up to.",
      },
      {
        text: "В теплицах тень от сетки, у въезда — открытое солнце. Понедельник — выходной.",
        textEn:
          "The greenhouses are shaded by netting; the entrance area is in full sun. Closed on Mondays.",
      },
    ],
    hours: {
      MON: "closed",
      ...hours("08:00", "17:00", ["TUE", "WED", "THU", "FRI", "SAT", "SUN"]),
    },
    flags: {
      outdoor: true,
      hasFood: true,
      hasCafeSeating: true,
      animalContact: true,
    },
    cover: {
      url: "/images/places/kun-ying-hydroponic-farm.jpg",
      rightsNote: OWN("2026-01"),
    },
    photos: [
      {
        url: "/images/places/kun-ying-hydroponic-farm-rocking-horse.jpg",
        caption: "Лошадки-качалки у грядок",
      },
      {
        url: "/images/places/kun-ying-hydroponic-farm-tomatoes.jpg",
        caption: "Томаты на гидропонике под затеняющей сеткой",
      },
      {
        url: "/images/places/kun-ying-hydroponic-farm-hens.jpg",
        caption: "Вольер с курами",
      },
      {
        url: "/images/places/kun-ying-hydroponic-farm-harvest.jpg",
        caption: "Салат и томаты с собой",
      },
      {
        url: "/images/places/kun-ying-hydroponic-farm-dish.jpg",
        caption: "Завтрак в кафе с зеленью с фермы",
      },
    ],
    photoRightsNote: OWN("2026-01"),
  },
  {
    slug: "black-forest-pattaya",
    description:
      "Кафе с большой зелёной территорией вокруг пруда, к юго-востоку от города. В пруду плавают разноцветные карпы — " +
      "их можно кормить в отмеченном месте; над водой фонтаны, водопады и туман. По берегу расставлены места для фотографий: " +
      "огромное плетёное гнездо, подвесной кокон, стены с объёмными рисунками. С детьми здесь можно делать поделки. " +
      "Меню большое, цены умеренные; столики стоят на улице под вентиляторами и в залах с кондиционером.",
    descriptionEn:
      "A café set in large green grounds around a pond, south-east of the city. The pond is full of colourful koi — " +
      "you can feed them at a marked spot; there are fountains, waterfalls and mist over the water. Photo spots are placed along the shore: " +
      "a huge wicker nest, a hanging cocoon, walls with 3D paintings. Children can do crafts here. " +
      "The menu is large and prices are moderate; tables are outdoors under fans and in air-conditioned rooms.",
    tips: [
      {
        text: "Рыб кормят только там, где стоит табличка Fish feeding area; у смотровой площадки кормить запрещено.",
        textEn:
          "Fish may only be fed at the Fish feeding area sign; feeding is not allowed by the viewing deck.",
      },
      {
        text: "У воды нет сплошного ограждения: к пруду спускаются по крупным камням. Малышей держите за руку.",
        textEn:
          "There is no continuous railing by the water: you step down to the pond over large rocks. Hold small children by the hand.",
      },
      {
        text: "Дорожки бетонные и каменные, местами неровные — ребёнку удобнее нескользкая обувь.",
        textEn:
          "Paths are concrete and stone, uneven in places — non-slip shoes are more comfortable for children.",
      },
      {
        text: "Берег и места для фото в тени деревьев; расписанные стены — под крышей, там можно переждать солнце или дождь.",
        textEn:
          "The shore and photo spots are shaded by trees; the painted walls are under a roof, where you can wait out the sun or rain.",
      },
    ],
    // суббота на карте записана с ошибкой (до 00:00 и снова с 00:00 до 06:00) — день не заполняем
    hours: hours("09:00", "18:00", ["MON", "TUE", "WED", "THU", "FRI", "SUN"]),
    flags: {
      indoor: true,
      outdoor: true,
      hasAirCon: true,
      hasFans: true,
      hasFood: true,
      hasCafeSeating: true,
      animalContact: true,
    },
    cover: { url: "/images/places/black-forest-pattaya.jpg", rightsNote: OWN("2026-07") },
    photos: [
      {
        url: "/images/places/black-forest-pattaya-fish-feeding.jpg",
        caption: "Кормление рыб у таблички Fish feeding area",
      },
      {
        url: "/images/places/black-forest-pattaya-cocoon.jpg",
        caption: "Подвесной плетёный кокон над прудом",
      },
      {
        url: "/images/places/black-forest-pattaya-butterflies.jpg",
        caption: "Стена с лесом и бабочками",
      },
      {
        url: "/images/places/black-forest-pattaya-dragon.jpg",
        caption: "Стена с драконом в арке",
      },
    ],
    photoRightsNote: OWN("2026-07"),
  },
  {
    slug: "the-chocolate-factory-sukhumvit",
    description:
      "Большое кафе-ресторан сети The Chocolate Factory на Сукхумвите, напротив плавучего рынка. На территории работает маленькая " +
      "шоколадная фабрика: через стекло видно, как делают конфеты. Рядом магазин с большим выбором шоколада и сладостей. " +
      "Для детей есть мастер-класс по росписи шоколадом: записываться не нужно — сотрудник приносит растопленный шоколад и картинку " +
      "прямо к столику, а готовую работу после застывания отдают с собой. Готовят быстро; вечером красиво подсвечен вход.",
    descriptionEn:
      "A large café-restaurant of The Chocolate Factory chain on Sukhumvit Road, opposite the floating market. There is a small " +
      "chocolate factory on site: through the glass you can watch sweets being made. Next to it is a shop with a wide choice of chocolate and sweets. " +
      "For children there is a chocolate-painting workshop: no booking needed — a staff member brings melted chocolate and a picture " +
      "to your table, and the finished piece is yours to take home once it sets. Food arrives quickly; the entrance is beautifully lit in the evening.",
    tips: [
      {
        text: "Мастер-класс по росписи шоколадом — без записи: попросите сотрудников на месте, всё принесут к столику. По стойке у входа — около 20 минут, от 150 ฿ с человека (октябрь 2026).",
        textEn:
          "The chocolate-painting workshop needs no booking: ask the staff on site and everything is brought to your table. Per the stand at the entrance: about 20 minutes, from 150 ฿ per person (October 2026).",
      },
      {
        text: "Расписанный шоколад должен застыть — заложите на это время, работу отдадут с собой.",
        textEn:
          "The painted chocolate needs time to set — allow for that; you take the piece home.",
      },
      {
        text: "Конфеты в магазине продают поштучно, по 35 и 45 ฿. Среди начинок есть кофе с бренди и острый перец чили — детям выбирайте внимательно.",
        textEn:
          "Sweets in the shop are sold by the piece, at 35 and 45 ฿. Fillings include coffee brandy and hot chilli — choose carefully for children.",
      },
      {
        text: "В Паттайе у сети два кафе. Эта карточка — про кафе на Сукхумвите; второе стоит на мысе Пратамнак, у моря, — есть ли там детский мастер-класс, уточняйте заранее.",
        textEn:
          "The chain has two cafés in Pattaya. This card is about the one on Sukhumvit; the other is on Pratumnak Hill, by the sea — check in advance whether the children's workshop runs there.",
      },
    ],
    hours: hours("11:00", "21:00"),
    flags: { indoor: true, hasFood: true, hasCafeSeating: true },
    cover: {
      url: "/images/places/the-chocolate-factory-sukhumvit.jpg",
      rightsNote: OWN("2026-10"),
    },
    photos: [
      {
        url: "/images/places/the-chocolate-factory-sukhumvit-workshop.jpg",
        caption: "Мастер-класс: роспись шоколадом по картинке",
      },
      {
        url: "/images/places/the-chocolate-factory-sukhumvit-factory.jpg",
        caption: "Фабрика за стеклом",
      },
      {
        url: "/images/places/the-chocolate-factory-sukhumvit-window.jpg",
        caption: "Производство видно прямо из зала",
      },
      {
        url: "/images/places/the-chocolate-factory-sukhumvit-hall.jpg",
        caption: "Зал и витрина с тортами",
      },
      {
        url: "/images/places/the-chocolate-factory-sukhumvit-sweets.jpg",
        caption: "Конфеты ручной работы поштучно",
      },
      {
        url: "/images/places/the-chocolate-factory-sukhumvit-shop.jpg",
        caption: "Магазин: плитки, печенье, «шоколадная пицца»",
      },
    ],
    photoRightsNote: OWN("2026-10"),
  },
];

/**
 * Уже существующие карточки. Первые четыре получают только фото — их тексты
 * идут партией top20-2026-11. Остальные четыре были пустыми черновиками:
 * описание и «Полезно знать» — по снимкам и табличкам в кадре; часов и цен
 * входа на снимках нет, они остаются пустыми.
 */
export const ALBUMS_2026_11_FILLS: readonly PlaceFill[] = [
  {
    slug: "coco-play-beach-road",
    cover: { url: "/images/places/coco-play.jpg", rightsNote: OWN("2026-02") },
  },
  {
    slug: "funtasea-kids-world-royal-cliff",
    cover: { url: "/images/places/funtasea-kids-world.jpg", rightsNote: OWN("2026-07") },
    photos: [
      {
        url: "/images/places/funtasea-kids-world-room.jpg",
        caption: "Игровая комната: кухни, столики, мягкий пол",
      },
    ],
    photoRightsNote: OWN("2026-07"),
  },
  {
    slug: "miffys-voyage-cafe",
    cover: { url: "/images/places/miffys-voyage-cafe.jpg", rightsNote: OWN("2026-07") },
    photos: [
      {
        url: "/images/places/miffys-voyage-cafe-hall.jpg",
        caption: "Зал с мягкой зоной",
      },
      {
        url: "/images/places/miffys-voyage-cafe-ball-pit.jpg",
        caption: "Сухой бассейн с шариками",
      },
      {
        url: "/images/places/miffys-voyage-cafe-pancakes.jpg",
        caption: "Панкейки с Миффи",
      },
      {
        url: "/images/places/miffys-voyage-cafe-drinks.jpg",
        caption: "Кофе с зайкой и смузи",
      },
      {
        url: "/images/places/miffys-voyage-cafe-entrance.jpg",
        caption: "У входа: сэндвич-мороженое Миффи",
      },
    ],
    photoRightsNote: OWN("2026-07"),
  },
  {
    slug: "pa-boon-cafe-5",
    cover: { url: "/images/places/pa-boon-cafe-5.jpg", rightsNote: OWN("2026-01") },
    photos: [
      {
        url: "/images/places/pa-boon-cafe-5-pavilions.jpg",
        caption: "Беседки над водой",
      },
      {
        url: "/images/places/pa-boon-cafe-5-canal.jpg",
        caption: "Канал с карпами под деревьями",
      },
      {
        url: "/images/places/pa-boon-cafe-5-koi.jpg",
        caption: "Карпы у самой платформы",
      },
      {
        url: "/images/places/pa-boon-cafe-5-stones.jpg",
        caption: "Камни-листья через воду",
      },
      {
        url: "/images/places/pa-boon-cafe-5-duck.jpg",
        caption: "Утка плавает вместе с карпами",
      },
      {
        url: "/images/places/pa-boon-cafe-5-farm.jpg",
        caption: "Лужайка мини-фермы: морские свинки, утки, индюк",
      },
      {
        url: "/images/places/pa-boon-cafe-5-dinosaur.jpg",
        caption: "Тираннозавр среди пальм",
      },
      {
        url: "/images/places/pa-boon-cafe-5-playground.jpg",
        caption: "Дорожка к мамонту и большой детской площадке",
      },
      {
        url: "/images/places/pa-boon-cafe-5-arch.jpg",
        caption: "Арка с названием над водой",
      },
    ],
    photoRightsNote: OWN("2026-01"),
  },
  {
    slug: "monster-aquarium-pattaya",
    description:
      "Аквариум в Нонг Пла Лай; официальная страница обещает тоннель с пресноводными рыбами, редких животных и занятия с животными. " +
      "При аквариуме есть крытая зона, где животных кормят сами посетители: карликовые козлята ходят прямо по проходу и подходят к детям, " +
      "фламинго берут корм из ковшика на длинной ручке, в пруду с низким бортиком живут черепахи и карпы. " +
      "Снимки в карточке — из этой зоны; самих аквариумов на них нет.",
    descriptionEn:
      "An aquarium in Nong Pla Lai; its official page promises a freshwater fish tunnel, rare animals and animal activities. " +
      "Next to the aquarium there is a covered area where visitors feed the animals themselves: dwarf goat kids walk along the aisle and come up to children, " +
      "flamingos take food from a long-handled scoop, and a low-walled pond holds turtles and koi. " +
      "The photos on this card are from that area; the aquarium tanks themselves are not shown.",
    tips: [
      {
        text: "Корм для фламинго — 20 ฿ (табличка у вольера, июнь 2025). Черепах и рыб тоже кормят гранулами из мисочки.",
        textEn:
          "Flamingo food is 20 ฿ (sign at the enclosure, June 2025). Turtles and fish are also fed with pellets from a small bowl.",
      },
      {
        text: "Кормят не с руки, а ковшиком и ложкой на длинных ручках — малышу понадобится помощь взрослого.",
        textEn:
          "Feeding is done with a long-handled scoop and spoon, not by hand — a small child will need an adult's help.",
      },
      {
        text: "Козлята ходят свободно и сами подходят к детям — предупредите ребёнка заранее.",
        textEn:
          "The goat kids roam freely and come up to children — tell your child in advance.",
      },
      {
        text: "Возьмите влажные салфетки: после кормления захочется вымыть руки.",
        textEn: "Bring wet wipes: you will want to clean hands after feeding.",
      },
    ],
    flags: { hasCoveredArea: true, animalContact: true },
    cover: {
      url: "/images/places/monster-aquarium-pattaya.jpg",
      rightsNote: OWN("2025-06"),
    },
    photos: [
      {
        url: "/images/places/monster-aquarium-pattaya-flamingo-scoop.jpg",
        caption: "Фламинго кормят из ковшика на длинной ручке",
      },
      {
        url: "/images/places/monster-aquarium-pattaya-flamingos.jpg",
        caption: "Фламинго у скалы с водопадом",
      },
      {
        url: "/images/places/monster-aquarium-pattaya-flamingo-feeding.jpg",
        caption: "Табличка: корм для фламинго — 20 ฿",
      },
      {
        url: "/images/places/monster-aquarium-pattaya-goats.jpg",
        caption: "Козлята выглядывают из загона",
      },
      {
        url: "/images/places/monster-aquarium-pattaya-kid-goat.jpg",
        caption: "Козлёнок в проходе между загонами",
      },
    ],
    photoRightsNote: OWN("2025-06"),
  },
  {
    slug: "pattaya-dinosaur-kingdom",
    description:
      "Парк под открытым небом с фигурами динозавров в натуральную величину; на флагах он назван самым большим парком " +
      "аниматронных динозавров в Таиланде. Фигуры стоят вдоль дорожек за невысоким ограждением: брахиозавр высотой с деревья, стегозавр, " +
      "рогатые и утконосые динозавры. Для детей расставлены места для фото, в которые можно забираться целиком: " +
      "большие яйца и расколотая «скорлупа»; у входа — арка-рамка с названием парка. Территория поделена на зоны — " +
      "среди них травоядные и «детский сад динозавров».",
    descriptionEn:
      "An open-air park with life-size dinosaur figures; its flags call it the biggest animatronic dinosaur park in Thailand. " +
      "The figures stand along the paths behind a low rope fence: a brachiosaurus as tall as the trees, a stegosaurus, " +
      "horned and duck-billed dinosaurs. There are photo spots children can climb right into: " +
      'large eggs and a cracked "shell"; by the entrance there is a frame arch with the park\'s name. The grounds are divided into zones, ' +
      'including herbivores and a "Dino Kindergarten".',
    tips: [
      {
        text: "Весь парк на улице. Тень от деревьев есть вдоль дорожек, а места для фото стоят на открытом солнце — возьмите панаму и воду.",
        textEn:
          "The whole park is outdoors. Trees shade the paths, but the photo spots are in full sun — bring a hat and water.",
      },
      {
        text: "Динозавры стоят за ограждением, трогать их нельзя. В большие яйца и «скорлупу» забираться можно.",
        textEn:
          'The dinosaurs are behind a fence and cannot be touched. Children may climb into the large eggs and the "shell".',
      },
      {
        text: "Выход устроен через магазин игрушек — будьте готовы к просьбам.",
        textEn: "The exit leads through the toy shop — be ready for requests.",
      },
      {
        text: "Таблички у фигур на тайском; латиницей написано только название динозавра.",
        textEn:
          "Signs by the figures are in Thai; only the dinosaur's name is in Latin script.",
      },
      {
        text: "Дорожки — асфальт, бетон и плитка, местами гравий. С малышом неспешный обход занял около часа.",
        textEn:
          "Paths are asphalt, concrete and paving, with gravel in places. An unhurried walk with a toddler took about an hour.",
      },
    ],
    flags: { outdoor: true },
    cover: {
      url: "/images/places/pattaya-dinosaur-kingdom.jpg",
      rightsNote: OWN("2025-06"),
    },
    photos: [
      {
        url: "/images/places/pattaya-dinosaur-kingdom-eggs.jpg",
        caption: "Яйца, в которые можно забраться",
      },
      {
        url: "/images/places/pattaya-dinosaur-kingdom-egg.jpg",
        caption: "Яйцо в рост ребёнка",
      },
      {
        url: "/images/places/pattaya-dinosaur-kingdom-stegosaurus.jpg",
        caption: "Стегозавр — для масштаба",
      },
      {
        url: "/images/places/pattaya-dinosaur-kingdom-hatching.jpg",
        caption: "Яйцо с окошком",
      },
      {
        url: "/images/places/pattaya-dinosaur-kingdom-shell.jpg",
        caption: "«Скорлупа» в зоне травоядных",
      },
    ],
    photoRightsNote: OWN("2025-06"),
  },
  {
    slug: "kidzooona-central-pattaya",
    description:
      "Крытая игровая Kidzooona (Aeon Fantasy) в торговом центре Central Pattaya: один большой зал с кондиционером. " +
      "Главное здесь — городок ролевых домиков вдоль «дороги» с разметкой: пиццерия, кондитерская, кухня, цветочный, бургерная, " +
      "супермаркет с тележками, больница, почта, полицейский участок с машиной и пожарная часть. В домиках — игрушечные кассы, муляжи еды и костюмы. " +
      "По дороге ездят на педальных машинках и трёхколёсных велосипедах. Есть большой сухой бассейн с башней, надувная горка, " +
      "многоуровневый лабиринт с трубой-горкой и цветная плетёная сетка для лазанья. Для спокойной игры — стол с кинетическим песком, " +
      "вигвамы, кубики и сенсорные столы.",
    descriptionEn:
      "The Kidzooona indoor playground (Aeon Fantasy) in the Central Pattaya mall: one large air-conditioned hall. " +
      'Its centrepiece is a town of role-play houses along a marked "road": a pizzeria, patisserie, kitchen, flower shop, burger shop, ' +
      "a supermarket with trolleys, a hospital, a post office, a police station with a car and a fire station. Inside are toy tills, play food and costumes. " +
      "Children ride pedal cars and tricycles along the road. There is a large ball pit with a tower, an inflatable slide, " +
      "a multi-level maze with a tube slide and a colourful woven climbing net. For quieter play there is a kinetic sand table, " +
      "teepees, blocks and touch-screen tables.",
    tips: [
      {
        text: "В зале все в носках — и дети, и взрослые. Возьмите носки на всех, кто заходит.",
        textEn:
          "Everyone in the hall wears socks — children and adults alike. Bring socks for everyone going in.",
      },
      {
        text: "Есть шкафчики для вещей. Воду и напитки продают из холодильника в зале: вода 20 ฿, напитки и молоко 30 ฿ (май 2026).",
        textEn:
          "There are lockers for your things. Water and drinks are sold from a fridge in the hall: water 20 ฿, soft drinks and milk 30 ฿ (May 2026).",
      },
      {
        text: "Аквагрим — 89 ฿ (май 2026); есть сладкая вата и мороженое.",
        textEn:
          "Face painting is 89 ฿ (May 2026); candy floss and ice cream are available.",
      },
      {
        text: "Карусель и качалки у входа работают за жетоны — это отдельно от билета в игровую.",
        textEn:
          "The carousel and ride-ons by the entrance run on tokens — separate from the playground ticket.",
      },
      {
        text: "Костюмы в домиках стирают раз в неделю — об этом таблички рядом с вешалками.",
        textEn:
          "Costumes in the houses are washed once a week, as the signs by the racks say.",
      },
    ],
    flags: { indoor: true, hasAirCon: true },
    categorySlugs: ["indoor-playground"],
    cover: {
      url: "/images/places/kidzooona-central-pattaya.jpg",
      rightsNote: OWN("2025-06"),
    },
    photos: [
      {
        url: "/images/places/kidzooona-central-pattaya-police.jpg",
        caption: "Полицейский участок с машиной",
      },
      {
        url: "/images/places/kidzooona-central-pattaya-net.jpg",
        caption: "Плетёная сетка и лабиринт",
      },
      {
        url: "/images/places/kidzooona-central-pattaya-supermarket.jpg",
        caption: "Супермаркет с тележкой",
      },
      {
        url: "/images/places/kidzooona-central-pattaya-ball-pit.jpg",
        caption: "Сухой бассейн",
      },
      {
        url: "/images/places/kidzooona-central-pattaya-burger-shop.jpg",
        caption: "Бургерная: касса и костюм повара",
      },
      {
        url: "/images/places/kidzooona-central-pattaya-fire-truck.jpg",
        caption: "Пожарная машина",
      },
      {
        url: "/images/places/kidzooona-central-pattaya-sand.jpg",
        caption: "Стол с кинетическим песком",
      },
    ],
    photoRightsNote: OWN("2025-06 – 2026-09"),
  },
  {
    slug: "sunshine-cat-cafe",
    description:
      "Небольшое котокафе в Наклуа: один светлый зал с витриной на улицу. По залу расставлены когтеточки-башни, деревянные домики, " +
      "полки и большое колесо для кошек; сидят здесь низко, у пола — удобно с малышом. Кошки спокойные: спят у окна и подходят " +
      "за лакомством, которое дают в стаканчике для животных. Напитки готовят за стеклянной перегородкой, отдельно от зала с кошками.",
    descriptionEn:
      "A small cat café in Naklua: one bright room with a shop window onto the street. Around the room are scratching towers, wooden houses, " +
      "shelves and a large cat wheel; seating is low, near the floor — handy with a toddler. The cats are calm: they sleep by the window and come over " +
      "for treats, which are given in a cup for pets. Drinks are made behind a glass partition, separate from the cat room.",
    tips: [
      {
        text: "Правила на табличке: кошек не берут на руки, не кормят своей едой и не беспокоят, пока они едят.",
        textEn:
          "House rules on the sign: do not pick the cats up, do not feed them your own food and do not disturb them while they eat.",
      },
      {
        text: "За детьми просят внимательно следить; за вещи, испорченные кошками, кафе не отвечает.",
        textEn:
          "You are asked to supervise children closely; the café is not responsible for belongings damaged by the cats.",
      },
      {
        text: "Пол — глянцевая плитка: бегать скользко.",
        textEn: "The floor is glossy tile: slippery for running.",
      },
    ],
    flags: { indoor: true, animalContact: true },
    cover: { url: "/images/places/sunshine-cat-cafe.jpg", rightsNote: OWN("2025-06") },
    photos: [
      {
        url: "/images/places/sunshine-cat-cafe-treats.jpg",
        caption: "Кошек можно угощать лакомством",
      },
      {
        url: "/images/places/sunshine-cat-cafe-room.jpg",
        caption: "Зал: домики, полки и когтеточки",
      },
      { url: "/images/places/sunshine-cat-cafe-sleeping.jpg", caption: "Сон у окна" },
      {
        url: "/images/places/sunshine-cat-cafe-feeding.jpg",
        caption: "Лакомство с руки",
      },
    ],
    photoRightsNote: OWN("2025-06"),
  },
];
