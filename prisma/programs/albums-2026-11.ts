import type { DraftProgram } from "./overture-batch-1.types";

/**
 * Черновик занятия из партии «личные альбомы» (11.11.2026): творческая студия
 * Stylus. Как и остальные студии — «занятие без каталожного места», PENDING.
 * Что известно — личный визит 19.10.2026 и профиль студии в Instagram
 * (открыт 11.11.2026); точка, адрес и телефон — с карты.
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
];
