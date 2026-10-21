import type { DraftPlace } from "./overture-batch-1";

/**
 * Вторая волна сбора 21.10.2026 (Восточная Паттайя, Хуай Яй, Нонг Пруэ,
 * Банг Сарай). Прочёс карт по детским категориям
 * (игровые, кафе, животные, парки, аттракционы) + находки по русским,
 * английским, тайским источникам и открытым страницам Facebook; кандидаты
 * из прошлого ручного списка («позвонить/решить» и побочные находки).
 * Точка и ссылка на карточку — с карты; закрытые на картах отсеяны.
 * Контакты — только официальные страницы и сайты. В описании — пометка
 * «[черновик]» с тем, что известно, и источниками: её заменяют описанием.
 * Всё — PENDING, на сайт не попадает до одобрения в /admin.
 */
export const HARVEST_2026_10_PLACES_B: readonly DraftPlace[] = [
  {
    slug: "ban-chang-khon-thawee-sin",
    name: "Ban Chang Khon Thawee Sin (บ้านช่างโขนทวีศิลป์)",
    address: "Unnamed Road Pattaya City, Bang Lamung District, Chon Buri 20150",
    latitude: 12.939888499999999,
    longitude: 100.9321921,
    googleMapsUrl:
      "https://www.google.com/maps/place/%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%8A%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%82%E0%B8%99%E0%B8%97%E0%B8%A7%E0%B8%B5%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C/@12.939888499999999,100.9321921,17z/data=!3m1!4b1!4m6!3m5!1s0x31029575b18a11ab:0x9c2edf83a5a8adcd!8m2!3d12.939888499999999!4d100.9321921!16s%2Fg%2F11g1qjkfw4",
    website: null,
    facebookUrl: null,
    instagramUrl: null,
    phone: null,
    lineUrl: null,
    animals: false,
    categorySlugs: [],
    about:
      "Музей по категории карт в Паттайе; судя по названию — дом мастера масок кхон. (Уверенность низкая: проверить.)",
    otherSources: [],
  },
  {
    slug: "camp-chang-adventure-park",
    name: "Camp Chang Adventure Park",
    address:
      "108/14 Camp Chang Adventure, ซอย เขาชีจรรย์ Sattahip District, Chon Buri 20250",
    latitude: 12.777400799999999,
    longitude: 100.9517169,
    googleMapsUrl:
      "https://www.google.com/maps/place/Camp+Chang+Adventure+Park+%E0%B9%81%E0%B8%84%E0%B8%A1%E0%B8%9E%E0%B9%8C%E0%B8%8A%E0%B9%89%E0%B8%B2%E0%B8%87+%E0%B9%81%E0%B8%AD%E0%B8%94%E0%B9%81%E0%B8%A7%E0%B8%99%E0%B9%80%E0%B8%88%E0%B8%AD%E0%B8%A3%E0%B9%8C+%E8%B1%A1%E8%90%A5%E5%A5%87%E9%81%87%E4%B9%90%E5%9B%AD/@12.777400799999999,100.9517169,17z/data=!3m1!4b1!4m6!3m5!1s0x310293b6a5f3f32b:0xea6323223f0213f2!8m2!3d12.777400799999999!4d100.9517169!16s%2Fg%2F11fnc2_lm4",
    website: null,
    facebookUrl: "https://www.facebook.com/campchangadventure",
    instagramUrl: null,
    phone: null,
    lineUrl: null,
    animals: true,
    categorySlugs: [],
    outdoor: true,
    about:
      "Слоновий лагерь — парк приключений у Кхао Чи Чан (Саттахип), по карточке карт — достопримечательность. Формат с животными — решение за вами. (Уверенность низкая: проверить.)",
    otherSources: [],
  },
  {
    slug: "datsun-nissan-museum-pong",
    name: "Datsun & Nissan Museum",
    address: "WXCP+8RG, Pornprapanimit Rd, Pong, Bang Lamung District, Chon Buri 20150",
    latitude: 12.9208091,
    longitude: 100.9870902,
    googleMapsUrl:
      "https://www.google.com/maps/place/Datsun%26Nissan+Museum/@12.9208091,100.9870902,17z/data=!3m1!4b1!4m6!3m5!1s0x3102eb6441a6bbb5:0x3bf95f1b75362ce9!8m2!3d12.9208091!4d100.9870902!16s%2Fg%2F11qp12vh66",
    website: null,
    facebookUrl: null,
    instagramUrl: null,
    phone: null,
    lineUrl: null,
    animals: false,
    categorySlugs: [],
    about:
      "Музей (по категории карт) в районе Понг, Pornprapanimit Rd; судя по названию — коллекция автомобилей Datsun и Nissan. (Уверенность низкая: проверить.)",
    otherSources: [],
  },
  {
    slug: "khao-mai-kaeo-reservoir-park",
    name: "Khao Mai Kaeo Reservoir Park",
    address: "X25Q+FJ4, Khao Mai Kaeo, Bang Lamung District, Chon Buri 20150",
    latitude: 12.9586426,
    longitude: 101.03908679999999,
    googleMapsUrl:
      "https://www.google.com/maps/place/Khao+Mai+Keao+Reservation+Park/@12.9586426,101.03908679999999,17z/data=!3m1!4b1!4m6!3m5!1s0x3102c1c7adb16aeb:0xab5d798f2cb9cc6e!8m2!3d12.9586426!4d101.03908679999999!16s%2Fg%2F1hm27wvhv",
    website: null,
    facebookUrl: null,
    instagramUrl: null,
    phone: null,
    lineUrl: null,
    animals: false,
    categorySlugs: ["playground"],
    outdoor: true,
    about:
      "Парк у водохранилища в Кхао Май Кэо (по карточке карт — парк и достопримечательность, 450+ отзывов). Есть ли детская площадка — проверить. (Уверенность низкая: проверить.)",
    otherSources: [],
  },
  {
    slug: "kid-soft-play-pattaya",
    name: "Kid Soft Play",
    address: "WV4V+HXP, Pattaya City, Bang Lamung District, Chon Buri 20150",
    latitude: 12.906525499999999,
    longitude: 100.89507669999999,
    googleMapsUrl:
      "https://www.google.com/maps/place/Kid+Soft+Play/@12.906525499999999,100.89507669999999,17z/data=!3m1!4b1!4m6!3m5!1s0x310295000c56ef97:0x84349ad496aee3ed!8m2!3d12.906525499999999!4d100.89507669999999!16s%2Fg%2F11wwds7c_7",
    website: null,
    facebookUrl: null,
    instagramUrl: null,
    phone: null,
    lineUrl: null,
    animals: false,
    categorySlugs: ["indoor-playground"],
    about:
      "Детская игровая площадка (soft play) по карточке карт — район Тепразит / Джомтьен Second Road. (Уверенность низкая: проверить.)",
    otherSources: [],
  },
  {
    slug: "koh-samae-san-nature-museum",
    name: "Koh Samae San Nature Museum (พิพิธภัณฑ์ธรรมชาติเกาะแสมสาร)",
    address: "PWXG+86X, Bang Sare, Sattahip District, Chon Buri 20250",
    latitude: 12.748222199999999,
    longitude: 100.9245,
    googleMapsUrl:
      "https://www.google.com/maps/place/%E0%B8%9E%E0%B8%B4%E0%B8%9E%E0%B8%B4%E0%B8%98%E0%B8%A0%E0%B8%B1%E0%B8%93%E0%B8%91%E0%B9%8C%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4%E0%B9%80%E0%B8%81%E0%B8%B2%E0%B8%B0%E0%B9%81%E0%B8%AA%E0%B8%A1%E0%B8%AA%E0%B8%B2%E0%B8%A3/@12.748222199999999,100.9245,17z/data=!3m1!4b1!4m6!3m5!1s0x31028d0079154f89:0xcf98936aa839ea79!8m2!3d12.748222199999999!4d100.9245!16s%2Fg%2F11z9f1xz8v",
    website: null,
    facebookUrl: null,
    instagramUrl: null,
    phone: null,
    lineUrl: null,
    animals: false,
    categorySlugs: [],
    about:
      "Природный музей острова Самэсан (по названию) в районе Банг Сарэй. (Уверенность низкая: проверить.)",
    otherSources: [],
  },
  {
    slug: "map-prachan-reservoir-park",
    name: "Map Prachan Reservoir Park",
    address: "WXXF+7HV, Pong, Bang Lamung District, Chon Buri 20150",
    latitude: 12.9482416,
    longitude: 100.97392529999999,
    googleMapsUrl:
      "https://www.google.com/maps/place/Map+Prachan+Reservoir+Park/@12.9482416,100.97392529999999,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bffbef728435:0xe6eed9bc45ab2f74!8m2!3d12.9482416!4d100.97392529999999!16s%2Fg%2F1hf9nfpd1",
    website: null,
    facebookUrl: null,
    instagramUrl: null,
    phone: null,
    lineUrl: null,
    animals: false,
    categorySlugs: ["playground"],
    outdoor: true,
    about:
      "Большой парк у водохранилища Мап Прачан в Понге (по карточке карт — государственный парк, 860+ отзывов). Есть ли детская площадка — проверить. (Уверенность низкая: проверить.)",
    otherSources: [],
  },
  {
    slug: "on-ground-cafe-farm",
    name: "On Ground Cafe & Farm",
    address:
      "111/11 ม.2 ถ.บายพาส 36 ตรงข้ามสนามแข่งรถ พีระเซอร์กิต Khao Mai Kaeo, Bang Lamung District, Chon Buri 20150",
    latitude: 12.9284015,
    longitude: 101.0259669,
    googleMapsUrl:
      "https://www.google.com/maps/place/On+Ground+Cafe+%26+Farm/@12.9284015,101.0259669,17z/data=!3m1!4b1!4m6!3m5!1s0x3102ebc17cbb0a31:0x2441ab6fe0381491!8m2!3d12.9284015!4d101.0259669!16s%2Fg%2F11pcvbjf5r",
    website: null,
    facebookUrl: null,
    instagramUrl: null,
    phone: null,
    lineUrl: null,
    animals: true,
    categorySlugs: [],
    about:
      "Кафе в саду и мини-зоопарк при нём: кролики, мини-пиги, козы, овцы, лошади, животных можно кормить. Напротив автодрома Bira Circuit, Кхао Май Кэо.",
    otherSources: [],
  },
  {
    slug: "suriyaland",
    name: "Suriyaland",
    address: "191 ม.11 ต Bang Sare, Sattahip District, Chon Buri 20250",
    latitude: 12.748876,
    longitude: 100.93613289999999,
    googleMapsUrl:
      "https://www.google.com/maps/place/Suriyaland+Pattaya/@12.748876,100.93613289999999,17z/data=!3m1!4b1!4m6!3m5!1s0x31028d667564238d:0xd0d96192fa899fea!8m2!3d12.748876!4d100.93613289999999!16s%2Fg%2F11k5sgqxc5",
    website: null,
    facebookUrl: "https://www.facebook.com/Suriyaland/",
    instagramUrl: null,
    phone: null,
    lineUrl: null,
    animals: false,
    categorySlugs: [],
    about:
      "Арт-пространство с кафе и галереей современного искусства в Банг Сарае (по категориям карт — достопримечательность, арт-кафе, музей), 500+ отзывов. (Уверенность низкая: проверить.)",
    otherSources: [],
  },
  {
    slug: "viharn-sien-anek-kusala-sala",
    name: "Viharn Sien (Anek Kusala Sala)",
    address: "QXQ4+44G, Pattaya City, Bang Lamung District, Chon Buri 20150",
    latitude: 12.7878131,
    longitude: 100.95534099999999,
    googleMapsUrl:
      "https://www.google.com/maps/place/Anek+Kusala+Sala+%28Viharn+Sien%29/@12.7878131,100.95534099999999,17z/data=!3m1!4b1!4m6!3m5!1s0x310292ebcabf710f:0x837a07fcf0187a5c!8m2!3d12.7878131!4d100.95534099999999!16s%2Fg%2F11c1p612zn",
    website: null,
    facebookUrl: null,
    instagramUrl: null,
    phone: null,
    lineUrl: null,
    animals: false,
    categorySlugs: [],
    indoor: true,
    about:
      "Храмовый комплекс-музей китайского искусства Вихарн Сиен (по карточке карт — музей и достопримечательность). (Уверенность низкая: проверить.)",
    otherSources: [],
  },
];
