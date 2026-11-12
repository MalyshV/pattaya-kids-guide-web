import type { PrismaClient } from "@prisma/client";

/**
 * Ментальная арифметика Golden Brain, филиал North Pattaya — безместное
 * занятие (своей карточки-места у школы нет), как Tara Tots и Phoenix.
 *
 * Источники (12.11.2026):
 * - фото входа: две афиши на двери (расписание групп, бесплатное пробное
 *   занятие, телефон филиала 082 108 3528) и фасад — обложка;
 * - сайт сети goldenbrainschool.com: страница контактов (адрес филиала
 *   «221/8-9 หมู่ 5 ต.นาเกลือ», тот же телефон) и FAQ (возраст 4–9, группы
 *   5–8 детей, 2 раза в неделю по 1,5 часа, 6 уровней ≈ 3 года, цены сети);
 * - Google Карты: «โกลเด้นเบรน จินตคณิต สาขาพัทยาเหนือ», N Pattaya Rd,
 *   Plus Code XV2V+5P — точка взята оттуда.
 * Цены — общие для сети (FAQ), у филиала не подтверждены: в тексте «уточняйте».
 * Страницы филиала в соцсетях не нашлось; общая страница сети —
 * facebook.com/goldenbrainheadoffice.
 *
 * Тайский — прямо здесь (новая запись, в thai-content.json её нет).
 * Один источник для seed.ts и точечного prisma/add-golden-brain.ts.
 */

export const GOLDEN_BRAIN_SLUG = "golden-brain-north-pattaya";

// неразрывный пробел: «3 300 ฿» не разрывается при переносе
const nb = String.fromCharCode(160);

const AGE = {
  ageLabel: "4–9 лет",
  ageLabelEn: "4–9 years",
  ageLabelTh: "4–9 ปี",
  minAgeMonths: 48,
  maxAgeMonths: 108,
};

const WEEKDAY_SLOTS = "16:30–18:00 · 18:00–19:30";
const WEEKEND_SLOTS = "9:00–10:30 · 11:00–12:30 · 13:30–15:00 · 15:30–17:00";

/**
 * Таблица «Классы и расписание» — по афише филиала. Группа ходит два дня
 * подряд в одно и то же время (у PlaceClass нет перевода названия, поэтому
 * дни — коротко по-английски, как у Phoenix; время одинаково на всех языках).
 */
export const GOLDEN_BRAIN_CLASSES = [
  { name: "Tue + Wed", schedule: WEEKDAY_SLOTS },
  { name: "Thu + Fri", schedule: WEEKDAY_SLOTS },
  { name: "Sat + Sun", schedule: WEEKEND_SLOTS },
] as const;

const SEEN_AT_DOOR = new Date("2026-11-12T05:00:00Z");

const TIPS = [
  {
    topic: "trial",
    text: "Пробное занятие бесплатное: знакомство с программой, разговор с преподавателем, небольшой мастер-класс и советы о развитии ребёнка (по афише на двери филиала).",
    textEn:
      "The trial lesson is free: an introduction to the program, a chat with the teacher, a short workshop and advice on your child's development (per the poster on the branch door).",
    textTh:
      "ทดลองเรียนฟรี: ทำความรู้จักหลักสูตร พูดคุยกับครูผู้สอนโดยตรง กิจกรรม Workshop และรับฟังแนวทางการพัฒนาเด็ก (ตามโปสเตอร์หน้าสาขา)",
    verifiedAt: SEEN_AT_DOOR,
  },
  {
    topic: "language",
    text: "Сайт и афиши — только на тайском. На каком языке ведут занятия, уточняйте по телефону.",
    textEn:
      "The website and posters are in Thai only. Ask by phone which language the lessons are taught in.",
    textTh: "เว็บไซต์และโปสเตอร์มีเฉพาะภาษาไทย สอบถามภาษาที่ใช้สอนได้ทางโทรศัพท์",
    verifiedAt: SEEN_AT_DOOR,
  },
  {
    topic: "start",
    text: "Перед стартом — короткая проверка: знает ли ребёнок цифры и может ли общаться с преподавателем. Пропущенные занятия сами не отрабатываются — если ребёнок отстал, преподаватель может дать дополнительный урок (по правилам сети).",
    textEn:
      "Before starting there is a short check: whether the child knows the digits and can communicate with the teacher. Missed lessons aren't made up automatically — if a child falls behind, the teacher may offer an extra lesson (network rules).",
    textTh:
      "ก่อนเริ่มเรียนมีการทดสอบตัวเลขและดูว่าเด็กสื่อสารกับครูได้หรือไม่ หากขาดเรียนจะไม่มีการชดเชยอัตโนมัติ แต่ถ้าเด็กเรียนตามไม่ทัน ครูอาจสอนเสริมให้ตามดุลยพินิจ (ตามระเบียบของเครือ)",
    verifiedAt: null,
  },
  {
    topic: "landmark",
    text: "Ориентир — North Pattaya Road, рядом с Vayupak Nara School: удобно, если ребёнок ходит туда в сад или школу.",
    textEn:
      "Landmark: North Pattaya Road, next to Vayupak Nara School — handy if your child already goes there.",
    textTh:
      "จุดสังเกต: ถนนพัทยาเหนือ ใกล้โรงเรียน Vayupak Nara สะดวกสำหรับเด็กที่เรียนที่นั่นอยู่แล้ว",
    verifiedAt: SEEN_AT_DOOR,
  },
];

