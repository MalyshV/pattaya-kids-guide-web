import type { PrismaClient } from "@prisma/client";

/**
 * Октябрьский лагерь в Phoenix Wittaya School (1–30 октября 2026) — безместное
 * занятие (у школы нет своей карточки-места), как Tara Tots.
 *
 * Источник (22.09.2026): три афиши Instagram @phoenix_school_pattaya (K1–K3,
 * P1–P6, Secondary) + лист «After-School Activities (October 2026) K.1–K.3»;
 * адрес, телефон и точка — карточка школы в Google Картах (Plus Code WW7H+XR
 * сверен с координатами ссылки). От Вероники: лагерь открыт и для детей не из
 * школы; кружки — продление дня после основной программы (сад до 14:00).
 * Не знаем: можно ли не на весь месяц — в описании «уточняйте».
 *
 * Возраст групп — по тайской системе: K1–K3 (อนุบาล) ≈ 3–6 лет, P1–P6
 * (ประถม) ≈ 6–12, Secondary (มัธยม) — 12+; на афишах возраст не указан.
 *
 * Тайский — прямо здесь (новая запись, в thai-content.json её нет).
 * Один источник для seed.ts и точечного prisma/add-phoenix-camp.ts.
 */

export const PHOENIX_CAMP_SLUG = "phoenix-october-camp-2026";

// неразрывные пробелы в суммах: «6 500 ฿» не разрывается при переносе
const nb = " ";

type CampClass = {
  name: string;
  ageLabel: string;
  ageLabelEn: string;
  ageLabelTh: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  schedule: string;
  scheduleEn: string;
  scheduleTh: string;
};

const K = {
  ageLabel: "3–6 лет",
  ageLabelEn: "3–6 years",
  ageLabelTh: "3–6 ปี",
  minAgeMonths: 36,
  maxAgeMonths: 72,
};
const P = {
  ageLabel: "6–12 лет",
  ageLabelEn: "6–12 years",
  ageLabelTh: "6–12 ปี",
  minAgeMonths: 72,
  maxAgeMonths: 144,
};
const S = {
  ageLabel: "12+ лет",
  ageLabelEn: "12+ years",
  ageLabelTh: "12 ปีขึ้นไป",
  minAgeMonths: 144,
  maxAgeMonths: 216,
};

function monthly(
  days: { ru: string; en: string; th: string },
  amount: number,
): Pick<CampClass, "schedule" | "scheduleEn" | "scheduleTh"> {
  const ru = amount.toLocaleString("ru-RU").replace(/\s/g, nb);
  const en = amount.toLocaleString("en-US");
  return {
    schedule: `${days.ru} · ${ru}${nb}฿ / месяц`,
    scheduleEn: `${days.en} · ${en}${nb}฿ / month`,
    scheduleTh: `${days.th} · ${en}${nb}฿ / เดือน`,
  };
}

function week(
  dates: { ru: string; en: string; th: string },
  amount: number,
): Pick<CampClass, "schedule" | "scheduleEn" | "scheduleTh"> {
  const ru = amount.toLocaleString("ru-RU").replace(/\s/g, nb);
  const en = amount.toLocaleString("en-US");
  return {
    schedule: `${dates.ru} · 9:00–14:00 · ${ru}${nb}฿`,
    scheduleEn: `${dates.en} · 9:00–14:00 · ${en}${nb}฿`,
    scheduleTh: `${dates.th} · 9:00–14:00 · ${en}${nb}฿`,
  };
}

// дни недели у основных программ на афишах не указаны — только время
const K_DAY = { ru: "8:20–14:00", en: "8:20–14:00", th: "8:20–14:00" };
const P_DAY = { ru: "8:20–15:00", en: "8:20–15:00", th: "8:20–15:00" };
const AFTER_BOTH = {
  ru: "Пн–Пт 14:00–15:00 или 15:00–16:00",
  en: "Mon–Fri 14:00–15:00 or 15:00–16:00",
  th: "จ.–ศ. 14:00–15:00 หรือ 15:00–16:00",
};
const AFTER_EARLY = {
  ru: "Пн–Пт 14:00–15:00",
  en: "Mon–Fri 14:00–15:00",
  th: "จ.–ศ. 14:00–15:00",
};

