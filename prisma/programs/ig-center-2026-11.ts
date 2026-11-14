/**
 * Пять занятий IG Center Pattaya — внутри карточки места
 * (prisma/places/ig-center-2026-11.ts). Четыре уже есть черновиками из сбора
 * 10.10.2026 (overture-batch-1) — их наполняем и переносим в карточку центра;
 * робототехника — новый черновик (раньше была пометкой в названии G Bright Kids).
 *
 * Источники (13.11.2026): личные визиты 2025–2026 (плавание, рисование —
 * длительность, цена, правила; плакаты в центре 08.2026), официальные страницы
 * студий в Facebook и Instagram (посты 2025–2026), копия сайта центра 2024 г.
 * Цен на плавание, развивашки, роботов и музыку в открытых постах нет —
 * в описании честно «спросите при записи».
 *
 * Возраст на плакатах центра записан по-тайски: «1.6» — это 1 год 6 месяцев
 * (лестница уровней G Bright Kids 1.6 → 2.6 → 3.6 идёт ровно по году).
 */
import type { ProgramFill, ProgramFillClass } from "../../src/lib/import/program-fill";
import type { ProgramPlaceLink } from "../../src/lib/import/program-place-link";
import { IG_CENTER_PLACE, IG_CENTER_SLUG } from "../places/ig-center-2026-11";
import type { DraftProgram } from "./overture-batch-1.types";

const OWN = (visit: string): string => `Своё фото (визит ${visit})`;

const BY_BOOKING = { schedule: "по записи", scheduleEn: "by appointment" } as const;

function group(
  name: string,
  ageLabel: string,
  ageLabelEn: string,
  minAgeMonths: number,
  maxAgeMonths: number,
  parentRequired: boolean | null,
  schedule: { schedule: string; scheduleEn: string } = BY_BOOKING,
): ProgramFillClass {
  return {
    name,
    nameEn: name,
    ageLabel,
    ageLabelEn,
    minAgeMonths,
    maxAgeMonths,
    parentRequired,
    ...schedule,
  };
}

/** Названия инструментов G Clef по-английски (в таблице групп). */
const CLEF_EN: Readonly<Record<string, string>> = {
  Фортепиано: "Piano",
  "Бас-гитара": "Bass guitar",
  Танец: "Dance",
  Барабаны: "Drums",
  Укулеле: "Ukulele",
  Вокал: "Singing",
  Гитара: "Guitar",
};

export const IG_CENTER_ROBOTICS_SLUG = "g-robo-tech-lab-pattaya";

/** Робототехника — новый черновик; площадку сразу заменит привязка к центру. */
export const IG_CENTER_NEW_PROGRAMS: readonly DraftProgram[] = [
  {
    slug: IG_CENTER_ROBOTICS_SLUG,
    name: "G Robo-Tech Lab (Robot Station)",
    venueAddress: IG_CENTER_PLACE.address,
    venueLatitude: IG_CENTER_PLACE.latitude,
    venueLongitude: IG_CENTER_PLACE.longitude,
    googleMapsUrl: IG_CENTER_PLACE.googleMapsUrl,
    categorySlug: "robotics",
    website: null,
    facebookUrl: "https://www.facebook.com/profile.php?id=61567264988164",
    about: "Робототехника с LEGO при G Bright Kids в IG Center.",
  },
];

/** Все пять занятий — в карточку IG Center; имя меняем только у G Bright Kids. */
export const IG_CENTER_PROGRAM_LINKS: readonly ProgramPlaceLink[] = [
  { slug: "g-swim-academy-pattaya", placeSlug: IG_CENTER_SLUG },
  {
    slug: "g-bright-kids-pattaya",
    placeSlug: IG_CENTER_SLUG,
    rename: { from: "G Bright Kids (с программой Robot Station)", to: "G Bright Kids" },
  },
  { slug: IG_CENTER_ROBOTICS_SLUG, placeSlug: IG_CENTER_SLUG },
  { slug: "g-clef-music-studio-pattaya", placeSlug: IG_CENTER_SLUG },
  { slug: "perfect-art-pattaya", placeSlug: IG_CENTER_SLUG },
];

