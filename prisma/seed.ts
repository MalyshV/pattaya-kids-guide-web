import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Start seeding...");

  // =========================
  // 0. GEO: COUNTRY / CITY
  // =========================
  const thailand = await prisma.country.upsert({
    where: { iso2: "TH" },
    update: { name: "Таиланд", currency: "THB" },
    create: { iso2: "TH", name: "Таиланд", currency: "THB" },
  });

  const pattaya = await prisma.city.upsert({
    where: { countryId_slug: { countryId: thailand.id, slug: "pattaya" } },
    update: {
      name: "Паттайя",
      seoDescription:
        "Спокойный гид по детским местам и событиям Паттайи: куда пойти с ребёнком утром, после сада и на выходных — с ценами, Thai-price и днями рождения.",
      timezone: "Asia/Bangkok",
      latitude: 12.9236,
      longitude: 100.8825,
    },
    create: {
      countryId: thailand.id,
      slug: "pattaya",
      name: "Паттайя",
      seoDescription:
        "Спокойный гид по детским местам и событиям Паттайи: куда пойти с ребёнком утром, после сада и на выходных — с ценами, Thai-price и днями рождения.",
      timezone: "Asia/Bangkok",
      latitude: 12.9236,
      longitude: 100.8825,
      isPublished: false,
    },
  });

  // =========================
  // 1. EVENT CATEGORIES
  // =========================
  const eventCategoriesData = [
    { slug: "workshop", name: "Мастер-класс" },
    { slug: "festival", name: "Фестиваль" },
    { slug: "kids-activity", name: "Детская активность" },
  ];
  for (const category of eventCategoriesData) {
    await prisma.eventCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  const workshopCategory = await prisma.eventCategory.findUnique({
    where: { slug: "workshop" },
  });

  const festivalCategory = await prisma.eventCategory.findUnique({
    where: { slug: "festival" },
  });

  const kidsActivityCategory = await prisma.eventCategory.findUnique({
    where: { slug: "kids-activity" },
  });

  if (!workshopCategory || !festivalCategory || !kidsActivityCategory) {
    throw new Error("Event categories not found");
  }

  // =========================
  // 2. PLACE CATEGORIES (русские названия; slug — англ. идентификатор)
  // =========================
  const placeCategoriesData = [
    { slug: "indoor-playground", name: "Крытая игровая", order: 1 },
    { slug: "cafe", name: "Кафе", order: 2 },
    { slug: "playground", name: "Игровая площадка", order: 3 },
  ];
  for (const category of placeCategoriesData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, order: category.order },
      create: category,
    });
  }

  // =========================
  // 3. AMENITY GROUPS (русское название)
  // =========================
  await prisma.amenityGroup.upsert({
    where: { slug: "food-comfort" },
    update: { name: "Удобства" },
    create: { name: "Удобства", slug: "food-comfort" },
  });

  // =========================
  // 4. AGE GROUPS (русские названия; диапазон уникален — idempotent через upsert)
  // =========================
  const ageGroup3to6 = await prisma.ageGroup.upsert({
    where: { minAge_maxAge: { minAge: 3, maxAge: 6 } },
    update: { name: "3–6 лет" },
    create: { name: "3–6 лет", minAge: 3, maxAge: 6 },
  });
  const ageGroupUnder2 = await prisma.ageGroup.upsert({
    where: { minAge_maxAge: { minAge: 0, maxAge: 2 } },
    update: { name: "0–2 года" },
    create: { name: "0–2 года", minAge: 0, maxAge: 2 },
  });

  const indoorPlaygroundCategory = await prisma.category.findUnique({
    where: { slug: "indoor-playground" },
  });

  const foodComfortGroup = await prisma.amenityGroup.findUnique({
    where: { slug: "food-comfort" },
  });

  if (!indoorPlaygroundCategory) {
    throw new Error("Category 'indoor-playground' was not created");
  }

  if (!foodComfortGroup) {
    throw new Error("Amenity group 'food-comfort' was not created");
  }

  // =========================
  // 5. AMENITIES (русские названия)
  // =========================
  // Парковка НЕ в этом списке: поднята до колонки Place.hasParking (см. очистку ниже)
  const amenitiesData = [
    { slug: "cafe-on-site", name: "Кафе" },
    { slug: "wifi", name: "Wi-Fi" },
  ];
  for (const amenity of amenitiesData) {
    await prisma.amenity.upsert({
      where: { slug: amenity.slug },
      update: { name: amenity.name, groupId: foodComfortGroup.id },
      create: { name: amenity.name, slug: amenity.slug, groupId: foodComfortGroup.id },
    });
  }

  // Парковка теперь колонка Place.hasParking: снимаем старую amenity-привязку и сам справочник
  const legacyParkingAmenity = await prisma.amenity.findUnique({
    where: { slug: "parking" },
  });
  if (legacyParkingAmenity) {
    await prisma.placeAmenity.deleteMany({
      where: { amenityId: legacyParkingAmenity.id },
    });
    await prisma.amenity.delete({ where: { id: legacyParkingAmenity.id } });
  }

  const cafeAmenity = await prisma.amenity.findUnique({
    where: { slug: "cafe-on-site" },
    include: { group: true },
  });

  if (!cafeAmenity) {
    throw new Error("Amenity 'cafe-on-site' was not created");
  }

  const now = new Date();

  // =========================
  // 6. [DEMO] PLACE
  // =========================
  const demoPlace = await prisma.place.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "demo-harbor-kids-club" } },
    update: {
      name: "[Демо] Детский клуб «Гавань»",
      description:
        "Демонстрационное место для разработки: данные не настоящие. Показывает, как выглядит карточка в каталоге.",
      address: "Демо-адрес, Паттайя",
      latitude: 12.934,
      longitude: 100.889,
      indoor: true,
      hasFood: true,
      hasWifi: true,
      canLeaveChild: false,
      animalContact: false,
      status: "APPROVED",
      cityId: pattaya.id,
    },
    create: {
      name: "[Демо] Детский клуб «Гавань»",
      slug: "demo-harbor-kids-club",
      description:
        "Демонстрационное место для разработки: данные не настоящие. Показывает, как выглядит карточка в каталоге.",
      address: "Демо-адрес, Паттайя",
      latitude: 12.934,
      longitude: 100.889,
      indoor: true,
      hasFood: true,
      hasWifi: true,
      canLeaveChild: false,
      animalContact: false,
      status: "APPROVED",
      cityId: pattaya.id,
    },
  });

  // =========================
  // 7. PLACE LINKS
  // =========================
  await prisma.placeCategory.upsert({
    where: {
      placeId_categoryId: {
        placeId: demoPlace.id,
        categoryId: indoorPlaygroundCategory.id,
      },
    },
    update: {},
    create: {
      placeId: demoPlace.id,
      categoryId: indoorPlaygroundCategory.id,
    },
  });

  await prisma.placeAmenity.upsert({
    where: {
      placeId_amenityId: {
        placeId: demoPlace.id,
        amenityId: cafeAmenity.id,
      },
    },
    update: {},
    create: {
      placeId: demoPlace.id,
      amenityId: cafeAmenity.id,
    },
  });

  await prisma.placeAgeGroup.upsert({
    where: {
      placeId_ageGroupId: {
        placeId: demoPlace.id,
        ageGroupId: ageGroup3to6.id,
      },
    },
    update: {},
    create: {
      placeId: demoPlace.id,
      ageGroupId: ageGroup3to6.id,
    },
  });

  // =========================
  // 8. PLACE BIRTHDAY INFO
  // =========================
  await prisma.placeBirthdayInfo.upsert({
    where: { placeId: demoPlace.id },
    update: {
      hasPackages: true,
      minGuests: 5,
      maxGuests: 15,
      depositRequired: true,
      preBookingDays: 7,
      notes: "Демо-пакет дня рождения (тестовые данные для разработки).",
    },
    create: {
      placeId: demoPlace.id,
      hasPackages: true,
      minGuests: 5,
      maxGuests: 15,
      depositRequired: true,
      preBookingDays: 7,
      notes: "Демо-пакет дня рождения (тестовые данные для разработки).",
    },
  });

  // =========================
  // THE PLAY BARN — первое реальное место
  // =========================
  const playBarnData = {
    name: "The Play Barn",
    description:
      "Семейная игровая в Паттайе: крытая зона с кондиционером (сухой бассейн, мягкие горки, двухуровневый игровой лабиринт, комната для малышей до 2 лет) и уличная площадка с качелями. Спокойное кафе для родителей, Wi-Fi и парковка. Можно оставить ребёнка под присмотром аниматора. Персонал и в кафе, и на присмотре понимает тайский и английский. Иногда проходят творческие мастер-классы и мини-праздники.",
    address: "5 Soi Siam Country Club Road, Pong, Bang Lamung, Chonburi 20150",
    latitude: 12.9180161,
    longitude: 100.9727834,
    // Проверенная Вероникой карточка места в Google Maps (2026-07-06)
    googleMapsUrl:
      "https://www.google.com/maps/place/Play+Barn+%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%B0+%E0%B9%80%E0%B8%9E%E0%B8%A5%E0%B8%A2%E0%B9%8C%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%99+playground/@12.9180213,100.9702085,1057m/data=!3m2!1e3!4b1!4m6!3m5!1s0x310295808927f515:0x86dc0f9572804c2!8m2!3d12.9180161!4d100.9727834!16s%2Fg%2F11y_xtnq_r",
    indoor: true,
    outdoor: true,
    hasFood: true,
    hasWifi: true,
    canLeaveChild: true,
    animalContact: false,
    // Умные фильтры (Эпик 4)
    hasAirCon: true,
    hasParking: true,
    hasCafeSeating: true,
    hasPowerOutlets: false,
    status: "APPROVED" as const,
    cityId: pattaya.id,
  };
  const playBarn = await prisma.place.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "the-play-barn" } },
    update: playBarnData,
    create: { ...playBarnData, slug: "the-play-barn" },
  });

  // Категории The Play Barn
  for (const slug of ["indoor-playground", "cafe", "playground"]) {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (category) {
      await prisma.placeCategory.upsert({
        where: { placeId_categoryId: { placeId: playBarn.id, categoryId: category.id } },
        update: {},
        create: { placeId: playBarn.id, categoryId: category.id },
      });
    }
  }

  // Удобства The Play Barn (парковка — колонка hasParking, не amenity)
  for (const slug of ["cafe-on-site", "wifi"]) {
    const amenity = await prisma.amenity.findUnique({ where: { slug } });
    if (amenity) {
      await prisma.placeAmenity.upsert({
        where: { placeId_amenityId: { placeId: playBarn.id, amenityId: amenity.id } },
        update: {},
        create: { placeId: playBarn.id, amenityId: amenity.id },
      });
    }
  }

  // Языки персонала (справочник) + привязка к The Play Barn (тайский и английский)
  const languagesData = [
    { code: "th", name: "Тайский" },
    { code: "en", name: "Английский" },
  ];
  for (const language of languagesData) {
    const record = await prisma.language.upsert({
      where: { code: language.code },
      update: { name: language.name },
      create: language,
    });
    await prisma.placeStaffLanguage.upsert({
      where: {
        placeId_languageId: { placeId: playBarn.id, languageId: record.id },
      },
      update: {},
      create: { placeId: playBarn.id, languageId: record.id },
    });
  }

  // Возрастные группы The Play Barn (0–2 и 3–6)
  for (const groupId of [ageGroupUnder2.id, ageGroup3to6.id]) {
    await prisma.placeAgeGroup.upsert({
      where: { placeId_ageGroupId: { placeId: playBarn.id, ageGroupId: groupId } },
      update: {},
      create: { placeId: playBarn.id, ageGroupId: groupId },
    });
  }

  // Расписание The Play Barn (Вт–Вс 8:30–18:00, ПН — выходной)
  await prisma.placeSchedule.deleteMany({ where: { placeId: playBarn.id } });
  await prisma.placeSchedule.createMany({
    data: [
      { placeId: playBarn.id, day: "MON", openTime: "", closeTime: "", isClosed: true },
      {
        placeId: playBarn.id,
        day: "TUE",
        openTime: "08:30",
        closeTime: "18:00",
        isClosed: false,
      },
      {
        placeId: playBarn.id,
        day: "WED",
        openTime: "08:30",
        closeTime: "18:00",
        isClosed: false,
      },
      {
        placeId: playBarn.id,
        day: "THU",
        openTime: "08:30",
        closeTime: "18:00",
        isClosed: false,
      },
      {
        placeId: playBarn.id,
        day: "FRI",
        openTime: "08:30",
        closeTime: "18:00",
        isClosed: false,
      },
      {
        placeId: playBarn.id,
        day: "SAT",
        openTime: "08:30",
        closeTime: "18:00",
        isClosed: false,
      },
      {
        placeId: playBarn.id,
        day: "SUN",
        openTime: "08:30",
        closeTime: "18:00",
        isClosed: false,
      },
    ],
  });

  // Цены The Play Barn (вход; единая цена — Thai-price не выявлена)
  await prisma.placePricing.deleteMany({ where: { placeId: playBarn.id } });
  await prisma.placePricing.create({
    data: {
      placeId: playBarn.id,
      priceType: "PAID",
      audience: "GENERAL",
      minPrice: 100,
      maxPrice: 250,
      currency: "THB",
    },
  });

  // День рождения The Play Barn (условия пока тестовые — уточнить)
  await prisma.placeBirthdayInfo.upsert({
    where: { placeId: playBarn.id },
    update: {
      hasPackages: true,
      minGuests: 8,
      maxGuests: 15,
      depositRequired: true,
      preBookingDays: 5,
      notes:
        "Проводят детские дни рождения. Точные пакеты и условия уточняются (пока тестовые данные).",
    },
    create: {
      placeId: playBarn.id,
      hasPackages: true,
      minGuests: 8,
      maxGuests: 15,
      depositRequired: true,
      preBookingDays: 5,
      notes:
        "Проводят детские дни рождения. Точные пакеты и условия уточняются (пока тестовые данные).",
    },
  });

  // =========================
  // LARIDEA KIDS' CAFÉ — второе реальное место
  // Источники (2026-07-06): Instagram @laridea_kids_cafe (скриншоты Вероники),
  // карточка Google Maps (ссылка от Вероники), факты Вероники как инсайдера.
  // Уточнить позже: розетки, цена разового входа (+Thai-price?) — в Instagram
  // не опубликована, есть только абонементы (Rainbow Polly 3850฿/30дн безлимит,
  // Astro Polly 4839฿/16 входов по 3ч, 6 мес 15400฿; няня 3790฿/ч) → модель
  // «программ места» в backlog.
  // =========================
  const lariDeaData = {
    name: "LariDea Kids' Café",
    description:
      "Детское кафе с крытой игровой в северной Паттайе (Again, рядом с Terminal 21). Игровая зона с кондиционером для детей 1–7 лет, спешелти-кофе, Wi-Fi и кафе со столиками, где родителю удобно посидеть за ноутбуком. Можно оставить ребёнка под присмотром. Персонал говорит по-тайски и по-английски. По выходным — мастер-классы для детей (кулинария, научные опыты), проводят дни рождения, летом работает детский лагерь. Для постоянных гостей — абонементы и клубные скидки.",
    address: "179, 40, Muang Pattaya, Bang Lamung District, Chon Buri 20150",
    latitude: 12.9517251,
    longitude: 100.8891907,
    // Проверенная Вероникой карточка места в Google Maps (2026-07-06)
    googleMapsUrl:
      "https://www.google.com/maps/place/LariDea+-+Kids'+Caf%C3%A9:+Playground+%26+Coffee+Shop/@12.9517303,100.8866158,1057m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3102bd7f74f65737:0x5e0c006bad09a266!8m2!3d12.9517251!4d100.8891907!16s%2Fg%2F11x8g8hw5y",
    indoor: true,
    outdoor: false,
    hasFood: true,
    hasWifi: true, // подтверждено Вероникой 2026-07-06
    canLeaveChild: true, // «nanny services» в профиле + подтверждено Вероникой
    animalContact: false,
    hasAirCon: true,
    hasParking: true,
    hasCafeSeating: true,
    hasPowerOutlets: false, // Вероника пока не знает — проверить на месте
    status: "APPROVED" as const,
    cityId: pattaya.id,
  };
  const lariDea = await prisma.place.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "laridea" } },
    update: lariDeaData,
    create: { ...lariDeaData, slug: "laridea" },
  });

  // Категории LariDea
  for (const slug of ["indoor-playground", "cafe"]) {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (category) {
      await prisma.placeCategory.upsert({
        where: { placeId_categoryId: { placeId: lariDea.id, categoryId: category.id } },
        update: {},
        create: { placeId: lariDea.id, categoryId: category.id },
      });
    }
  }

  // Удобства LariDea (кафе + Wi-Fi)
  for (const slug of ["cafe-on-site", "wifi"]) {
    const amenity = await prisma.amenity.findUnique({ where: { slug } });
    if (amenity) {
      await prisma.placeAmenity.upsert({
        where: { placeId_amenityId: { placeId: lariDea.id, amenityId: amenity.id } },
        update: {},
        create: { placeId: lariDea.id, amenityId: amenity.id },
      });
    }
  }

  // Возраст LariDea: 1–7 лет (официальный диапазон игровой из их профиля)
  const ageGroup1to7 = await prisma.ageGroup.upsert({
    where: { minAge_maxAge: { minAge: 1, maxAge: 7 } },
    update: { name: "1–7 лет" },
    create: { name: "1–7 лет", minAge: 1, maxAge: 7 },
  });
  await prisma.placeAgeGroup.upsert({
    where: {
      placeId_ageGroupId: { placeId: lariDea.id, ageGroupId: ageGroup1to7.id },
    },
    update: {},
    create: { placeId: lariDea.id, ageGroupId: ageGroup1to7.id },
  });

  // Языки персонала LariDea (тайский и английский — подтверждено Вероникой)
  for (const code of ["th", "en"]) {
    const language = await prisma.language.findUnique({ where: { code } });
    if (language) {
      await prisma.placeStaffLanguage.upsert({
        where: {
          placeId_languageId: { placeId: lariDea.id, languageId: language.id },
        },
        update: {},
        create: { placeId: lariDea.id, languageId: language.id },
      });
    }
  }

  // День рождения LariDea (официальные пакеты из Instagram, март 2026)
  const lariDeaBirthdayNotes =
    "Три пакета: «Little Joy» — от 946 ฿ за ребёнка (от 5 детей, 2 часа), «Happy Moments» — 1 166 ฿ (от 10 детей), «Magic Day» — 1 496 ฿ (от 10 детей, 4 часа, приватная игровая). Депозит 50%, цены включают VAT. Допы: декор, фотограф, шоу.";
  await prisma.placeBirthdayInfo.upsert({
    where: { placeId: lariDea.id },
    update: {
      hasPackages: true,
      minGuests: 5,
      maxGuests: null,
      depositRequired: true,
      preBookingDays: null,
      notes: lariDeaBirthdayNotes,
    },
    create: {
      placeId: lariDea.id,
      hasPackages: true,
      minGuests: 5,
      maxGuests: null,
      depositRequired: true,
      preBookingDays: null,
      notes: lariDeaBirthdayNotes,
    },
  });

  // Расписание LariDea (карточка Google Maps, 2026-07-06): ежедневно 11:00–20:00
  await prisma.placeSchedule.deleteMany({ where: { placeId: lariDea.id } });
  await prisma.placeSchedule.createMany({
    data: (["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const).map((day) => ({
      placeId: lariDea.id,
      day,
      openTime: "11:00",
      closeTime: "20:00",
      isClosed: false,
    })),
  });

  // Цены входа LariDea НЕ заносим, пока нет данных (честность: страница
  // просто не покажет секцию). Контакты (некуда класть, ждут модель):
  // тел. 081 110 1713, сайт laridea.co.th, IG @laridea_kids_cafe.

  // «Полезно знать» LariDea (только подтверждённое из их постеров)
  await prisma.placeTip.deleteMany({ where: { placeId: lariDea.id } });
  await prisma.placeTip.createMany({
    data: [
      {
        placeId: lariDea.id,
        topic: "socks",
        order: 1,
        text: "Для игровой нужны носки. По абонементу первая пара для ребёнка и взрослого — бесплатно, а в пакеты дня рождения детские носки уже включены (взрослым — нет).",
      },
      {
        placeId: lariDea.id,
        topic: "prices",
        order: 2,
        text: "Цены включают VAT 7%, но к услугам может добавляться сервисный сбор 10%.",
      },
    ],
  });

  // ЛЕТНИЙ ЛАГЕРЬ LARIDEA — первое реальное событие (даты с официального постера).
  // Полноценная модель «программ места» — в backlog; пока событие с датами.
  const lariDeaCampData = {
    title: "Летний лагерь в LariDea Kids' Café",
    description:
      "Тематический летний лагерь для детей 3–8 лет: будни с 11:30 до 15:00, каждую неделю новая тема — от «Исследователей природы» до «Великого зелёного леса». Аквагрим, водные татуировки, творческие мастер-классы, много игр; питание и вода включены. 4 900 ฿ за неделю, скидки при покупке нескольких недель: 2 — 5%, 4 — 10%, 7 — 15%. Мест немного, запись по телефону 081 110 1713.",
    // 29 июня 11:30 — 14 августа 15:00 по Бангкоку (UTC+7)
    startDate: new Date("2026-06-29T04:30:00Z"),
    endDate: new Date("2026-08-14T08:00:00Z"),
    locationName: "LariDea Kids' Café",
    address: "Again Pattaya, рядом с Terminal 21 Pattaya",
    latitude: 12.9517251,
    longitude: 100.8891907,
    placeId: lariDea.id,
    status: "APPROVED" as const,
    sourceType: "ADMIN" as const,
    isAnonymous: false,
    cityId: pattaya.id,
  };
  const lariDeaCamp = await prisma.event.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "laridea-summer-camp-2026" } },
    update: lariDeaCampData,
    create: { ...lariDeaCampData, slug: "laridea-summer-camp-2026" },
  });
  await prisma.eventCategoryLink.upsert({
    where: {
      eventId_categoryId: {
        eventId: lariDeaCamp.id,
        categoryId: kidsActivityCategory.id,
      },
    },
    update: {},
    create: {
      eventId: lariDeaCamp.id,
      categoryId: kidsActivityCategory.id,
    },
  });

  // =========================
  // 9. [DEMO] UPCOMING EVENT
  // =========================
  const upcomingWorkshopEvent = await prisma.event.upsert({
    where: {
      cityId_slug: { cityId: pattaya.id, slug: "kids-art-workshop-pattaya-upcoming" },
    },
    update: {
      title: "[Демо] Детский арт-мастер-класс",
      description: "Демонстрационное событие (тестовые данные для разработки).",
      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 2),
      locationName: "Central Festival Pattaya",
      address: "Central Festival Pattaya Beach, Pattaya",
      status: "APPROVED",
      isAnonymous: true,
    },
    create: {
      title: "[Демо] Детский арт-мастер-класс",
      slug: "kids-art-workshop-pattaya-upcoming",
      cityId: pattaya.id,
      description: "Демонстрационное событие (тестовые данные для разработки).",
      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 2),
      locationName: "Central Festival Pattaya",
      address: "Central Festival Pattaya Beach, Pattaya",
      status: "APPROVED",
      isAnonymous: true,
    },
  });

  await prisma.eventCategoryLink.upsert({
    where: {
      eventId_categoryId: {
        eventId: upcomingWorkshopEvent.id,
        categoryId: workshopCategory.id,
      },
    },
    update: {},
    create: {
      eventId: upcomingWorkshopEvent.id,
      categoryId: workshopCategory.id,
    },
  });

  // =========================
  // 10. [DEMO] ONGOING EVENT
  // =========================
  const ongoingEvent = await prisma.event.upsert({
    where: {
      cityId_slug: { cityId: pattaya.id, slug: "weekend-kids-play-zone-ongoing" },
    },
    update: {
      title: "[Демо] Игровая зона выходного дня",
      description: "Демонстрационное событие: проверка статуса «Сейчас идёт».",
      startDate: new Date(now.getTime() - 1000 * 60 * 60),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 3),
      locationName: "Terminal 21 Pattaya",
      address: "Terminal 21, Pattaya",
      status: "APPROVED",
      isAnonymous: true,
    },
    create: {
      title: "[Демо] Игровая зона выходного дня",
      slug: "weekend-kids-play-zone-ongoing",
      cityId: pattaya.id,
      description: "Демонстрационное событие: проверка статуса «Сейчас идёт».",
      startDate: new Date(now.getTime() - 1000 * 60 * 60),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 3),
      locationName: "Terminal 21 Pattaya",
      address: "Terminal 21, Pattaya",
      status: "APPROVED",
      isAnonymous: true,
    },
  });

  await prisma.eventCategoryLink.upsert({
    where: {
      eventId_categoryId: {
        eventId: ongoingEvent.id,
        categoryId: kidsActivityCategory.id,
      },
    },
    update: {},
    create: {
      eventId: ongoingEvent.id,
      categoryId: kidsActivityCategory.id,
    },
  });

  // =========================
  // 11. [DEMO] PAST EVENT
  // =========================
  const pastFestivalEvent = await prisma.event.upsert({
    where: {
      cityId_slug: { cityId: pattaya.id, slug: "kids-festival-pattaya-past" },
    },
    update: {
      title: "[Демо] Детский фестиваль (прошедший)",
      description: "Демонстрационное событие: проверка прошедших событий.",
      startDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10),
      endDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 9),
      locationName: "City Park Pattaya",
      address: "Pattaya City Park",
      status: "APPROVED",
      isAnonymous: true,
    },
    create: {
      title: "[Демо] Детский фестиваль (прошедший)",
      slug: "kids-festival-pattaya-past",
      cityId: pattaya.id,
      description: "Демонстрационное событие: проверка прошедших событий.",
      startDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10),
      endDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 9),
      locationName: "City Park Pattaya",
      address: "Pattaya City Park",
      status: "APPROVED",
      isAnonymous: true,
    },
  });

  await prisma.eventCategoryLink.upsert({
    where: {
      eventId_categoryId: {
        eventId: pastFestivalEvent.id,
        categoryId: festivalCategory.id,
      },
    },
    update: {},
    create: {
      eventId: pastFestivalEvent.id,
      categoryId: festivalCategory.id,
    },
  });

  // =========================
  // 12. [DEMO] UPCOMING EVENT LINKED TO PLACE
  // =========================
  const placeWorkshopEvent = await prisma.event.upsert({
    where: {
      cityId_slug: { cityId: pattaya.id, slug: "demo-weekend-kids-workshop" },
    },
    update: {
      title: "[Демо] Мастер-класс выходного дня",
      description: "Демонстрационное событие, привязанное к месту.",
      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 2),
      locationName: "[Демо] Детский клуб «Гавань»",
      address: "Демо-адрес, Паттайя",
      placeId: demoPlace.id,
      status: "APPROVED",
      sourceType: "ADMIN",
      isAnonymous: true,
      autoArchive: true,
      isFeatured: false,
      isSponsored: false,
      isClaimed: false,
    },
    create: {
      title: "[Демо] Мастер-класс выходного дня",
      slug: "demo-weekend-kids-workshop",
      cityId: pattaya.id,
      description: "Демонстрационное событие, привязанное к месту.",
      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 2),
      locationName: "[Демо] Детский клуб «Гавань»",
      address: "Демо-адрес, Паттайя",
      placeId: demoPlace.id,
      status: "APPROVED",
      sourceType: "ADMIN",
      isAnonymous: true,
      autoArchive: true,
      isFeatured: false,
      isSponsored: false,
      isClaimed: false,
    },
  });

  await prisma.eventCategoryLink.upsert({
    where: {
      eventId_categoryId: {
        eventId: placeWorkshopEvent.id,
        categoryId: workshopCategory.id,
      },
    },
    update: {},
    create: {
      eventId: placeWorkshopEvent.id,
      categoryId: workshopCategory.id,
    },
  });

  // Backfill (Сессия 2): все демо-места и события — в Паттайю (пока один город)
  await prisma.place.updateMany({ data: { cityId: pattaya.id } });
  await prisma.event.updateMany({ data: { cityId: pattaya.id } });

  console.log("✅ Seed completed (idempotent)");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