/** Таблица «Классы и расписание»: названия — по афишам и листу школы (опечатки вроде «Swiming» поправлены). */
export const PHOENIX_CAMP_CLASSES: CampClass[] = [
  { name: "K1–K3 · Thai Program", ...K, ...monthly(K_DAY, 6500) },
  { name: "K1–K3 · English Program", ...K, ...monthly(K_DAY, 12000) },
  { name: "P1–P6 · Thai Program", ...P, ...monthly(P_DAY, 9500) },
  { name: "P1–P6 · English Program", ...P, ...monthly(P_DAY, 15000) },
  {
    name: "Secondary · Week 1: Art & Drama",
    ...S,
    ...week({ ru: "5–9 окт", en: "5–9 Oct", th: "5–9 ต.ค." }, 5000),
  },
  {
    name: "Secondary · Week 2: STEM",
    ...S,
    ...week(
      {
        ru: "12–16 окт (13-го выходной)",
        en: "12–16 Oct (13th off)",
        th: "12–16 ต.ค. (หยุด 13 ต.ค.)",
      },
      4000,
    ),
  },
  {
    name: "Secondary · Week 3: Sports",
    ...S,
    ...week({ ru: "19–22 окт", en: "19–22 Oct", th: "19–22 ต.ค." }, 4000),
  },
  {
    name: "Secondary · Week 4: IELTS, GED Social, GED English",
    ...S,
    ...week({ ru: "26–30 окт", en: "26–30 Oct", th: "26–30 ต.ค." }, 5000),
  },
  // кружки после основной программы сада (лист «After-School Activities K.1–K.3»)
  { name: "After-school · Thai", ...K, ...monthly(AFTER_BOTH, 2000) },
  { name: "After-school · Thai Math", ...K, ...monthly(AFTER_BOTH, 2000) },
  {
    name: "After-school · Learning Center (Play Zone)",
    ...K,
    ...monthly(AFTER_BOTH, 2500),
  },
  { name: "After-school · English", ...K, ...monthly(AFTER_EARLY, 2000) },
  { name: "After-school · Art & Hand Crafts", ...K, ...monthly(AFTER_BOTH, 2000) },
  { name: "After-school · Football", ...K, ...monthly(AFTER_EARLY, 2500) },
  { name: "After-school · Swimming", ...K, ...monthly(AFTER_EARLY, 4000) },
  { name: "After-school · Computer", ...K, ...monthly(AFTER_BOTH, 2500) },
];