export const IG_CENTER_PROGRAM_FILLS: readonly ProgramFill[] = [
  {
    slug: "g-swim-academy-pattaya",
    nameEn: "G Swim Academy",
    description:
      "Школа плавания в IG Center: крытый бассейн с подогревом, вода солёная. Учат по методике Swim Australia; " +
      "детей от 4 месяцев до 12 лет делят на группы по возрасту и умениям. Малыши до трёх лет занимаются вместе " +
      "с папой или мамой, с трёх лет дети плавают с тренерами, без родителей. Занятие в группе с трёх лет длится 30 минут. " +
      "Первое занятие — бесплатное пробное, 30 минут: тренер смотрит, что ребёнок уже умеет, и предлагает подходящую группу, " +
      "дальше покупают абонемент. Ведут на английском, с тайскими детьми — по-тайски. До марта 2026 года бассейн работал " +
      "под названием Manta Kids; телефон остался прежним. Цену абонемента в открытых постах не публикуют — спросите при записи. " +
      "Телефон и LINE: 063 985 5567, Facebook: facebook.com/profile.php?id=61583556017254, Instagram: @gswimacademy.",
    descriptionEn:
      "The swimming school at IG Center: an indoor, heated saltwater pool. Teaching follows the Swim Australia method; " +
      "children from 4 months to 12 years are grouped by age and ability. Babies and toddlers under three take part together " +
      "with a parent; from three, children swim with the coaches and without parents. A lesson in the groups from " +
      "age three lasts 30 minutes. The first lesson is a free 30-minute trial: the coach sees what your child can already do " +
      "and suggests a group, after which you buy a package of lessons. Lessons are in English, and in Thai with Thai children. " +
      "Until March 2026 the pool ran as Manta Kids; the phone number is the same. Package prices are not published — " +
      "please ask when you book. Phone and LINE: 063 985 5567, Facebook: facebook.com/profile.php?id=61583556017254, Instagram: @gswimacademy.",
    tips: [
      {
        text: "Детям до 3,5 лет в бассейн — только в акваподгузниках.",
        textEn: "Children under 3½ must wear swim nappies in the pool.",
      },
      {
        text:
          "Если что-то забыли — при бассейне есть магазинчик: купальники и плавки, очки, шапочки, " +
          "полотенца, акваподгузники.",
        textEn:
          "Forgot something? There is a small shop at the pool with swimsuits, goggles, caps, towels and swim nappies.",
      },
      {
        text: "Пока ребёнок плавает, можно сидеть в кафе за стеклянной стеной — бассейн оттуда видно.",
        textEn:
          "While your child swims, you can sit in the café behind the glass wall and watch the pool.",
      },
      {
        text:
          "Школа учится четвертями: на каникулах — неделя в конце июня, неделя на стыке сентября и октября " +
          "и на Сонгкран — бассейн закрыт. Даты публикуют в Facebook.",
        textEn:
          "The school runs in terms: during the breaks — a week at the end of June, a week around the turn of " +
          "September and October, and Songkran — the pool is closed. Dates are posted on Facebook.",
      },
    ],
    minAgeMonths: 4,
    maxAgeMonths: 144,
    classes: [
      group("Baby Warmth", "4–7 мес.", "4–7 months", 4, 7, true),
      group("Aqua Babies", "7 мес. – 1,5 года", "7 months – 1½ years", 7, 18, true),
      group(
        "Aqua Explorers",
        "1,5 – 3 года 3 мес.",
        "1½ – 3 years 3 months",
        18,
        39,
        true,
      ),
      group(
        "G Swim Starter",
        "3 года 3 мес. – 4 года 5 мес.",
        "3y 3m – 4y 5m",
        39,
        53,
        false,
        {
          schedule: "30 мин, по записи",
          scheduleEn: "30 min, by appointment",
        },
      ),
      group(
        "G Swim Master",
        "4 года 5 мес. – 12 лет",
        "4y 5m – 12 years",
        53,
        144,
        false,
      ),
    ],
    categorySlugs: ["swimming"],
    cover: "/images/activities/g-swim-academy-pattaya.jpg",
    photos: [
      {
        url: "/images/activities/g-swim-academy-pattaya-lesson.jpg",
        caption: "Занятие с тренером, за стеклом — кафе",
      },
    ],
    photoRightsNote: OWN("2026-10"),
    photoSource: "OWN",
  },
  {
    slug: "g-bright-kids-pattaya",
    nameEn: "G Bright Kids",
    description:
      "Развивающий центр в IG Center для детей от полутора лет (работает с 2019 года): занятия через игру на мышление, " +
      "логику, моторику, общение и английский. Уровни по возрасту (плакат в центре, 2026): Starters — 1,5–3 года, " +
      "Toddlers — 3–4 года, Intelligent — Junior — 5–12 лет; отдельно English & Math для 4–12 лет — английский " +
      "по фонике и математика в поддержку школы. Занятия идут часовыми слотами со вторника по воскресенье, на конкретное " +
      "время по записи. Ведут на английском, с тайскими детьми — по-тайски. Робототехника с LEGO — отдельная программа " +
      "G Robo-Tech Lab в том же центре. Есть бесплатное пробное занятие. Цены в открытых постах не публикуют — " +
      "спросите при записи. Телефон: 062 480 2121, LINE: gbrightkidspty, Facebook: facebook.com/gbrightkidspty, " +
      "Instagram: @gbrightkidspattaya.",
    descriptionEn:
      "An early-learning centre at IG Center for children from 18 months (running since 2019): play-based classes for " +
      "thinking, logic, motor skills, social skills and English. Levels by age (poster at the centre, 2026): Starters " +
      "1½–3 years, Toddlers 3–4, Intelligent — Junior 5–12; plus English & Math for ages 4–12 — phonics-based English " +
      "and maths to support school. Classes run in one-hour slots from Tuesday to Sunday, booked for a set time. " +
      "Lessons are in English, and in Thai with Thai children. LEGO robotics is a separate programme, G Robo-Tech Lab, " +
      "in the same centre. There is a free trial class. Prices are not published — please ask when you book. " +
      "Phone: 062 480 2121, LINE: gbrightkidspty, Facebook: facebook.com/gbrightkidspty, Instagram: @gbrightkidspattaya.",
    tips: [
      {
        text:
          "Записываться нужно минимум за 24 часа, отменять — не позже чем за 12 часов, " +
          "иначе занятие могут засчитать (правило на расписании в центре).",
        textEn:
          "Book at least 24 hours ahead and cancel no later than 12 hours before, " +
          "otherwise the class may be charged (rule on the timetable at the centre).",
      },
      {
        text:
          "При покупке пакета занятий берут регистрационный взнос; за пробное или разовое занятие его " +
          "не засчитывают и не возвращают. Уточните условия до оплаты.",
        textEn:
          "A registration fee is charged when you buy a package of classes; it is not credited against a trial " +
          "or single class and is not refunded. Check the terms before paying.",
      },
      {
        text:
          "Много занятий для малышей — днём. Если ребёнок ещё спит днём, сверьте расписание со сном " +
          "до покупки пакета.",
        textEn:
          "Many toddler classes are in the middle of the day. If your child still naps, check the timetable " +
          "against nap time before buying a package.",
      },
      {
        text: "Границы возраста на плакатах и в постах немного расходятся — уровень подберут на пробном занятии.",
        textEn:
          "Age ranges differ slightly between posters and posts — the level is chosen at the trial class.",
      },
    ],
    minAgeMonths: 18,
    maxAgeMonths: 144,
    classes: [
      group("Starters", "1,5–3 года", "1½–3 years", 18, 36, null, {
        schedule: "1 час, по записи",
        scheduleEn: "1 hour, by appointment",
      }),
      group("Toddlers", "3–4 года", "3–4 years", 36, 48, null, {
        schedule: "1 час, по записи",
        scheduleEn: "1 hour, by appointment",
      }),
      group("Intelligent — Junior", "5–12 лет", "5–12 years", 60, 144, null, {
        schedule: "1 час, по записи",
        scheduleEn: "1 hour, by appointment",
      }),
      group("English & Math", "4–12 лет", "4–12 years", 48, 144, null, {
        schedule: "1 час, по записи",
        scheduleEn: "1 hour, by appointment",
      }),
    ],
    categorySlugs: ["early-development"],
    cover: "/images/activities/g-bright-kids-pattaya.jpg",
    photoRightsNote: OWN("2026-08"),
    photoSource: "OWN",
  },
  {
    slug: IG_CENTER_ROBOTICS_SLUG,
    nameEn: "G Robo-Tech Lab (Robot Station)",
    description:
      "Робототехника с LEGO при G Bright Kids в IG Center; эту же программу называют Robot Station Pattaya. " +
      "Дети собирают модели из конструктора и программируют их, чтобы те двигались: у малышей — истории и первые " +
      "сборки, у старших — программирование и соревновательные проекты. Уровни (плакат, январь 2026): Teller (Duplo) — " +
      "3–5 лет, Botzees — 6–8 лет, WeDo 2.0 — 8–9 лет, LEGO Boost — 9–12 лет, FLL — от 10 лет. Пробное занятие " +
      "для детей 3–12 лет бесплатное. Материалы и объявления — на английском. Цены в открытых постах не публикуют — " +
      "спросите при записи. Телефон: 062 480 2121, LINE: gbrightkidspty, Facebook: facebook.com/gbrightkidspty.",
    descriptionEn:
      "LEGO robotics run by G Bright Kids at IG Center; the same programme is also called Robot Station Pattaya. " +
      "Children build models and program them to move: stories and first builds for the youngest, coding and " +
      "competition projects for older children. Levels (poster, January 2026): Teller (Duplo) 3–5 years, " +
      "Botzees 6–8, WeDo 2.0 8–9, LEGO Boost 9–12, FLL 10+. The trial class for ages 3–12 is free. " +
      "Materials and announcements are in English. Prices are not published — please ask when you book. " +
      "Phone: 062 480 2121, LINE: gbrightkidspty, Facebook: facebook.com/gbrightkidspty.",
    tips: [
      {
        text: "Пробное бесплатное: удобно понять, какой уровень подходит, прежде чем брать курс.",
        textEn:
          "The trial is free — a good way to find the right level before signing up for a course.",
      },
    ],
    minAgeMonths: 36,
    maxAgeMonths: 168,
    classes: [
      group("Teller (Duplo)", "3–5 лет", "3–5 years", 36, 60, null),
      group("Botzees", "6–8 лет", "6–8 years", 72, 96, null),
      group("WeDo 2.0", "8–9 лет", "8–9 years", 96, 108, null),
      group("LEGO Boost", "9–12 лет", "9–12 years", 108, 144, null),
      group("FLL", "от 10 лет", "10+ years", 120, 168, null),
    ],
    categorySlugs: ["robotics"],
    cover: "/images/activities/g-robo-tech-lab-pattaya.jpg",
    photoRightsNote: OWN("2026-08"),
    photoSource: "OWN",
  },
  {
    slug: "g-clef-music-studio-pattaya",
    nameEn: "G Clef Music Studio Pattaya",
    description:
      "Музыкальная студия в IG Center для детей с 3 лет и взрослых: фортепиано, вокал, гитара, укулеле, бас-гитара, " +
      "барабаны, танец и музыкальная теория. Уроки в основном индивидуальные. Ученики сдают международные экзамены " +
      "Trinity College London и ABRSM; в 2026 году преподаватель студии получил награду Trinity за преподавание. " +
      "Раз в год в концертном зале центра проходит отчётный концерт учеников, вход свободный. Пробное занятие " +
      "бесплатное, полный курс — 12 занятий. У студии свои часы: вт–пт 10:30–19:30, сб–вс 9:00–18:00, " +
      "в понедельник выходной. Цены в открытых постах не публикуют — спросите при записи. " +
      "Телефон: 062 479 7667, LINE: gclefpattaya, Facebook: facebook.com/gclefmusicstudiopattaya.",
    descriptionEn:
      "A music studio at IG Center for children from 3 and adults: piano, singing, guitar, ukulele, bass, drums, " +
      "dance and music theory. Lessons are mostly one-to-one. Students take the international Trinity College London " +
      "and ABRSM exams; in 2026 one of the studio's teachers received a Trinity teaching award. Once a year there is " +
      "a student concert in the centre's recital hall, free to attend. The trial lesson is free; a full course is " +
      "12 lessons. The studio keeps its own hours: Tue–Fri 10:30–19:30, Sat–Sun 9:00–18:00, closed on Mondays. " +
      "Prices are not published — please ask when you book. Phone: 062 479 7667, LINE: gclefpattaya, " +
      "Facebook: facebook.com/gclefmusicstudiopattaya.",
    tips: [
      {
        text: "Бесплатное пробное помогает выбрать инструмент — можно попробовать несколько.",
        textEn:
          "The free trial helps you choose an instrument — you can try more than one.",
      },
      {
        text:
          "Отчётный концерт учеников — раз в год (в 2026-м прошёл в сентябре). Вход бесплатный, но места " +
          "раздают заранее — следите за анонсами в Facebook студии.",
        textEn:
          "The student concert is held once a year (in September in 2026). Entry is free, but seats are handed out " +
          "in advance — watch the studio's Facebook page for announcements.",
      },
    ],
    minAgeMonths: 36,
    maxAgeMonths: 216,
    classes: [
      group("Фортепиано", "с 4 лет", "4+ years", 48, 216, null),
      group("Бас-гитара", "с 5 лет", "5+ years", 60, 216, null),
      group("Танец", "с 5 лет", "5+ years", 60, 216, null),
      group("Барабаны", "с 6 лет", "6+ years", 72, 216, null),
      group("Укулеле", "с 6 лет", "6+ years", 72, 216, null),
      group("Вокал", "с 6 лет", "6+ years", 72, 216, null),
      group("Гитара", "с 8 лет", "8+ years", 96, 216, null),
    ].map((cls) => ({ ...cls, nameEn: CLEF_EN[cls.name] ?? cls.name })),
    categorySlugs: ["music"],
  },
  {
    slug: "perfect-art-pattaya",
    nameEn: "Perfect Art Pattaya",
    description:
      "Художественная студия в IG Center (на вывеске — «с 2007 года»). Курсы по возрасту: Fun Art для 3–5 лет, " +
      "Fine Art для 6–12 лет — рисунок, акварель, живопись на холсте — и лепка из полимерной глины для 5–12 лет. " +
      "Малыши в основном рисуют красками и лепят из пластилина; в конце занятия работы сушат и отдают с собой. " +
      "Занятие длится час и стоит 350 ฿, платите за каждое отдельно. Ребёнка оставляют с педагогом: детей с 3,5 лет " +
      "точно берут без родителей, места для взрослых внутри студии нет — можно подождать в кафе или во дворе. " +
      "Ведут на английском, с тайскими детьми — по-тайски. Студия работает со вторника по субботу, 10:00–17:00. " +
      "Записываться лучше заранее, через LINE: Savita_Siri; телефон 086 609 3019, Facebook: facebook.com/perfectartpattaya.",
    descriptionEn:
      "An art studio at IG Center (the sign says “since 2007”). Courses by age: Fun Art for ages 3–5, Fine Art for " +
      "ages 6–12 — drawing, watercolour, painting on canvas — and polymer clay for ages 5–12. Younger children mostly " +
      "paint and model with plasticine; at the end of the class the work is dried and sent home with them. A class lasts " +
      "an hour and costs 350 ฿, paid each time. Children stay with the teacher: from 3½ they are definitely taken " +
      "without parents, and there is no room for adults inside the studio — you can wait in the café or the garden. " +
      "Lessons are in English, and in Thai with Thai children. The studio is open Tuesday to Saturday, 10:00–17:00. " +
      "Book ahead via LINE: Savita_Siri; phone 086 609 3019, Facebook: facebook.com/perfectartpattaya.",
    tips: [
      {
        text: "Записывайтесь заранее через LINE — так за ребёнком точно оставят место.",
        textEn: "Book ahead via LINE so a place is kept for your child.",
      },
      {
        text: "Работают красками — лучше одежда, которую не жалко испачкать.",
        textEn: "They work with paint — dress your child in clothes that can get messy.",
      },
    ],
    minAgeMonths: 36,
    maxAgeMonths: 144,
    price: 350,
    priceUnit: "/ занятие (1 час)",
    priceUnitEn: "/ class (1 hour)",
    classes: [
      group("Fun Art", "3–5 лет", "3–5 years", 36, 60, null, {
        schedule: "вт–сб, по записи",
        scheduleEn: "Tue–Sat, by appointment",
      }),
      group("Fine Art", "6–12 лет", "6–12 years", 72, 144, false, {
        schedule: "вт–сб, по записи",
        scheduleEn: "Tue–Sat, by appointment",
      }),
      group("Polymer Clay", "5–12 лет", "5–12 years", 60, 144, false, {
        schedule: "вт–сб, по записи",
        scheduleEn: "Tue–Sat, by appointment",
      }),
    ],
    categorySlugs: ["art"],
    cover: "/images/activities/perfect-art-pattaya.jpg",
    photos: [
      {
        url: "/images/activities/perfect-art-pattaya-studio.jpg",
        caption: "Вход в студию: курсы и возраст на витрине",
      },
    ],
    photoRightsNote: OWN("2026-08"),
    photoSource: "OWN",
  },
];
