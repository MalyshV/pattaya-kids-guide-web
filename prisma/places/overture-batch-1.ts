/**
 * Первая партия черновиков (20 мест) из ручного отбора по открытой базе
 * Overture Maps (docs/DATA_ENGINE.md). Из базы взяты только факты о
 * заведении — название, адрес, сайт, ссылка на страницу в Facebook; точка и
 * ссылка на карточку сняты с карты вручную 11.10.2026. Описаний, категорий,
 * цен, часов и фото здесь нет: это работа человека, а черновик на сайт не
 * попадает до одобрения.
 *
 * animals — место работает с животными (вопрос этики): скрипт помечает такие
 * строки в отчёте, чтобы при вычитке не потерять решение, как о них писать.
 */
export type DraftPlace = {
  slug: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  /// только проверенные открывающиеся сайты; null = своего сайта нет
  website: string | null;
  /// только официальные страницы; неофициальные «страницы-места» не берём
  facebookUrl: string | null;
  animals: boolean;
};

export const OVERTURE_BATCH_1: readonly DraftPlace[] = [
  {
    slug: "ramayana-water-park",
    name: "Ramayana Water Park",
    address: "9 หมู่ 7 Ban Yen Rd, Na Chom Thian, Sattahip, Chon Buri 20250",
    latitude: 12.7499141,
    longitude: 100.9618801,
    googleMapsUrl:
      "https://www.google.com/maps/place/Ramayana+Water+Park/@12.7499141,100.9618801,17z/data=!3m1!4b1!4m6!3m5!1s0x31028d5d2353b639:0x21e96203669e7ec6!8m2!3d12.7499141!4d100.9618801!16s%2Fg%2F11bc5hlky0",
    website: "https://www.ramayanawaterpark.com/",
    facebookUrl: "https://www.facebook.com/737819946294228",
    animals: false,
  },
  {
    slug: "columbia-pictures-aquaverse",
    name: "Columbia Pictures Aquaverse",
    address: "888 หมู่ 8 Sukhumvit Rd, Na Chom Thian, Sattahip, Chon Buri 20250",
    latitude: 12.7844267,
    longitude: 100.9142196,
    googleMapsUrl:
      "https://www.google.com/maps/place/Columbia+Pictures+Aquaverse/@12.7844267,100.9142196,17z/data=!3m1!4b1!4m6!3m5!1s0x3102924027b5fced:0xf8afe12456c6fa8e!8m2!3d12.7844267!4d100.9142196!16s%2Fg%2F119vkh6tq",
    website: "https://columbiapicturesaquaverse.com/en/",
    facebookUrl: "https://www.facebook.com/1715144052121109",
    animals: false,
  },
  {
    slug: "ripleys-believe-it-or-not-pattaya",
    name: "Ripley's Believe It or Not! Pattaya",
    address:
      "Royal Garden Plaza, 218 Beach Rd, Pattaya City, Bang Lamung, Chon Buri 20150",
    latitude: 12.9286002,
    longitude: 100.8785996,
    googleMapsUrl:
      "https://www.google.com/maps/place/Ripley%27s+Believe+It+or+Not!/@12.9286002,100.8785996,17z/data=!3m1!4b1!4m6!3m5!1s0x310296118e51cca3:0x1599573ddf97f3dd!8m2!3d12.9286002!4d100.8785996!16s%2Fg%2F11b8079xt6",
    website: "https://ripleysthailand.com/",
    facebookUrl: "https://www.facebook.com/139989232719580",
    animals: false,
  },
  {
    slug: "art-in-paradise-pattaya",
    name: "Art In Paradise Pattaya",
    address: "78/34 หมู่ 9 Pattaya Sai Song Rd, Nong Prue, Bang Lamung, Chon Buri 20150",
    latitude: 12.9482448,
    longitude: 100.8897897,
    googleMapsUrl:
      "https://www.google.com/maps/place/Art+In+Paradise+Pattaya/@12.9482448,100.8897897,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bdfe2de3acc5:0x76b78a551b17b09f!8m2!3d12.9482448!4d100.8897897!16s%2Fg%2F12llhdk8v",
    website: null,
    facebookUrl: "https://www.facebook.com/240382519416063",
    animals: false,
  },
  {
    slug: "mini-siam",
    name: "Mini Siam",
    address: "387 Sukhumvit Rd, Pattaya City, Bang Lamung, Chon Buri 20150",
    latitude: 12.9554576,
    longitude: 100.9084709,
    googleMapsUrl:
      "https://www.google.com/maps/place/%D0%9C%D0%B8%D0%BD%D0%B8+%D1%81%D0%B8%D0%B0%D0%BC/@12.9554576,100.9084709,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29ee0d267281b:0x3cecc615bcc2c12a!8m2!3d12.9554576!4d100.9084709!16s%2Fm%2F0n4cc7q",
    website: null,
    facebookUrl: "https://www.facebook.com/210070585684809",
    animals: false,
  },
  {
    slug: "pattaya-dinosaur-kingdom",
    name: "Pattaya Dinosaur Kingdom",
    address: "Sukhumvit Rd, North Pattaya, Bang Lamung, Chon Buri 20150",
    latitude: 12.9619462,
    longitude: 100.9094521,
    googleMapsUrl:
      "https://www.google.com/maps/place/%E0%B8%AA%E0%B8%A7%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%82%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%9E%E0%B8%B1%E0%B8%97%E0%B8%A2%E0%B8%B2+Pattaya%E2%80%8B+Dinosaur+Kingdom/@12.9619462,100.9094521,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bf880a8d3f19:0xf9431e14d3b8b3b9!8m2!3d12.9619462!4d100.9094521!16s%2Fg%2F11jszsddm6",
    website: null,
    facebookUrl: "https://www.facebook.com/118520374548811",
    animals: false,
  },
  {
    slug: "underwater-world-pattaya",
    name: "Underwater World Pattaya",
    address: "22/22 หมู่ 11 Sukhumvit Rd, Nong Prue, Bang Lamung, Chon Buri 20150",
    latitude: 12.896693,
    longitude: 100.896062,
    googleMapsUrl:
      "https://www.google.com/maps/place/%D0%9F%D0%BE%D0%B4%D0%B2%D0%BE%D0%B4%D0%BD%D1%8B%D0%B9+%D0%BC%D0%B8%D1%80+Pattaya+Co.,+Ltd./@12.896693,100.896062,17z/data=!3m1!4b1!4m6!3m5!1s0x3102942c85ccddd1:0x4fe63d30f2bd8e1!8m2!3d12.896693!4d100.896062!16s%2Fg%2F120lqrfg",
    website: "https://underwaterworldpattaya.com/",
    facebookUrl: null,
    animals: false,
  },
  {
    slug: "pattaya-kart-speedway",
    name: "Pattaya Kart Speedway",
    address: "248/2 Thepprasit Rd, Nong Prue, Bang Lamung, Chon Buri 20150",
    latitude: 12.905129,
    longitude: 100.8828271,
    googleMapsUrl:
      "https://www.google.com/maps/place/Pattaya+Kart+Speedway/@12.905129,100.8828271,17z/data=!3m1!4b1!4m6!3m5!1s0x3102967ba5670cb9:0x1a3008bcba4374c!8m2!3d12.905129!4d100.8828271!16s%2Fg%2F1tkb2kqd",
    website: "https://pattayakart.com/en/",
    facebookUrl: "https://www.facebook.com/108637289175077",
    animals: false,
  },
  {
    slug: "monster-aquarium-pattaya",
    name: "Monster Aquarium Pattaya",
    address: "125/1 หมู่ 8 Nong Pla Lai, Bang Lamung, Chon Buri 20150",
    latitude: 12.9717726,
    longitude: 100.9257935,
    googleMapsUrl:
      "https://www.google.com/maps/place/Monster+Aquarium+Pattaya/@12.9717726,100.9257935,17z/data=!3m1!4b1!4m6!3m5!1s0x3102be4f49f88a83:0x1dbd54600280fa85!8m2!3d12.9717726!4d100.9257935!16s%2Fg%2F11c1pg8syf",
    website: null,
    facebookUrl: "https://www.facebook.com/257268364610292",
    animals: true,
  },
  {
    slug: "the-view-ferris-wheel-pattaya",
    name: "The View Ferris Wheel Pattaya",
    address: "225/78 หมู่ 9, Runway Market, Nong Prue, Bang Lamung, Chon Buri 20150",
    latitude: 12.9427558,
    longitude: 100.8869255,
    googleMapsUrl:
      "https://www.google.com/maps/place/The+View+Ferris+Wheel+Pattaya/@12.9427558,100.8869255,17z/data=!3m1!4b1!4m6!3m5!1s0x310297003977daa1:0xf34f8425501010e9!8m2!3d12.9427558!4d100.8869255!16s%2Fg%2F11mrx_v31t",
    website: "https://theview-pattaya.com/",
    facebookUrl: "https://www.facebook.com/822884117581271",
    animals: false,
  },
  {
    slug: "pattaya-elephant-sanctuary",
    name: "Pattaya Elephant Sanctuary",
    address: "217/41 Moo 7, Bang Sare, Sattahip, Chon Buri 20250",
    latitude: 12.713896,
    longitude: 100.9299272,
    googleMapsUrl:
      "https://www.google.com/maps/place/Pattaya+Elephant+Sanctuary/@12.713896,100.9299272,17z/data=!3m1!4b1!4m6!3m5!1s0x31028d5c1c575d5d:0x2259b59f346cabe6!8m2!3d12.713896!4d100.9299272!16s%2Fg%2F11h3bnn4q7",
    website: "https://www.pattayaelephantsanctuary.org/",
    facebookUrl: "https://www.facebook.com/330403550872203",
    animals: true,
  },
  {
    slug: "pipo-pony-club",
    name: "Pipo Pony Club",
    address: "949 หมู่ 1, Muang Pattaya, Bang Lamung, Chon Buri 20150",
    latitude: 12.9531499,
    longitude: 100.9384299,
    googleMapsUrl:
      "https://www.google.com/maps/place/Pipo+Pony+Club/@12.9531499,100.9384299,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bfd262bd5bd9:0x765ce62b9a36c201!8m2!3d12.9531499!4d100.9384299!16s%2Fg%2F11b6csbmqd",
    website: null,
    facebookUrl: "https://www.facebook.com/635091933231410",
    animals: true,
  },
  {
    slug: "big-bee-farm-pattaya",
    name: "Big Bee Farm Pattaya",
    address: "41/10 หมู่ 3, Nong Pla Lai, Bang Lamung, Chon Buri 20150",
    latitude: 12.9744877,
    longitude: 100.9676458,
    googleMapsUrl:
      "https://www.google.com/maps/place/Big+Bee+Farm+Pattaya/@12.9744877,100.9676458,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bf906bc4ac37:0xa1a5aed5857225a6!8m2!3d12.9744877!4d100.9676458!16s%2Fg%2F1hm69fbpl",
    website: null,
    facebookUrl: "https://www.facebook.com/113607053756893",
    animals: true,
  },
  {
    slug: "family-park-pattaya",
    name: "Family Park Pattaya",
    address: "73/30 Nong Pla Lai, Bang Lamung, Chon Buri 20150",
    latitude: 12.973116,
    longitude: 100.9763402,
    googleMapsUrl:
      "https://www.google.com/maps/place/Family+Park+Pattaya/@12.973116,100.9763402,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bf88c9505187:0x9730aef3fb92509f!8m2!3d12.973116!4d100.9763402!16s%2Fg%2F1yglqbt66",
    website: "https://familyparkpattaya.com/",
    facebookUrl: "https://www.facebook.com/779019201959224",
    animals: true,
  },
  {
    slug: "tiger-park-pattaya",
    name: "Tiger Park Pattaya",
    address: "349/9 หมู่ 12 Sukhumvit Rd, Nong Prue, Bang Lamung, Chon Buri 20150",
    latitude: 12.8708096,
    longitude: 100.90275,
    googleMapsUrl:
      "https://www.google.com/maps/place/Tiger+Park+Pattaya/@12.8708096,100.90275,17z/data=!3m1!4b1!4m6!3m5!1s0x3102941744fdc3d1:0xeb2643eac204ed35!8m2!3d12.8708096!4d100.90275!16s%2Fg%2F1hm1vxt68",
    website: "http://www.tigerpark.com/",
    facebookUrl: "https://www.facebook.com/165257183956184",
    animals: true,
  },
  {
    slug: "pattaya-dolphinarium",
    name: "Pattaya Dolphinarium",
    address: "555 Muang Pattaya, Bang Lamung, Chon Buri 20150",
    latitude: 12.9509367,
    longitude: 100.9365255,
    googleMapsUrl:
      "https://www.google.com/maps/place/Pattaya+Dolphinarium/@12.9509367,100.9365255,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bf3118fb5afb:0x1b37786fcd68f838!8m2!3d12.9509367!4d100.9365255!16s%2Fg%2F11fl2wr75l",
    website: "https://pattayadolphinarium.com/",
    facebookUrl: "https://www.facebook.com/271130843756781",
    animals: true,
  },
  {
    slug: "million-years-stone-park-crocodile-farm",
    name: "The Million Years Stone Park & Pattaya Crocodile Farm",
    address: "22 Nong Pla Lai, Bang Lamung, Chon Buri 20150",
    latitude: 12.9573965,
    longitude: 100.9413683,
    googleMapsUrl:
      "https://www.google.com/maps/place/%D0%9F%D0%B0%D1%80%D0%BA+%D0%BC%D0%B8%D0%BB%D0%BB%D0%B8%D0%BE%D0%BD%D0%BE%D0%BB%D0%B5%D1%82%D0%BD%D0%B8%D1%85+%D0%BA%D0%B0%D0%BC%D0%BD%D0%B5%D0%B9+%D0%B8+%D0%BA%D1%80%D0%BE%D0%BA%D0%BE%D0%B4%D0%B8%D0%BB%D0%BE%D0%B2%D0%B0%D1%8F+%D1%84%D0%B5%D1%80%D0%BC%D0%B0/@12.9573965,100.9413683,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bfcc24d00e87:0xaeffe445882e799d!8m2!3d12.9573965!4d100.9413683!16s%2Fg%2F120j8mfz",
    website: "https://www.thaistonepark.org/",
    facebookUrl: null,
    animals: true,
  },
  {
    slug: "dinopark-petting-zoo",
    name: "Dinopark Petting Zoo",
    address: "354/91 Thap Phraya 12, Nong Prue, Bang Lamung, Chon Buri 20150",
    latitude: 12.9097615,
    longitude: 100.8663452,
    googleMapsUrl:
      "https://www.google.com/maps/place/Dinopark+petting+zoo+Pattaya/@12.9097615,100.8663452,17z/data=!3m1!4b1!4m6!3m5!1s0x310297003cf722bd:0x46f0f357a9109622!8m2!3d12.9097615!4d100.8663452!16s%2Fg%2F11vqj9kg_m",
    website: null,
    facebookUrl: "https://www.facebook.com/897973496721757",
    animals: true,
  },
  {
    slug: "harbor-land-terminal-21",
    name: "Harbor Land (Terminal 21)",
    address:
      "4th fl. Terminal 21 Pattaya, 777/1 Pattaya Sai Song Rd, Bang Lamung, Chon Buri 20150",
    latitude: 12.9493155,
    longitude: 100.8905921,
    googleMapsUrl:
      "https://www.google.com/maps/place/HarborLand/@12.9493155,100.8905921,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bd39738a3f05:0x206d848a191b676e!8m2!3d12.9493155!4d100.8905921!16s%2Fg%2F11jzq73g65",
    website: "https://harborlandgroup.com/",
    facebookUrl: "https://www.facebook.com/102289172712209",
    animals: false,
  },
  {
    slug: "sanook-park",
    name: "Sanook Park",
    address: "380/105 Thepprasit Rd, Pattaya City, Bang Lamung, Chon Buri 20150",
    latitude: 12.8998956,
    longitude: 100.8840103,
    googleMapsUrl:
      "https://www.google.com/maps/place/Sanook+Park/@12.8998956,100.8840103,17z/data=!3m1!4b1!4m6!3m5!1s0x3102967b84f03753:0x9a4bfac9a992c78f!8m2!3d12.8998956!4d100.8840103!16s%2Fg%2F11fz9hylfs",
    website: null,
    facebookUrl: "https://www.facebook.com/729658763878126",
    animals: false,
  },
];