export async function upsertPhoenixOctoberCamp(
  prisma: PrismaClient,
  cityId: string,
): Promise<{ id: string; classes: number }> {
  // идемпотентно: снести прежнюю запись со связями и создать заново
  const old = await prisma.placeProgram.findMany({
    where: { slug: PHOENIX_CAMP_SLUG },
    select: { id: true },
  });
  const oldIds = old.map((p) => p.id);
  await prisma.placeClass.deleteMany({ where: { programId: { in: oldIds } } });
  await prisma.programActivityCategory.deleteMany({
    where: { programId: { in: oldIds } },
  });
  await prisma.placeProgram.deleteMany({ where: { slug: PHOENIX_CAMP_SLUG } });

  const camp = await prisma.placeProgram.create({
    data: {
      slug: PHOENIX_CAMP_SLUG,
      imageUrl: "/images/activities/phoenix-october-camp.jpg",
      type: "CAMP",
      name: "Октябрьский лагерь в Phoenix School",
      nameEn: "October Camp at Phoenix School",
      nameTh: "แคมป์เดือนตุลาคมที่โรงเรียนฟีนิกซ์วิทยา",
      description:
        "Месячный лагерь в школе Phoenix Wittaya — учёба и игры весь октябрь, открыт и для детей не из школы. Садик (K1–K3) и начальная школа (P1–P6) выбирают тайскую или английскую программу: утром свободная игра и уроки (математика, язык и другие), после обеда — игры в помещении и на улице, поделки, танцы и музыка; точный набор немного отличается по программам. Тем, кто идёт на весь месяц английской программы, в последнюю неделю — однодневная экскурсия. Детям из садиковской группы после 14:00 можно продлить день кружками на выбор: тайский, английский, футбол, плавание, компьютер, поделки и другие. Для старших (Secondary) — тематические недели: искусство и театр, STEM, спорт, подготовка к IELTS и GED. Все цены и время — в таблице ниже. 13 и 23 октября — государственные праздники. Можно ли прийти не на весь месяц — уточняйте в школе: 038 232 788, phoenix.ac.th, Instagram @phoenix_school_pattaya.",
      descriptionEn:
        "A month-long camp at Phoenix Wittaya School — learning and play all through October, open to children from outside the school too. Kindergarten (K1–K3) and primary (P1–P6) choose a Thai or English program: morning free play and lessons (math, language and more); in the afternoon, indoor and outdoor games, arts and crafts, dance and music — the exact mix varies a little by program. Children on the full-month English program get a one-day school trip in the last week. Kindergarten children can extend the day after 14:00 with optional clubs: Thai, English, football, swimming, computers, crafts and more. Secondary students get themed weeks: art & drama, STEM, sports, IELTS and GED prep. All prices and times are in the table below. 13 and 23 October are public holidays. Whether you can join for part of the month — ask the school: 038 232 788, phoenix.ac.th, Instagram @phoenix_school_pattaya.",
      descriptionTh:
        "แคมป์ตลอดเดือนตุลาคมที่โรงเรียนฟีนิกซ์วิทยา ได้ทั้งเรียนและเล่น เปิดรับเด็กจากภายนอกด้วย ระดับอนุบาล (K1–K3) และประถม (P1–P6) เลือกหลักสูตรภาษาไทยหรือภาษาอังกฤษได้ ช่วงเช้าเล่นอิสระและเรียนคณิตศาสตร์ ภาษา และวิชาอื่น ๆ ช่วงบ่ายมีเกมในร่มและกลางแจ้ง ศิลปะและงานประดิษฐ์ เต้นรำและดนตรี กิจกรรมของแต่ละหลักสูตรอาจต่างกันเล็กน้อย เด็กที่เรียนหลักสูตรภาษาอังกฤษเต็มเดือนจะได้ไปทัศนศึกษา 1 วันในสัปดาห์สุดท้าย หลัง 14:00 น. เด็กอนุบาลเลือกเรียนกิจกรรมเสริมต่อได้ตามความสนใจ เช่น ภาษาไทย ภาษาอังกฤษ ฟุตบอล ว่ายน้ำ คอมพิวเตอร์ งานประดิษฐ์ สำหรับนักเรียนมัธยมมีแคมป์รายสัปดาห์ตามธีม ได้แก่ ศิลปะและการแสดง STEM กีฬา และเตรียมสอบ IELTS/GED ราคาและเวลาทั้งหมดอยู่ในตารางด้านล่าง วันที่ 13 และ 23 ตุลาคมเป็นวันหยุดราชการ หากต้องการสมัครไม่เต็มเดือน สอบถามได้ที่โรงเรียน โทร 038 232 788, phoenix.ac.th หรือ Instagram @phoenix_school_pattaya",
      // минимальная месячная цена (сад, тайская программа); все цены — в таблице
      price: 6500,
      currency: "THB",
      priceUnit: "/ месяц и выше",
      priceUnitEn: "/ month and up",
      priceUnitTh: "ขึ้นไป / เดือน",
      minAgeMonths: 36,
      maxAgeMonths: 216,
      // 1 октября 8:20 — 30 октября 16:00 (конец кружков) по Бангкоку (UTC+7)
      startDate: new Date("2026-10-01T01:20:00Z"),
      endDate: new Date("2026-10-30T09:00:00Z"),
      venueName: "Phoenix Wittaya School",
      venueNameEn: "Phoenix Wittaya School",
      venueNameTh: "โรงเรียนฟีนิกซ์วิทยา",
      venueAddress:
        "111 M.13 Soi Pattanakarn 9/1, Muang Pattaya, Bang Lamung District, Chon Buri 20150",
      // точка из ссылки Google Карт (!3d/!4d), сверена с Plus Code WW7H+XR
      venueLatitude: 12.9149887,
      venueLongitude: 100.9295991,
      cityId,
      order: 3,
      classes: {
        create: PHOENIX_CAMP_CLASSES.map((cls, index) => ({
          ...cls,
          // «с родителем / без» к лагерю не относится — плашку не показываем
          parentRequired: null,
          order: index + 1,
        })),
      },
    },
  });

  return { id: camp.id, classes: PHOENIX_CAMP_CLASSES.length };
}
