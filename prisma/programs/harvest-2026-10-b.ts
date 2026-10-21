import type { DraftProgram } from "./overture-batch-1.types";

/**
 * Вторая волна сбора 21.10.2026 — занятия (см. prisma/places/harvest-2026-10-b.ts):
 * секции, школы и кружки с детскими группами — музыка, математика,
 * единоборства, спорт, плавание, танцы, рисование и др. Точка и ссылка на
 * карточку — с карты; контакты — только официальные страницы. Категории,
 * которых ещё нет в справочнике (martial-arts, sport, robotics, chess,
 * languages, theatre), скрипт покажет в отчёте — выбрать в админке.
 */
export const HARVEST_2026_10_PROGRAMS_B: readonly DraftProgram[] = [
  {
    slug: "royal-varuna-yacht-club",
    name: "Royal Varuna Yacht Club — парусный спорт",
    venueAddress:
      "286 หมู่ที่ 12 ถนน พระตำหนัก, Muang Pattaya, Bang Lamung District, Chon Buri 20150",
    venueLatitude: 12.918179499999999,
    venueLongitude: 100.85697619999999,
    googleMapsUrl:
      "https://www.google.com/maps/place/Royal+Varuna+Yacht+Club/@12.918179499999999,100.85697619999999,17z/data=!3m1!4b1!4m6!3m5!1s0x3102964606f7aa15:0x2ef7f947a2f166c8!8m2!3d12.918179499999999!4d100.85697619999999",
    categorySlug: "sport",
    website: "https://www.varuna.org/",
    facebookUrl: "https://www.facebook.com/RoyalVarunaYachtClub/",
    instagramUrl: "https://www.instagram.com/rvyc_thailand/",
    phone: "+66 38 250 116",
    lineUrl: null,
    about:
      "Яхт-клуб на Пратамнаке; на сайте — детские курсы парусного спорта RYA Youth Courses 2026. Возраст и доступ для нечленов клуба не указаны.",
    otherSources: [],
  },
];
