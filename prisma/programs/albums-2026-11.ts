import type { DraftProgram } from "./overture-batch-1.types";

/**
 * Черновики занятий из партии «личные альбомы» (11.11.2026). Как и остальные
 * студии — «занятия без каталожного места», PENDING.
 * - Stylus — личный визит 19.10.2026 и профиль студии в Instagram;
 * - Highgate, Lovell, Prime Padel — сохранённые афиши из соцсетей (дата у
 *   каждой в «Что известно»), вживую не проверены.
 * Точка, адрес и телефон — с карты (12.11.2026), сайты открываются.
 */
export const ALBUMS_2026_11_PROGRAMS: readonly DraftProgram[] = [
  {
    slug: "stylus-pattaya",
    name: "Stylus — творческая студия",
    venueAddress: "45/49 หมู่ 10, Pattaya City, Bang Lamung District, Chon Buri 20150",
    venueLatitude: 12.920535,
    venueLongitude: 100.888096,
    googleMapsUrl:
      "https://www.google.com/maps/place/Stylus_pattaya/@12.920535,100.888096,17z/data=!3m1!4b1!4m6!3m5!1s0x3102979ccc896345:0x2fe103abe0f62145!8m2!3d12.920535!4d100.888096!16s%2Fg%2F11vbzj295k",
    categorySlug: "art",
    website: null,
    facebookUrl: null,
    instagramUrl: "https://www.instagram.com/stylus_pattaya/",
    phone: "062 605 0699",
    about:
      "Арт-студия и творческая мастерская для детей и взрослых, с садом на крыше. Занятия на русском языке: " +
      "рисование, шахматы, актёрский класс, кулинарные мастер-классы, группа раннего развития (в профиле — «от 1 года»), " +
      "вечерние просмотры мультфильмов; для взрослых бывает живопись. Студия также проводит праздники и сдаёт пространство. " +
      "На визите 19.10.2026 — сенсорное занятие для малышей: кинетический песок, краски на стекле. Расписание и цены — в Instagram, здесь не внесены.",
  },
  {
    slug: "highgate-stay-and-play",
    name: "Stay and Play — Highgate International School",
    venueAddress:
      "50/28 Phornpraphanimit Road, Pattaya City, Bang Lamung District, Chon Buri 20150",
    venueLatitude: 12.9181431,
    venueLongitude: 100.9921485,
    googleMapsUrl:
      "https://www.google.com/maps/place/Highgate+International+School+Thailand+Campus/data=!4m7!3m6!1s0x3102eb7795509cc1:0x1415d100262a0977!8m2!3d12.9181431!4d100.9921485!16s%2Fg%2F11ntb8t77n",
    categorySlug: "early-development",
    website: "https://www.highgateschoolthailand.com",
    facebookUrl: null,
    instagramUrl: "https://www.instagram.com/highgatethailand/",
    phone: "092 617 8881",
    lineUrl: "https://line.me/R/ti/p/@highgate.th",
    about:
      "Бесплатная игровая группа для детей от рождения до 3 лет вместе со взрослым: песни, сказки, музыка, messy play. " +
      "По рекламе школы в Instagram (февраль 2026) — каждую пятницу 09:30–11:00 с 16.01.2026, в Visitor Centre школы. " +
      "На карте Visitor Centre теперь помечен закрытым — точка поставлена на кампус. На афише: школа «в процессе получения лицензии». " +
      "(Уверенность низкая: проверить, идёт ли группа сейчас и где.)",
  },
  {
    slug: "lovell-play-groups",
    name: "Lovell Play Groups",
    venueAddress:
      "Lovell International School, Naklua, Pattaya City, Bang Lamung District, Chon Buri 20150",
    venueLatitude: 12.9615661,
    venueLongitude: 100.8908386,
    googleMapsUrl:
      "https://www.google.com/maps/place/Lovell+International+School/@12.9615661,100.8908386,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bffd30051c3f:0x42bbf3393a5361bd!8m2!3d12.9615661!4d100.8908386!16s%2Fg%2F11q3wmpgp3",
    categorySlug: "early-development",
    website: "https://lovellschool.ac.th",
    facebookUrl: null,
    phone: "098 098 4595",
    lineUrl: "https://line.me/R/ti/p/@lovellschool",
    about:
      "Игровые группы при международном детском саду: движение, сенсорная игра, messy art, научный клуб. " +
      "Возраст — от 18 месяцев до 6 лет по группам, до 3 лет — с родителем. По афише: пн 11:00–11:40 и 15:00–16:00, " +
      "вт и ср 15:00–16:00; занятие 800 ฿, научный клуб 1 000 ฿. " +
      "(Уверенность низкая: афиша с карты, в октябре 2025 ей был уже год — расписание и цены уточнить.)",
  },
  {
    slug: "prime-padel-kids",
    name: "Детский падел — Prime Padel Pattaya",
    venueAddress:
      "16, 111 Sukhumvit 41, Pattaya City, Bang Lamung District, Chon Buri 20150",
    venueLatitude: 12.9472839,
    venueLongitude: 100.9070925,
    googleMapsUrl:
      "https://www.google.com/maps/place/Prime+Padel+Pattaya/data=!4m7!3m6!1s0x3102bdb8bae737e1:0xa181d0ec7c759804!8m2!3d12.9472839!4d100.9070925!16s%2Fg%2F11z1k1sgb_",
    categorySlug: "sport",
    website: null,
    facebookUrl: null,
    instagramUrl: "https://www.instagram.com/primepadelpattaya/",
    phone: "061 301 6421",
    about:
      "Детские тренировки по паделу с тренером: вт и чт 18:00–19:00, сб 09:00–10:00; 600 ฿ с ребёнка " +
      "(за занятие или за месяц — на афише не сказано). Возраст — «для всех детей». Сторис клуба от 29.07.2026. " +
      "(Уверенность средняя: уточнить возраст и цену; адрес — как записан на карте.)",
  },
];
