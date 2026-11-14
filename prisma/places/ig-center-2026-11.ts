/**
 * IG Center Pattaya (Integrated Generation Center, Хуай Яй) — карточка места
 * «на полдня»: двор с площадкой и зверьками, кафе, парковка, а внутри — пять
 * занятий (prisma/programs/ig-center-2026-11.ts), которые до этого жили
 * отдельными черновиками без места. Занос — prisma/add-ig-center-2026-11.ts.
 *
 * Источники (собраны 13.11.2026):
 * - личные визиты 2025–2026 и снимки с них (плакаты, расписание, таблички);
 * - официальные страницы центра и студий в Facebook и Instagram (посты
 *   2025–2026), копия сайта igcenter-pattaya.com 2024 г. в Internet Archive
 *   (сейчас сайт — заглушка «Coming soon»);
 * - часы — с карточки центра на карте, сверены с постами 13.11.2026.
 * Цен на сам двор нигде нет — признак «бесплатно» не ставим. Кафе G Café &
 * Restaurant (две части: стойка в холле и отдельный домик у площадки) —
 * внутри этой карточки, не отдельным местом: тот же адрес и двор (решение 14.11).
 * Фото — свои, уменьшены до 1024 px, без метаданных; лица тренеров и
 * посетителей смазаны (решение 11–12.11: семья автора в кадре — можно).
 */
import type { PlaceFill } from "../../src/lib/import/place-fill";
import type { DraftPlace } from "./overture-batch-1";

const OWN = (visit: string): string => `Своё фото (визит ${visit})`;

export const IG_CENTER_SLUG = "ig-center-pattaya";

export const IG_CENTER_PLACE: DraftPlace = {
  slug: IG_CENTER_SLUG,
  name: "IG Center Pattaya",
  address: "53/48 หมู่ 4 Chaiyaphruek 2 Rd, Huai Yai, Bang Lamung, Chon Buri 20150",
  latitude: 12.8815771,
  longitude: 100.9284916,
  googleMapsUrl:
    "https://www.google.com/maps/place/IG+CENTER+PATTAYA/@12.8815771,100.9284916,17z/data=!3m1!4b1!4m6!3m5!1s0x31029560e0d80d6b:0xf81644d1a7ef227d!8m2!3d12.8815771!4d100.9284916!16s%2Fg%2F11h_z_ms6v",
  // сайт igcenter-pattaya.com сейчас — заглушка «Coming soon»: не ставим
  website: null,
  facebookUrl: "https://www.facebook.com/IGCenterPattaya",
  instagramUrl: "https://www.instagram.com/igcenterpattaya/",
  phone: "082 983 3723",
  lineUrl: "https://line.me/R/ti/p/@igcenterpattaya",
  animals: true,
  categorySlugs: ["playground", "cafe"],
  indoor: true,
  outdoor: true,
};