export async function upsertGoldenBrainNorthPattaya(
  prisma: PrismaClient,
  cityId: string,
): Promise<{ id: string; classes: number; tips: number }> {
  // идемпотентно: снести прежнюю запись со связями и создать заново
  const old = await prisma.placeProgram.findMany({
    where: { slug: GOLDEN_BRAIN_SLUG },
    select: { id: true },
  });
  const oldIds = old.map((p) => p.id);
  await prisma.placeClass.deleteMany({ where: { programId: { in: oldIds } } });
  await prisma.programTip.deleteMany({ where: { programId: { in: oldIds } } });
  await prisma.programActivityCategory.deleteMany({
    where: { programId: { in: oldIds } },
  });
  await prisma.placeProgram.deleteMany({ where: { slug: GOLDEN_BRAIN_SLUG } });

  const math = await prisma.activityCategory.findUnique({ where: { slug: "math" } });

  const program = await prisma.placeProgram.create({
    data: {
      slug: GOLDEN_BRAIN_SLUG,
      imageUrl: "/images/activities/golden-brain-north-pattaya.jpg",
      type: "COURSE",
      name: "Ментальная арифметика Golden Brain",
      nameEn: "Golden Brain Mental Arithmetic",
      nameTh: "จินตคณิต โกลเด้นเบรน สาขาพัทยาเหนือ",
      description: `Новый филиал тайской сети школ ментальной арифметики (จินตคณิต) на North Pattaya Road, рядом с Vayupak Nara School. Дети 4–9 лет сначала считают на счётах-абакусе, а потом учатся считать в уме, представляя счёты перед глазами. Занятия в маленьких группах по 5–8 детей, два раза в неделю по полтора часа; программа — шесть уровней, примерно на три года. Пробное занятие бесплатное. Группы и время — в таблице ниже. Цены по сайту сети: первый месяц 3${nb}300${nb}฿ вместе с учебниками и принадлежностями, дальше 2${nb}300${nb}฿ в месяц — в филиале уточняйте. Телефон филиала: 082 108 3528, сайт сети: goldenbrainschool.com.`,
      descriptionEn: `A new branch of a Thai chain of mental arithmetic schools (จินตคณิต) on North Pattaya Road, next to Vayupak Nara School. Children aged 4–9 first count on an abacus, then learn to calculate in their heads by picturing it. Small groups of 5–8 children, twice a week for an hour and a half; the program has six levels and takes about three years. The trial lesson is free. Groups and times are in the table below. Prices from the chain's website: 3,300${nb}฿ for the first month including books and materials, then 2,300${nb}฿ a month — please check with the branch. Branch phone: 082 108 3528, chain website: goldenbrainschool.com.`,
      descriptionTh: `โกลเด้นเบรน จินตคณิต สาขาใหม่บนถนนพัทยาเหนือ ใกล้โรงเรียน Vayupak Nara สำหรับเด็กอายุ 4–9 ปี เริ่มจากคิดเลขด้วยลูกคิด แล้วค่อย ๆ ฝึกคิดเลขในใจด้วยการนึกภาพลูกคิด เรียนเป็นกลุ่มเล็ก 5–8 คน สัปดาห์ละ 2 วัน วันละ 1 ชั่วโมงครึ่ง หลักสูตรมี 6 ระดับ ใช้เวลาประมาณ 3 ปี ทดลองเรียนฟรี รอบเรียนอยู่ในตารางด้านล่าง ค่าเรียนตามเว็บไซต์ของเครือ: เดือนแรก 3,300${nb}บาท รวมตำราและอุปกรณ์การเรียน เดือนถัดไป 2,300${nb}บาท — กรุณาสอบถามสาขาอีกครั้ง โทร 082 108 3528 เว็บไซต์ goldenbrainschool.com`,
      // обычная месячная цена сети; первый месяц дороже — в описании
      price: 2300,
      currency: "THB",
      priceUnit: "/ месяц",
      priceUnitEn: "/ month",
      priceUnitTh: "/ เดือน",
      minAgeMonths: AGE.minAgeMonths,
      maxAgeMonths: AGE.maxAgeMonths,
      venueName: "Golden Brain North Pattaya",
      venueNameEn: "Golden Brain North Pattaya",
      venueNameTh: "โกลเด้นเบรน จินตคณิต สาขาพัทยาเหนือ",
      venueAddress:
        "221/8-9 Moo 5, North Pattaya Road, Na Kluea, Bang Lamung District, Chon Buri 20150",
      // точка из ссылки Google Карт (!3d/!4d), Plus Code XV2V+5P
      venueLatitude: 12.9504181,
      venueLongitude: 100.894253,
      cityId,
      order: 5,
      classes: {
        create: GOLDEN_BRAIN_CLASSES.map((cls, index) => ({
          ...cls,
          ...AGE,
          scheduleEn: cls.schedule,
          scheduleTh: cls.schedule,
          // с родителем или без — на афише не сказано, плашку не показываем
          parentRequired: null,
          order: index + 1,
        })),
      },
      tips: {
        create: TIPS.map((tip, index) => ({ ...tip, order: index + 1 })),
      },
    },
  });

  if (math) {
    await prisma.programActivityCategory.create({
      data: { programId: program.id, categoryId: math.id },
    });
  }

  return { id: program.id, classes: GOLDEN_BRAIN_CLASSES.length, tips: TIPS.length };
}