export const IG_CENTER_FILL: PlaceFill = {
  slug: IG_CENTER_SLUG,
  description:
    "Центр кружков и занятий в Хуай Яй, где легко провести полдня. Под одной крышей — школа плавания G Swim Academy " +
    "с крытым бассейном (раньше здесь была Manta Kids), развивающие занятия G Bright Kids, робототехника с LEGO, " +
    "музыкальная студия G Clef, художественная студия Perfect Art и фитнес-зал G Fitness для взрослых. " +
    "Пока ребёнок на занятии, родители ждут в кафе G Café & Restaurant. У него две части: стойка с кофе и сладостями " +
    "прямо в холле центра, откуда через стеклянную стену видно бассейн, и отдельный домик со столиками внутри и на террасе — " +
    "рядом с детской площадкой. В кафе кондиционер, Wi-Fi и розетки, есть детские стульчики, обычное и детское меню. Во дворе на искусственном газоне — площадка с горками и каруселью, " +
    "горка-самолёт, пруд с карпами кои и вольер с кроликами и черепахой; есть детские велосипеды, беговелы и самокаты, " +
    "чтобы покататься. По нашему опыту, во двор и в кафе можно прийти и без записи на занятия. " +
    "Внутри — игровая комната для учеников. Рядом с центром большая парковка.",
  descriptionEn:
    "A hub of children's classes and activities in Huai Yai where it is easy to spend half a day. Under one roof: " +
    "the G Swim Academy swimming school with an indoor pool (this used to be Manta Kids), G Bright Kids early-learning classes, " +
    "LEGO robotics, the G Clef music studio, the Perfect Art studio and the G Fitness gym for adults. " +
    "While children are in class, parents wait in G Café & Restaurant. It has two parts: a coffee and sweets counter " +
    "right in the centre's lobby, where the pool is visible through a glass wall, and a separate building with tables inside and on a terrace, " +
    "next to the playground. The café has air conditioning, Wi-Fi and power sockets, high chairs, a regular and a kids' menu. Outside, on artificial grass, there is a playground with slides and a carousel, " +
    "an aeroplane slide, a koi pond and an enclosure with rabbits and a tortoise; children's bikes, balance bikes and scooters are there to ride. " +
    "In our experience you can come to the garden and the café without booking a class. " +
    "Inside there is a playroom for students. There is a large car park next to the centre.",
  tips: [
    {
      text:
        "В понедельник центр и кафе закрыты. У студий свои часы: рисование — со вторника по субботу, 10:00–17:00, " +
        "музыка в будни — до 19:30. Кафе работает до 18:00, но по выходным, судя по его постам, может закрыться в 17:30.",
      textEn:
        "The centre and the café are closed on Mondays. Studios keep their own hours: art classes run Tuesday to Saturday, " +
        "10:00–17:00, and music lessons go on until 19:30 on weekdays. The café is open until 18:00, but its posts say it may close at 17:30 at weekends.",
    },
    {
      text:
        "Плавание, роботы и музыка дают бесплатное пробное занятие. На всё записываются заранее — " +
        "у каждой студии свой LINE, контакты на страницах занятий ниже.",
      textEn:
        "Swimming, robotics and music offer a free trial class. Everything is booked in advance — " +
        "each studio has its own LINE; contacts are on the class pages below.",
    },
    {
      text: "Пока ребёнок в бассейне, можно сидеть в кафе за стеклянной стеной — воду оттуда видно.",
      textEn:
        "While your child is in the pool, you can sit in the café behind the glass wall and watch.",
    },
    {
      text:
        "В помещениях центра дети ходят босиком — обувь снимают у входа. В кафе можно поработать: " +
        "есть Wi-Fi, розетки и кондиционер.",
      textEn:
        "Children go barefoot inside the centre — shoes come off at the door. The café works for remote work: " +
        "there is Wi-Fi, power sockets and air conditioning.",
    },
    {
      text:
        "Детское меню в кафе — сеты: паста, рис или макароны с наггетсами, крылышками или сосиской и картошкой фри, " +
        "около 130 ฿ (по меню 2024 года; по нашему опыту, сейчас примерно так же). Есть доставка через Grab.",
      textEn:
        "The café's kids' menu is set meals: pasta, rice or macaroni with nuggets, wings or a sausage and fries, " +
        "about 130 ฿ (per the 2024 menu; in our experience it is about the same now). Delivery is available via Grab.",
    },
    {
      text: "В кафе отмечают детские дни рождения — условия уточняйте по телефону кафе 062 479 4040.",
      textEn:
        "The café hosts children's birthday parties — ask about the terms by phone: 062 479 4040.",
    },
    {
      text:
        "Пруд с кои и вольер с кроликами — только смотреть: по табличкам, руки в воду не опускать, " +
        "рыб не ловить и в вольер не заходить.",
      textEn:
        "The koi pond and the rabbit enclosure are for watching only: signs ask you not to put hands in the water, " +
        "not to catch the fish and not to climb into the enclosure.",
    },
    {
      text:
        "Горки во дворе на солнце, тень — под большим деревом и у террасы кафе. " +
        "В жару приятнее прийти утром или ближе к вечеру.",
      textEn:
        "The slides in the garden are in the sun; there is shade under the big tree and by the café terrace. " +
        "On hot days mornings and late afternoons are more pleasant.",
    },
    {
      text:
        "Ко Дню детей в январе центр устраивает во дворе бесплатный праздник: игры, конкурсы, костюмы. " +
        "Анонсы — на странице IG Center в Facebook.",
      textEn:
        "For Children's Day in January the centre holds a free party in the garden with games, contests and costumes. " +
        "Announcements are on the IG Center Facebook page.",
    },
  ],
  hours: {
    MON: "closed",
    TUE: { open: "09:30", close: "18:30" },
    WED: { open: "09:30", close: "18:30" },
    THU: { open: "09:30", close: "18:30" },
    FRI: { open: "09:30", close: "18:30" },
    SAT: { open: "09:00", close: "18:00" },
    SUN: { open: "09:00", close: "18:00" },
  },
  flags: {
    indoor: true,
    outdoor: true,
    hasAirCon: true,
    hasFood: true,
    hasParking: true,
    hasWifi: true,
    hasCafeSeating: true,
    hasPowerOutlets: true,
    // зверьки только за оградой: смотреть можно, трогать и кормить — нет
    animalContact: false,
  },
  // категории и контакты ставит сам черновик (IG_CENTER_PLACE)
  cover: { url: "/images/places/ig-center-pattaya.jpg", rightsNote: OWN("2025-05") },
  photos: [
    {
      url: "/images/places/ig-center-pattaya-yard.jpg",
      caption: "Двор: горки, карусель и качели на газоне",
    },
    {
      url: "/images/places/ig-center-pattaya-playground.jpg",
      caption: "Игровой комплекс, за ним терраса кафе",
    },
    {
      url: "/images/places/ig-center-pattaya-cafe-terrace.jpg",
      caption: "Кафе G Café выходит прямо во двор",
    },
    {
      url: "/images/places/ig-center-pattaya-carousel.jpg",
      caption: "Карусель под большим деревом",
    },
    { url: "/images/places/ig-center-pattaya-koi.jpg", caption: "Пруд с карпами кои" },
    {
      url: "/images/places/ig-center-pattaya-rabbits.jpg",
      caption: "Вольер с кроликами и черепахой",
    },
    {
      url: "/images/places/ig-center-pattaya-pool.jpg",
      caption: "Бассейн G Swim Academy, за стеклом — кафе",
    },
    {
      url: "/images/places/ig-center-pattaya-hall.jpg",
      caption: "Холл и вход в игровую",
    },
    {
      url: "/images/places/ig-center-pattaya-playroom.jpg",
      caption: "Игровая комната для учеников",
    },
  ],
  photoRightsNote: OWN("2025-05 – 2026-11"),
  photoSource: "OWN",
};
