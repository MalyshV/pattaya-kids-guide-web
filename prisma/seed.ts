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
      nameEn: "Pattaya",
      seoDescriptionEn:
        "A calm guide to kids' places and events in Pattaya: where to go with your child in the morning, after kindergarten and at weekends — with prices and birthday venues.",
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
      nameEn: "Pattaya",
      seoDescriptionEn:
        "A calm guide to kids' places and events in Pattaya: where to go with your child in the morning, after kindergarten and at weekends — with prices and birthday venues.",
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
    { slug: "workshop", name: "Мастер-класс", nameEn: "Workshop" },
    { slug: "festival", name: "Фестиваль", nameEn: "Festival" },
    { slug: "kids-activity", name: "Детская активность", nameEn: "Kids activity" },
  ];
  for (const category of eventCategoriesData) {
    await prisma.eventCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, nameEn: category.nameEn },
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
    {
      slug: "indoor-playground",
      name: "Крытая игровая",
      nameEn: "Indoor playground",
      order: 1,
    },
    { slug: "cafe", name: "Кафе", nameEn: "Café", order: 2 },
    { slug: "playground", name: "Игровая площадка", nameEn: "Playground", order: 3 },
  ];
  for (const category of placeCategoriesData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, nameEn: category.nameEn, order: category.order },
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
    update: { name: "3–6 лет", nameEn: "3–6 years" },
    create: { name: "3–6 лет", nameEn: "3–6 years", minAge: 3, maxAge: 6 },
  });
  const ageGroupUnder2 = await prisma.ageGroup.upsert({
    where: { minAge_maxAge: { minAge: 0, maxAge: 2 } },
    update: { name: "0–2 года", nameEn: "0–2 years" },
    create: { name: "0–2 года", nameEn: "0–2 years", minAge: 0, maxAge: 2 },
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
    { slug: "cafe-on-site", name: "Кафе", nameEn: "Café" },
    { slug: "wifi", name: "Wi-Fi", nameEn: "Wi-Fi" },
  ];
  for (const amenity of amenitiesData) {
    await prisma.amenity.upsert({
      where: { slug: amenity.slug },
      update: {
        name: amenity.name,
        nameEn: amenity.nameEn,
        groupId: foodComfortGroup.id,
      },
      create: {
        name: amenity.name,
        nameEn: amenity.nameEn,
        slug: amenity.slug,
        groupId: foodComfortGroup.id,
      },
    });
  }

  // =========================
  // 5b. КАТЕГОРИИ ЗАНЯТИЙ (справочник для раздела «Занятия»; slug — англ.)
  // =========================
  const activityCategoriesData = [
    {
      slug: "early-development",
      name: "Раннее развитие",
      nameEn: "Early development",
      order: 1,
    },
    { slug: "swimming", name: "Плавание", nameEn: "Swimming", order: 2 },
    { slug: "gymnastics", name: "Гимнастика", nameEn: "Gymnastics", order: 3 },
    { slug: "dance", name: "Танцы", nameEn: "Dance", order: 4 },
    { slug: "art", name: "Рисование", nameEn: "Art", order: 5 },
    { slug: "music", name: "Музыка", nameEn: "Music", order: 6 },
    { slug: "math", name: "Математика", nameEn: "Math", order: 7 },
    { slug: "cooking", name: "Кулинария", nameEn: "Cooking", order: 8 },
  ];
  for (const category of activityCategoriesData) {
    await prisma.activityCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, nameEn: category.nameEn, order: category.order },
      create: category,
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
      imageUrl: "/images/places/sample.svg",
      address: "Демо-адрес, Паттайя",
      latitude: 12.934,
      longitude: 100.889,
      indoor: true,
      hasFood: true,
      hasWifi: true,
      canLeaveChild: false,
      animalContact: false,
      isDemo: true,
      status: "APPROVED",
      cityId: pattaya.id,
    },
    create: {
      name: "[Демо] Детский клуб «Гавань»",
      slug: "demo-harbor-kids-club",
      description:
        "Демонстрационное место для разработки: данные не настоящие. Показывает, как выглядит карточка в каталоге.",
      imageUrl: "/images/places/sample.svg",
      address: "Демо-адрес, Паттайя",
      latitude: 12.934,
      longitude: 100.889,
      indoor: true,
      hasFood: true,
      hasWifi: true,
      canLeaveChild: false,
      animalContact: false,
      isDemo: true,
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
    descriptionEn:
      "A family play space in Pattaya: an air-conditioned indoor zone (ball pit, soft slides, a two-level play maze and a room for toddlers under 2) plus an outdoor playground with swings. A calm café for parents, Wi-Fi and parking. You can leave your child with a play supervisor. Staff in the café and at supervision understand Thai and English. Occasional craft workshops and mini-celebrations.",
    address: "5 Soi Siam Country Club Road, Pong, Bang Lamung, Chonburi 20150",
    latitude: 12.9180161,
    longitude: 100.9727834,
    // Проверенная Вероникой карточка места в Google Maps (2026-07-06)
    googleMapsUrl:
      "https://www.google.com/maps/place/Play+Barn+%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%B0+%E0%B9%80%E0%B8%9E%E0%B8%A5%E0%B8%A2%E0%B9%8C%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%99+playground/@12.9180213,100.9702085,1057m/data=!3m2!1e3!4b1!4m6!3m5!1s0x310295808927f515:0x86dc0f9572804c2!8m2!3d12.9180161!4d100.9727834!16s%2Fg%2F11y_xtnq_r",
    imageUrl: "/images/places/play-barn.jpg", // тест-фото (заменим позже)
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
    hasPowerOutlets: null, // розетки не проверяли — «уточняется»
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

  // Галерея The Play Barn: доп. фото (обложка — imageUrl отдельно). Тест-фото.
  await prisma.placePhoto.deleteMany({ where: { placeId: playBarn.id } });
  await prisma.placePhoto.createMany({
    data: [
      { placeId: playBarn.id, url: "/images/places/play-barn-2.jpg", order: 1 },
      { placeId: playBarn.id, url: "/images/places/play-barn-3.jpg", order: 2 },
      { placeId: playBarn.id, url: "/images/places/play-barn-4.jpg", order: 3 },
      { placeId: playBarn.id, url: "/images/places/play-barn-5.jpg", order: 4 },
      { placeId: playBarn.id, url: "/images/places/play-barn-6.jpg", order: 5 },
    ],
  });

  // Языки персонала (справочник) + привязка к The Play Barn (тайский и английский)
  const languagesData = [
    { code: "th", name: "Тайский", nameEn: "Thai" },
    { code: "en", name: "Английский", nameEn: "English" },
  ];
  for (const language of languagesData) {
    const record = await prisma.language.upsert({
      where: { code: language.code },
      update: { name: language.name, nameEn: language.nameEn },
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

  // День рождения The Play Barn: подтверждён только ФАКТ «проводят» (была
  // ДР-зона на визите Вероники). Пакеты/гости/депозит НЕ подтверждены — числа
  // не выдумываем, null=«уточняется». Заполнить после уточнения у места.
  await prisma.placeBirthdayInfo.upsert({
    where: { placeId: playBarn.id },
    update: {
      hasPackages: true,
      minGuests: null,
      maxGuests: null,
      depositRequired: null,
      preBookingDays: null,
      notes: "Проводят детские дни рождения. Пакеты, цены и условия уточняются.",
      notesEn:
        "They host kids' birthday parties. Packages, prices and terms to be confirmed.",
    },
    create: {
      placeId: playBarn.id,
      hasPackages: true,
      minGuests: null,
      maxGuests: null,
      depositRequired: null,
      preBookingDays: null,
      notes: "Проводят детские дни рождения. Пакеты, цены и условия уточняются.",
      notesEn:
        "They host kids' birthday parties. Packages, prices and terms to be confirmed.",
    },
  });

  // «Полезно знать» The Play Barn (визит Вероники на открытии — уточнить актуальность)
  await prisma.placeTip.deleteMany({ where: { placeId: playBarn.id } });
  await prisma.placeTip.createMany({
    data: [
      {
        placeId: playBarn.id,
        topic: "socks",
        order: 1,
        text: "Носки обязательны: подойдут любые нескользящие, но нужна чистая пара с собой — не та, в которой пришли. Правила с открытия могли измениться — уточняем.",
        textEn:
          "Socks are required: any non-slip pair works, but bring a clean pair with you — not the ones you walked in. Rules may have changed since opening — we're double-checking.",
        verifiedAt: null,
      },
    ],
  });

  // Контакты The Play Barn (карточка Google + соцсети, 2026-07-06). Основной
  // канал связи — LINE (в Таиланде часто вместо телефона).
  await prisma.placeContact.deleteMany({ where: { placeId: playBarn.id } });
  await prisma.placeContact.createMany({
    data: [
      { placeId: playBarn.id, type: "line", value: "@ThePlayBarnPattaya", order: 1 },
      {
        placeId: playBarn.id,
        type: "instagram",
        value: "https://www.instagram.com/theplaybarnpattaya",
        order: 2,
      },
      {
        placeId: playBarn.id,
        type: "facebook",
        value: "https://www.facebook.com/ThePlayBarnPattaya",
        order: 3,
      },
    ],
  });

  // СОБЫТИЕ The Play Barn — реальное разовое мероприятие (афиша Instagram).
  // Прошедшее: 17 июня 2026, 15:30–17:30 по Бангкоку (UTC+7). Название переведено
  // с англ. (ориг. «Father's Day Handprint Card Workshop»).
  const playBarnFathersDayData = {
    title: "Мастер-класс «Открытка ко Дню отца из ладошек»",
    titleEn: "Father's Day handprint card workshop",
    imageUrl: "/images/events/fathers-day-workshop.jpg", // тест-фото (заменим позже)
    description:
      "Дети делают открытку ко Дню отца из отпечатков ладошек — подходит для любого возраста. Нужна предварительная запись, мест немного. Вход 300 ฿.",
    descriptionEn:
      "Kids make a Father's Day card from handprints — suitable for any age. Booking required, spots are limited. Entry 300 ฿.",
    startDate: new Date("2026-06-17T08:30:00Z"),
    endDate: new Date("2026-06-17T10:30:00Z"),
    locationName: "The Play Barn",
    address: "5 Soi Siam Country Club Road, Pong, Bang Lamung, Chonburi 20150",
    latitude: 12.9180161,
    longitude: 100.9727834,
    placeId: playBarn.id,
    status: "APPROVED" as const,
    sourceType: "ADMIN" as const,
    isAnonymous: false,
    cityId: pattaya.id,
  };
  const playBarnFathersDay = await prisma.event.upsert({
    where: {
      cityId_slug: { cityId: pattaya.id, slug: "play-barn-fathers-day-2026" },
    },
    update: playBarnFathersDayData,
    create: { ...playBarnFathersDayData, slug: "play-barn-fathers-day-2026" },
  });
  await prisma.eventCategoryLink.upsert({
    where: {
      eventId_categoryId: {
        eventId: playBarnFathersDay.id,
        categoryId: workshopCategory.id,
      },
    },
    update: {},
    create: {
      eventId: playBarnFathersDay.id,
      categoryId: workshopCategory.id,
    },
  });

  // Программы The Play Barn: регулярная игровая группа. Это НЕ разовое событие —
  // постоянная еженедельная активность (по пн/пт), поэтому программа, не Event.
  // Афиша Instagram, 4 июня 2026.
  const playBarnOldPrograms = await prisma.placeProgram.findMany({
    where: { placeId: playBarn.id },
    select: { id: true },
  });
  await prisma.programActivityCategory.deleteMany({
    where: { programId: { in: playBarnOldPrograms.map((p) => p.id) } },
  });
  await prisma.placeProgram.deleteMany({ where: { placeId: playBarn.id } });
  const barnyardProgram = await prisma.placeProgram.create({
    data: {
      placeId: playBarn.id,
      slug: "play-barn-barnyard-cubs",
      type: "COURSE",
      name: "Игровая группа Barnyard Cubs",
      nameEn: "Barnyard Cubs playgroup",
      imageUrl: "/images/activities/barnyard-cubs.jpg", // тест-фото (заменим позже)
      description:
        "Музыка, танцы и сенсорные игры для малышей до 3 лет. Творчество, песенки на английском и тайском, свободная игра в прохладном помещении с кондиционером, развитие и новые друзья. По понедельникам и пятницам, 14:00–16:00. Кофе или смузи для взрослого и перекусы включены.",
      descriptionEn:
        "Music, dancing and sensory play for little ones under 3. Crafts, songs in English and Thai, free play in a cool air-conditioned room, development and new friends. Mondays and Fridays, 14:00–16:00. A coffee or smoothie for the adult and snacks included.",
      price: 300,
      currency: "THB",
      priceUnit: "за ребёнка и взрослого",
      priceUnitEn: "per child + adult",
      minAgeMonths: 0,
      maxAgeMonths: 36,
      order: 1,
    },
  });
  // Категория занятия: раннее развитие (комплексная развивашка для до 3 лет)
  const earlyDevCategory = await prisma.activityCategory.findUnique({
    where: { slug: "early-development" },
  });
  if (earlyDevCategory) {
    await prisma.programActivityCategory.create({
      data: { programId: barnyardProgram.id, categoryId: earlyDevCategory.id },
    });
  }

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
    imageUrl: "/images/places/laridea.jpg", // фото входа (визит Вероники 2026-07-07)
    imageRightsNote: "Фото Вероники (визит 2026-07-07)",
    description:
      "Детское кафе с крытой игровой в северной Паттайе (Again, рядом с Terminal 21). Игровая зона с кондиционером для детей 1–7 лет, спешелти-кофе, Wi-Fi и кафе со столиками, где родителю удобно посидеть за ноутбуком. Можно оставить ребёнка под присмотром. Персонал говорит по-тайски и по-английски. По выходным — мастер-классы для детей (кулинария, научные опыты), проводят дни рождения, летом работает детский лагерь. Для постоянных гостей — абонементы и клубные скидки.",
    descriptionEn:
      "A kids' café with an indoor playground in North Pattaya (Again, near Terminal 21). An air-conditioned play zone for ages 1–7, specialty coffee, Wi-Fi and café tables where a parent can comfortably work on a laptop. Child drop-off with supervision available. Staff speak Thai and English. Weekend workshops for kids (cooking, science experiments), birthday parties, and a summer camp. Memberships and club discounts for regulars.",
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
    hasPowerOutlets: null, // кафе до входа — без розеток (заряжают на стойке); внутренняя зона — уточняется
    entryPriceNote: "В будни при посещении до 15:00 — скидка 10%. Цены с НДС 7%.",
    entryPriceNoteEn: "10% off on weekdays before 15:00. Prices include 7% VAT.",
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
    update: { name: "1–7 лет", nameEn: "1–7 years" },
    create: { name: "1–7 лет", nameEn: "1–7 years", minAge: 1, maxAge: 7 },
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
  // переносы строк осмысленные: каждый пакет с новой строки (вёрстка
  // birthday-card-notes рендерит pre-line — простыня из трёх пакетов нечитаема)
  const lariDeaBirthdayNotes =
    "«Little Joy» — от 946 ฿ за ребёнка (от 5 детей, 2 часа)\n«Happy Moments» — 1 166 ฿ (от 10 детей)\n«Magic Day» — 1 496 ฿ (от 10 детей, 4 часа, приватная игровая)\nДепозит 50%, цены включают VAT. Допы: декор, фотограф, шоу.";
  const lariDeaBirthdayNotesEn =
    "“Little Joy” — from 946 ฿ per child (from 5 kids, 2 hours)\n“Happy Moments” — 1,166 ฿ (from 10 kids)\n“Magic Day” — 1,496 ฿ (from 10 kids, 4 hours, private playground)\n50% deposit, prices include VAT. Add-ons: decor, photographer, show.";
  await prisma.placeBirthdayInfo.upsert({
    where: { placeId: lariDea.id },
    update: {
      hasPackages: true,
      minGuests: 5,
      maxGuests: null,
      depositRequired: true,
      preBookingDays: null,
      notes: lariDeaBirthdayNotes,
      notesEn: lariDeaBirthdayNotesEn,
    },
    create: {
      placeId: lariDea.id,
      hasPackages: true,
      minGuests: 5,
      maxGuests: null,
      depositRequired: true,
      preBookingDays: null,
      notes: lariDeaBirthdayNotes,
      notesEn: lariDeaBirthdayNotesEn,
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

  // Цены входа LariDea (прайс-лист, визит Вероники 2026-07-07): почасовой вход,
  // отдельная цена ребёнку и взрослому. Подпись (скидка/НДС) — в entryPriceNote.
  await prisma.placeEntryPrice.deleteMany({ where: { placeId: lariDea.id } });
  await prisma.placeEntryPrice.createMany({
    data: [
      {
        placeId: lariDea.id,
        label: "1 час",
        labelEn: "1 hour",
        childPrice: 196,
        adultPrice: 95,
        order: 1,
      },
      {
        placeId: lariDea.id,
        label: "3 часа",
        labelEn: "3 hours",
        childPrice: 436,
        adultPrice: 185,
        order: 2,
      },
      {
        placeId: lariDea.id,
        label: "5 часов",
        labelEn: "5 hours",
        childPrice: 603,
        adultPrice: 262,
        order: 3,
      },
    ],
  });

  // Мини-галерея LariDea: доп. фото (обложка — imageUrl отдельно). Тест-фото визита.
  await prisma.placePhoto.deleteMany({ where: { placeId: lariDea.id } });
  await prisma.placePhoto.createMany({
    data: [
      {
        placeId: lariDea.id,
        url: "/images/places/laridea-play.jpg",
        caption: "Игровая зона LariDea",
        order: 1,
        source: "OWN" as const,
        rightsNote: "Фото Вероники (визит 2026-07-07)",
      },
    ],
  });

  // «Полезно знать» LariDea. Обновлено с личного визита Вероники 2026-07-07
  // (прайс-лист и постеры на месте) — факты подтверждены, verifiedAt проставлен.
  const lariDeaVisit = new Date("2026-07-07");
  await prisma.placeTip.deleteMany({ where: { placeId: lariDea.id } });
  await prisma.placeTip.createMany({
    data: [
      {
        placeId: lariDea.id,
        topic: "socks",
        order: 1,
        text: "В игровую пускают только в фирменных носках LariDea (со своими нельзя): 50 ฿, обязательны и детям, и взрослым. По абонементу первая пара — бесплатно, а в пакеты дня рождения детские носки уже включены (взрослым — нет).",
        textEn:
          "The playground only allows LariDea-branded socks (your own won't do): 50 ฿, required for both kids and adults. With a membership the first pair is free, and birthday packages already include kids' socks (adults' are not).",
        verifiedAt: lariDeaVisit,
      },
      {
        placeId: lariDea.id,
        topic: "happy-hour",
        order: 3,
        text: "«Счастливый час» для родителей: по будням 11:00–14:00 — бесплатные кофе и сок, пока дети играют.",
        textEn:
          "Parents' happy hour: on weekdays 11:00–14:00 coffee and juice are free while the kids play.",
        verifiedAt: lariDeaVisit,
      },
    ],
  });

  // Контакты LariDea (профиль Instagram + карточка Google, 2026-07-06)
  await prisma.placeContact.deleteMany({ where: { placeId: lariDea.id } });
  await prisma.placeContact.createMany({
    data: [
      { placeId: lariDea.id, type: "phone", value: "081 110 1713", order: 1 },
      {
        placeId: lariDea.id,
        type: "instagram",
        value: "https://www.instagram.com/laridea_kids_cafe",
        order: 2,
      },
      {
        placeId: lariDea.id,
        type: "facebook",
        value: "https://www.facebook.com/share/g/18WkRmomTk",
        order: 3,
      },
      {
        placeId: lariDea.id,
        type: "website",
        value: "https://laridea.co.th",
        order: 4,
      },
    ],
  });

  // Лагерь LariDea переехал из «Событий» в «Программы места» (концептуально это
  // длящаяся программа, а не разовое событие). Убираем старое событие, если оно
  // было засеяно раньше (сначала связи с категориями, потом само событие).
  const legacyCampEvent = await prisma.event.findFirst({
    where: { cityId: pattaya.id, slug: "laridea-summer-camp-2026" },
  });
  if (legacyCampEvent) {
    await prisma.eventCategoryLink.deleteMany({
      where: { eventId: legacyCampEvent.id },
    });
    await prisma.event.delete({ where: { id: legacyCampEvent.id } });
  }

  // Программы LariDea: летний лагерь (сезонная) + абонементы (цена места живёт
  // здесь — разовый вход они не публикуют). Данные — Instagram, 2026.
  const lariDeaOldPrograms = await prisma.placeProgram.findMany({
    where: { placeId: lariDea.id },
    select: { id: true },
  });
  await prisma.programActivityCategory.deleteMany({
    where: { programId: { in: lariDeaOldPrograms.map((p) => p.id) } },
  });
  await prisma.placeProgram.deleteMany({ where: { placeId: lariDea.id } });
  await prisma.placeProgram.createMany({
    data: [
      {
        placeId: lariDea.id,
        slug: "laridea-summer-camp",
        type: "CAMP",
        name: "Летний лагерь",
        nameEn: "Summer camp",
        imageUrl: "/images/activities/laridea-summer-camp.jpg", // тест-фото (заменим позже)
        description:
          "Тематические недели для детей 3–8 лет, будни 11:30–15:00: каждую неделю новая тема — от «Исследователей природы» до «Великого зелёного леса». Аквагрим, водные татуировки, творческие мастер-классы, много игр; питание и вода включены. Скидки при покупке нескольких недель: 2 — 5%, 4 — 10%, 7 — 15%.",
        descriptionEn:
          "Themed weeks for kids 3–8, weekdays 11:30–15:00: a new theme every week — from Nature Explorers to the Great Green Forest. Face painting, water tattoos, craft workshops and lots of games; meals and water included. Multi-week discounts: 2 — 5%, 4 — 10%, 7 — 15%.",
        price: 4900,
        currency: "THB",
        priceUnit: "/ неделя",
        priceUnitEn: "/ week",
        minAgeMonths: 36,
        maxAgeMonths: 96,
        // 29 июня 11:30 — 14 августа 15:00 по Бангкоку (UTC+7)
        startDate: new Date("2026-06-29T04:30:00Z"),
        endDate: new Date("2026-08-14T08:00:00Z"),
        order: 1,
      },
      {
        placeId: lariDea.id,
        type: "MEMBERSHIP",
        name: "Абонемент Rainbow Polly",
        nameEn: "Rainbow Polly pass",
        description:
          "30 дней · безлимитные входы · весь день · 1 ребёнок + 1 взрослый · первая пара носков бесплатно.",
        descriptionEn:
          "30 days · unlimited visits · all day · 1 child + 1 adult · first pair of socks free.",
        price: 3850,
        currency: "THB",
        priceUnit: "/ 30 дней",
        priceUnitEn: "/ 30 days",
        order: 2,
      },
      {
        placeId: lariDea.id,
        type: "MEMBERSHIP",
        name: "Абонемент Astro Polly",
        nameEn: "Astro Polly pass",
        description:
          "60 дней · 16 входов по 3 часа · 1 ребёнок + 1 взрослый · первая пара носков бесплатно.",
        descriptionEn:
          "60 days · 16 visits of 3 hours each · 1 child + 1 adult · first pair of socks free.",
        price: 4839,
        oldPrice: 6912,
        currency: "THB",
        priceUnit: "/ 60 дней",
        priceUnitEn: "/ 60 days",
        order: 3,
      },
      {
        placeId: lariDea.id,
        type: "MEMBERSHIP",
        name: "Абонемент на 6 месяцев",
        nameEn: "6-month pass",
        description:
          "180 дней · безлимитные входы · весь день · 1 ребёнок + 1 взрослый · первая пара носков бесплатно.",
        descriptionEn:
          "180 days · unlimited visits · all day · 1 child + 1 adult · first pair of socks free.",
        price: 15400,
        oldPrice: 23100,
        currency: "THB",
        priceUnit: "/ 180 дней",
        priceUnitEn: "/ 180 days",
        order: 4,
      },
      {
        placeId: lariDea.id,
        type: "MEMBERSHIP",
        name: "Клубное членство",
        nameEn: "Club membership",
        description:
          "Клубная программа с преимуществами: −30% на игровую, −15% на мероприятия и мастер-классы, −10% в кафе, −15% на услуги няни, приоритетный доступ и приглашения на эксклюзивные мастер-классы. Условия вступления уточняются.",
        descriptionEn:
          "A club programme with perks: −30% on the playground, −15% on events and workshops, −10% in the café, −15% on nanny services, priority access and invitations to exclusive workshops. Joining terms to be confirmed.",
        // цена не опубликована — карточка покажет только преимущества
        order: 5,
      },
    ],
  });

  // «День готовки» — регулярная активность LariDea по выходным (постер, визит
  // Вероники 2026-07-07). Отдельным create, чтобы привязать категорию «Кулинария».
  const lariDeaCooking = await prisma.placeProgram.create({
    data: {
      placeId: lariDea.id,
      slug: "laridea-cooking-day",
      type: "COURSE",
      name: "День готовки: свой капкейк",
      nameEn: "Cooking day: make your own cupcake",
      imageUrl: "/images/activities/laridea-cupcake.jpg", // тест-фото (заменим позже)
      description:
        "Творческое кулинарное занятие по выходным: ребёнок сам готовит и украшает капкейк. В стоимость входит 1 час игровой; цена за ребёнка и взрослого. Для членов клуба — 250 ฿.",
      descriptionEn:
        "A creative weekend cooking class: your child bakes and decorates their own cupcake. The price includes 1 hour of playground time and covers one child + one adult. Club members — 250 ฿.",
      price: 499,
      currency: "THB",
      priceUnit: "за ребёнка и взрослого",
      priceUnitEn: "per child + adult",
      order: 6,
    },
  });
  const cookingCategory = await prisma.activityCategory.findUnique({
    where: { slug: "cooking" },
  });
  if (cookingCategory) {
    await prisma.programActivityCategory.create({
      data: { programId: lariDeaCooking.id, categoryId: cookingCategory.id },
    });
  }

  // =========================
  // THE LITTLE GYM PATTAYA — третье реальное место (спортивно-развивающая школа).
  // Источники (2026-07): Instagram/Facebook @thelittlegympattaya (скриншоты
  // Вероники), карточка Google Maps, афиша расписания. Первая спортивная
  // категория в каталоге (гимнастика) — проверка раздела «Занятия».
  // Уточнить позже: цены (Вероника запросила через LINE), даты/цена лагеря,
  // часы работы места, парковка/Wi-Fi.
  // =========================
  const littleGymData = {
    name: "The Little Gym Pattaya",
    description:
      "Детская спортивно-развивающая школа (сеть The Little Gym) в центре Паттайи. Классы гимнастики и активного развития для детей от 4 месяцев до 12 лет — по возрастным группам, через игру. «Красные» занятия (45 мин) проходят вместе с родителем, «синие» (1 час) — ребёнок занимается самостоятельно, пока вы наблюдаете из лобби. Летом работает лагерь. Первое пробное занятие — бесплатно.",
    descriptionEn:
      "A kids' sports and development school (The Little Gym network) in central Pattaya. Gymnastics and active development classes for ages 4 months to 12 years — by age group, through play. “Red” classes (45 min) are taken together with a parent; in “blue” classes (1 hour) the child trains independently while you watch from the lobby. A camp runs in summer. The first trial class is free.",
    address: "353/53-55, Nong Prue, Bang Lamung District, Chon Buri 20150 (Numchai Fair)",
    latitude: 12.9337251,
    longitude: 100.9042526,
    googleMapsUrl:
      "https://www.google.com/maps/place/The+Little+Gym+Pattaya/@12.9337303,100.9016777,1057m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3102bfff79575b81:0xee3e1ea0276d60a6!8m2!3d12.9337251!4d100.9042526!16s%2Fg%2F11lgzb6sq0",
    imageUrl: "/images/places/little-gym.jpg", // тест-фото (заменим позже)
    indoor: true,
    outdoor: false,
    hasFood: false,
    hasWifi: null, // Wi-Fi не подтверждён — «уточняется»
    // нет свободной игровой-присмотра: на «синих» классах родитель на месте (в лобби),
    // это не «оставить ребёнка». Контекст (красные/синие) — в описании и занятии
    canLeaveChild: false,
    animalContact: false,
    hasAirCon: true,
    hasParking: true, // подтверждено Вероникой 2026-07
    hasCafeSeating: false,
    hasPowerOutlets: null, // розетки не проверяли — «уточняется»
    status: "APPROVED" as const,
    cityId: pattaya.id,
  };
  const littleGym = await prisma.place.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "the-little-gym" } },
    update: littleGymData,
    create: { ...littleGymData, slug: "the-little-gym" },
  });

  // Возраст The Little Gym: 4 мес – 12 лет (0–2, 3–6, 7–12)
  const ageGroup7to12 = await prisma.ageGroup.upsert({
    where: { minAge_maxAge: { minAge: 7, maxAge: 12 } },
    update: { name: "7–12 лет", nameEn: "7–12 years" },
    create: { name: "7–12 лет", nameEn: "7–12 years", minAge: 7, maxAge: 12 },
  });
  for (const groupId of [ageGroupUnder2.id, ageGroup3to6.id, ageGroup7to12.id]) {
    await prisma.placeAgeGroup.upsert({
      where: { placeId_ageGroupId: { placeId: littleGym.id, ageGroupId: groupId } },
      update: {},
      create: { placeId: littleGym.id, ageGroupId: groupId },
    });
  }

  // Языки персонала (сетевой бренд — тайский и английский)
  for (const code of ["th", "en"]) {
    const language = await prisma.language.findUnique({ where: { code } });
    if (language) {
      await prisma.placeStaffLanguage.upsert({
        where: {
          placeId_languageId: { placeId: littleGym.id, languageId: language.id },
        },
        update: {},
        create: { placeId: littleGym.id, languageId: language.id },
      });
    }
  }

  // Контакты The Little Gym (профиль FB/IG + карточка Google). LINE — короткая
  // ссылка lin.ee (не @id).
  await prisma.placeContact.deleteMany({ where: { placeId: littleGym.id } });
  await prisma.placeContact.createMany({
    data: [
      { placeId: littleGym.id, type: "phone", value: "090 886 6343", order: 1 },
      {
        placeId: littleGym.id,
        type: "line",
        value: "https://lin.ee/uCQq6gZ",
        order: 2,
      },
      {
        placeId: littleGym.id,
        type: "instagram",
        value: "https://www.instagram.com/thelittlegympattaya",
        order: 3,
      },
      {
        placeId: littleGym.id,
        type: "facebook",
        value: "https://facebook.com/thelittlegympattaya",
        order: 4,
      },
      {
        placeId: littleGym.id,
        type: "email",
        value: "thelittlegym.pattaya@gmail.com",
        order: 5,
      },
      {
        placeId: littleGym.id,
        type: "website",
        value: "https://thelittlegym.com",
        order: 6,
      },
    ],
  });

  // Занятие The Little Gym: гимнастика (обёртка над 8 возрастными классами —
  // разбивка в описании; отдельные классы по возрастам — на будущее).
  const littleGymOldPrograms = await prisma.placeProgram.findMany({
    where: { placeId: littleGym.id },
    select: { id: true },
  });
  await prisma.programActivityCategory.deleteMany({
    where: { programId: { in: littleGymOldPrograms.map((p) => p.id) } },
  });
  // классы — дочерние к программе (FK без cascade): чистим ДО удаления программ
  await prisma.placeClass.deleteMany({
    where: { programId: { in: littleGymOldPrograms.map((p) => p.id) } },
  });
  await prisma.placeProgram.deleteMany({ where: { placeId: littleGym.id } });
  const gymProgram = await prisma.placeProgram.create({
    data: {
      placeId: littleGym.id,
      slug: "little-gym-gymnastics",
      type: "COURSE",
      name: "Гимнастика и активное развитие",
      nameEn: "Gymnastics and active development",
      imageUrl: "/images/activities/little-gym-gymnastics.jpg", // тест-фото (заменим позже)
      description:
        "Классы гимнастики и активного развития по возрастным группам от 4 месяцев до 12 лет — через игру. Занятия со вторника по воскресенье (понедельник — выходной). Первое пробное занятие бесплатно. Деление на классы, расписание и участие родителя — в таблице ниже.",
      descriptionEn:
        "Gymnastics and active development classes by age group, from 4 months to 12 years — through play. Classes Tuesday to Sunday (closed on Mondays). The first trial class is free. Class levels, schedule and parent participation — in the table below.",
      minAgeMonths: 4,
      maxAgeMonths: 144,
      order: 1,
    },
  });
  const gymnasticsCategory = await prisma.activityCategory.findUnique({
    where: { slug: "gymnastics" },
  });
  if (gymnasticsCategory) {
    await prisma.programActivityCategory.create({
      data: { programId: gymProgram.id, categoryId: gymnasticsCategory.id },
    });
  }

  // 8 классов гимнастики Little Gym (афиша расписания, визит Вероники). parentRequired:
  // true = красный (45 мин, с родителем), false = синий (1 ч, без), null = оба (Super
  // beasts: красный для новичков, синий для готовых заниматься час без родителя).
  // ⚠️ Времена считаны с фото — Вероника проверит по постеру.
  await prisma.placeClass.deleteMany({ where: { programId: gymProgram.id } });
  await prisma.placeClass.createMany({
    data: [
      {
        programId: gymProgram.id,
        name: "Bugs",
        ageLabel: "4–10 мес",
        ageLabelEn: "4–10 mo",
        minAgeMonths: 4,
        maxAgeMonths: 10,
        parentRequired: true,
        schedule: "Ср 10:00 · Вс 09:15",
        scheduleEn: "Wed 10:00 · Sun 09:15",
        order: 1,
      },
      {
        programId: gymProgram.id,
        name: "Birds",
        ageLabel: "10–19 мес",
        ageLabelEn: "10–19 mo",
        minAgeMonths: 10,
        maxAgeMonths: 19,
        parentRequired: true,
        schedule: "Вт 10:00 · Чт 14:00 · Сб 10:00 · Вс 13:30",
        scheduleEn: "Tue 10:00 · Thu 14:00 · Sat 10:00 · Sun 13:30",
        order: 2,
      },
      {
        programId: gymProgram.id,
        name: "Beasts",
        ageLabel: "19–30 мес",
        ageLabelEn: "19–30 mo",
        minAgeMonths: 19,
        maxAgeMonths: 30,
        parentRequired: true,
        schedule: "Вт 11:00 · Ср 11:00 · Чт 15:00 · Пт 10:00 · Сб 11:00 · Вс 10:00",
        scheduleEn:
          "Tue 11:00 · Wed 11:00 · Thu 15:00 · Fri 10:00 · Sat 11:00 · Sun 10:00",
        order: 3,
      },
      {
        programId: gymProgram.id,
        name: "Super beasts",
        ageLabel: "30 мес – 3 г",
        ageLabelEn: "30 mo – 3 y",
        minAgeMonths: 30,
        maxAgeMonths: 36,
        parentRequired: true,
        schedule: "Вт 11:00 · Ср 11:00 · Чт 15:00 · Пт 10:00 · Сб 11:00 · Вс 10:00",
        scheduleEn:
          "Tue 11:00 · Wed 11:00 · Thu 15:00 · Fri 10:00 · Sat 11:00 · Sun 10:00",
        order: 4,
      },
      {
        programId: gymProgram.id,
        name: "Super beasts",
        ageLabel: "30 мес – 3 г",
        ageLabelEn: "30 mo – 3 y",
        minAgeMonths: 30,
        maxAgeMonths: 36,
        parentRequired: false,
        schedule: "Вт 16:15 · Ср 14:30 · Чт 16:00 · Пт 11:00 · Сб 13:30 · Вс 11:00",
        scheduleEn:
          "Tue 16:15 · Wed 14:30 · Thu 16:00 · Fri 11:00 · Sat 13:30 · Sun 11:00",
        order: 5,
      },
      {
        programId: gymProgram.id,
        name: "Funny bugs",
        ageLabel: "3–4 г",
        ageLabelEn: "3–4 y",
        minAgeMonths: 36,
        maxAgeMonths: 48,
        parentRequired: false,
        schedule: "Вт 16:15 · Ср 14:30 · Чт 16:00 · Пт 11:00 · Сб 13:30 · Вс 11:00",
        scheduleEn:
          "Tue 16:15 · Wed 14:30 · Thu 16:00 · Fri 11:00 · Sat 13:30 · Sun 11:00",
        order: 6,
      },
      {
        programId: gymProgram.id,
        name: "Giggle worms",
        ageLabel: "4–5 лет",
        ageLabelEn: "4–5 y",
        minAgeMonths: 48,
        maxAgeMonths: 60,
        parentRequired: false,
        schedule: "Вт 15:00 · Ср 16:00 · Пт 16:00 · Сб 15:00 · Вс 14:30",
        scheduleEn: "Tue 15:00 · Wed 16:00 · Fri 16:00 · Sat 15:00 · Sun 14:30",
        order: 7,
      },
      {
        programId: gymProgram.id,
        name: "Good Friends",
        ageLabel: "5–6 лет",
        ageLabelEn: "5–6 y",
        minAgeMonths: 60,
        maxAgeMonths: 72,
        parentRequired: false,
        schedule: "Вт 15:00 · Ср 16:00 · Пт 16:00 · Сб 15:00 · Вс 14:30",
        scheduleEn: "Tue 15:00 · Wed 16:00 · Fri 16:00 · Sat 15:00 · Sun 14:30",
        order: 8,
      },
      {
        programId: gymProgram.id,
        name: "Flips/Hotshots",
        ageLabel: "6–12 лет",
        ageLabelEn: "6–12 y",
        minAgeMonths: 72,
        maxAgeMonths: 144,
        parentRequired: false,
        schedule: "Вт 17:30 · Чт 17:30 · Пт 17:30 · Сб 16:30",
        scheduleEn: "Tue 17:30 · Thu 17:30 · Fri 17:30 · Sat 16:30",
        order: 9,
      },
    ],
  });

  // Часы работы The Little Gym (карточка Google): Вт–Вс 09:00–18:00, ПН выходной
  await prisma.placeSchedule.deleteMany({ where: { placeId: littleGym.id } });
  await prisma.placeSchedule.createMany({
    data: [
      { placeId: littleGym.id, day: "MON", openTime: "", closeTime: "", isClosed: true },
      ...(["TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const).map((day) => ({
        placeId: littleGym.id,
        day,
        openTime: "09:00",
        closeTime: "18:00",
        isClosed: false,
      })),
    ],
  });

  // =========================
  // РЕАЛЬНОЕ МЕСТО: Gaya Wellness Studio (филиал Pattaya Klang)
  // Источники (2026-07-15): скриншот карточки Google Maps + Instagram-постеры
  // @gayawellnessstudio (Вероника). Студия пилатеса на реформерах, запустила
  // детское направление Kids Pilates (10–15 лет). Уточнить (нет на скринах,
  // gaps поведёт): кондиционер / Wi-Fi / розетки / место посидеть / можно ли
  // оставить ребёнка / языки персонала / обычная цена занятий. Фото — только
  // их IG-реклама (чужие права), обложка пока плейсхолдер.
  // =========================
  const gayaData = {
    name: "Gaya Wellness Studio",
    description:
      "Студия пилатеса на реформерах в центре Паттайи (район Pattaya Klang). Летом 2026 студия запустила детское направление — Kids Pilates для детей 10–15 лет: занятия на профессиональном оборудовании небольшими группами, с инструктором. Запись через Instagram или Line студии.",
    descriptionEn:
      "A reformer Pilates studio in central Pattaya (Pattaya Klang). In summer 2026 the studio launched a kids' program — Kids Pilates for ages 10–15: small-group sessions on professional equipment with an instructor. Book via the studio's Instagram or Line.",
    address: "512/10 Moo 9, Pattaya City, Bang Lamung District, Chon Buri 20150",
    latitude: 12.9328173,
    longitude: 100.8973319,
    // Проверенная карточка места в Google Maps (ссылка от Вероники, трекинг-хвост обрезан)
    googleMapsUrl:
      "https://www.google.com/maps/place/Gaya+Wellness+studio+(+Branch+2+-+Pattaya+Klang)/@12.9328225,100.894757,1057m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31029500019e164b:0xaadbe130a9c424c0!8m2!3d12.9328173!4d100.8973319!16s%2Fg%2F11w8sf4vc5",
    indoor: true,
    outdoor: false,
    status: "APPROVED" as const,
    cityId: pattaya.id,
  };
  const gaya = await prisma.place.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "gaya-wellness-studio" } },
    update: gayaData,
    create: { ...gayaData, slug: "gaya-wellness-studio" },
  });

  // Возраст Gaya: детское направление 10–15 лет (Kids Pilates)
  const ageGroup10to15 = await prisma.ageGroup.upsert({
    where: { minAge_maxAge: { minAge: 10, maxAge: 15 } },
    update: { name: "10–15 лет", nameEn: "10–15 years" },
    create: { name: "10–15 лет", nameEn: "10–15 years", minAge: 10, maxAge: 15 },
  });
  await prisma.placeAgeGroup.upsert({
    where: {
      placeId_ageGroupId: { placeId: gaya.id, ageGroupId: ageGroup10to15.id },
    },
    update: {},
    create: { placeId: gaya.id, ageGroupId: ageGroup10to15.id },
  });

  // Контакты Gaya (карточка Google + Instagram/Line из постеров)
  await prisma.placeContact.deleteMany({ where: { placeId: gaya.id } });
  await prisma.placeContact.createMany({
    data: [
      { placeId: gaya.id, type: "phone", value: "087 834 4455", order: 1 },
      { placeId: gaya.id, type: "line", value: "@gayawellnessstudio", order: 2 },
      {
        placeId: gaya.id,
        type: "instagram",
        value: "https://www.instagram.com/gayawellnessstudio",
        order: 3,
      },
    ],
  });

  // Часы работы Gaya (карточка Google): Пн–Пт 08:00–21:00, Сб–Вс 09:30–13:00
  await prisma.placeSchedule.deleteMany({ where: { placeId: gaya.id } });
  await prisma.placeSchedule.createMany({
    data: [
      ...(["MON", "TUE", "WED", "THU", "FRI"] as const).map((day) => ({
        placeId: gaya.id,
        day,
        openTime: "08:00",
        closeTime: "21:00",
        isClosed: false,
      })),
      ...(["SAT", "SUN"] as const).map((day) => ({
        placeId: gaya.id,
        day,
        openTime: "09:30",
        closeTime: "13:00",
        isClosed: false,
      })),
    ],
  });

  // РЕАЛЬНОЕ СОБЫТИЕ: «Детский пилатес — первый класс» (постер @gayawellnessstudio).
  // Разовый первый класс субботы 18.07.2026, 15:00–16:00 по Паттайе (UTC+7 → 08:00Z).
  // Если субботние занятия станут регулярными — перевести в раздел «Занятия» (COURSE).
  const gayaKidsPilatesData = {
    title: "Детский пилатес — первый класс",
    titleEn: "Kids Pilates — First Class",
    description:
      "Первое занятие детского пилатеса в студии Gaya (Pattaya Klang) с инструктором Yoyo. Реформер-пилатес для детей 10–15 лет в небольшой группе — всего 7 мест. Нужно согласие родителя. Стоимость — 699 ฿ за ребёнка. Запись через Instagram или Line студии @gayawellnessstudio.",
    descriptionEn:
      "The first kids' Pilates class at Gaya studio (Pattaya Klang) with instructor Yoyo. Reformer Pilates for ages 10–15 in a small group — only 7 spots. Parental consent required. 699 ฿ per child. Book via the studio's Instagram or Line @gayawellnessstudio.",
    startDate: new Date("2026-07-18T08:00:00Z"),
    endDate: new Date("2026-07-18T09:00:00Z"),
    // Ages 10–15 с постера
    minAgeMonths: 120,
    maxAgeMonths: 180,
    placeId: gaya.id,
    status: "APPROVED" as const,
    cityId: pattaya.id,
  };
  const gayaKidsPilates = await prisma.event.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "gaya-kids-pilates" } },
    update: gayaKidsPilatesData,
    create: { ...gayaKidsPilatesData, slug: "gaya-kids-pilates" },
  });
  if (workshopCategory) {
    await prisma.eventCategoryLink.upsert({
      where: {
        eventId_categoryId: {
          eventId: gayaKidsPilates.id,
          categoryId: workshopCategory.id,
        },
      },
      update: {},
      create: { eventId: gayaKidsPilates.id, categoryId: workshopCategory.id },
    });
  }

  // РЕАЛЬНОЕ СОБЫТИЕ (идущее): Kicks & Fun — World Football Playground.
  // Источник (2026-07-16): афиша Instagram @terminal21pattaya (полная, 4
  // активности + механика купонов) + инсайд Вероники с визита (роспись фигурок/
  // холстов, +50฿ за 3D, участие без чека от 50฿ — этого в афише нет). Дата
  // начала 14.07 подтверждена (пост «2 дня назад»), конец 20.07 — ongoing.
  // Возраст не указан → null («для всех»). Обложки нет: постер ТЦ — чужие права.
  const kicksFunData = {
    title: "Футбольная игровая «Kicks & Fun»",
    titleEn: "Kicks & Fun — World Football Playground",
    description:
      "Футбольная игровая ко времени чемпионата мира на первом этаже Terminal 21 Pattaya (зона Paris, под Эйфелевой башней). Активности для всей семьи: «Kicks & Hit» — игра на меткость с мячом (за лучший счёт — приз), «Jump for Joy» — прыжки и ловкость, и творческие DIY — распиши свою футбольную футболку и свой мяч, а также фигурки и холсты (краски, кисть и вода включены; за 3D-гипсовую фигурку — доплата 50 ฿). Идёт с 14 по 20 июля, ежедневно 11:00–20:00. Как участвовать: покупка от 1000 ฿ в любом магазине ТЦ даёт 1 бесплатную активность на выбор; можно объединить до двух чеков за день — максимум 2 активности на человека в день. Без чека — участие платное, от 50 ฿.",
    descriptionEn:
      "A World Cup–themed football playground on the ground floor of Terminal 21 Pattaya (the Paris zone, under the Eiffel Tower). Activities for the whole family: “Kicks & Hit” — a football accuracy game (top score wins a prize), “Jump for Joy” — jumping and agility, and creative DIY — paint your own football T-shirt and ball, plus figurines and canvases (paints, brush and water included; a 3D plaster figurine costs an extra 50 ฿). Runs 14–20 July, daily 11:00–20:00. How to join: a purchase of 1,000 ฿+ at any mall shop earns 1 free activity of your choice; you can combine up to two receipts per day — max 2 activities per person per day. Without a receipt, paid entry from 50 ฿.",
    startDate: new Date("2026-07-14T04:00:00Z"),
    endDate: new Date("2026-07-20T13:00:00Z"),
    locationName: "Terminal 21 Pattaya",
    locationNameEn: "Terminal 21 Pattaya",
    address: "G Floor (Paris zone), Terminal 21 Pattaya, Pattaya, Chon Buri",
    sourceType: "ADMIN" as const,
    status: "APPROVED" as const,
    cityId: pattaya.id,
  };
  const kicksFun = await prisma.event.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "terminal21-kicks-and-fun-2026" } },
    update: kicksFunData,
    create: { ...kicksFunData, slug: "terminal21-kicks-and-fun-2026" },
  });
  if (kidsActivityCategory) {
    await prisma.eventCategoryLink.upsert({
      where: {
        eventId_categoryId: {
          eventId: kicksFun.id,
          categoryId: kidsActivityCategory.id,
        },
      },
      update: {},
      create: { eventId: kicksFun.id, categoryId: kidsActivityCategory.id },
    });
  }

  // =========================
  // РЕАЛЬНОЕ МЕСТО: Skippy Land (Lotus's North Pattaya)
  // Источники (2026-07-15): фото Вероники с места (её собственные — права её) +
  // карточка Google Maps. Skippy Land — сеть игровых в гипермаркетах Lotus; в
  // ЭТОМ ТЦ две одинаковые зоны Skippy Land рядом (слева и справа от фудкорта) —
  // заносим ОДНОЙ карточкой (Вероника уточнит на визите, разные ли это места).
  // Внутри каждой: мягкая игровая Kid's Soft Play (вход 60฿, рост 90–135 см,
  // носки) + зал аркадных автоматов и качалок. Уточнить (gaps ведёт): можно ли
  // оставить ребёнка, Wi-Fi/розетки, точный возраст, контакты, точный адрес ТЦ.
  // =========================
  const skippyLandData = {
    // name у Place не переводится (нет nameEn) — название и так латиницей
    name: "Skippy Land (Lotus's North Pattaya)",
    imageUrl: "/images/places/skippy-land.jpg",
    imageRightsNote: "Фото Вероники (визит 2026-07)",
    description:
      "Крытая детская игровая в торговом центре Lotus's North Pattaya (2 этаж, у фудкорта). Здесь две игровые зоны Skippy Land рядом — слева и справа от фудкорта, с чуть разными условиями (сеанс и рост — в ценах ниже). В каждой: мягкая игровая Kid's Soft Play с бассейном из шариков, горками и лазалками (обязательны носки — можно купить на месте) и зал аркадных автоматов и качалок. Есть кондиционер, работает персонал. Пока ребёнок играет, рядом можно закупиться в Lotus's и поесть на фудкорте; неподалёку — крупный международный детский сад.",
    descriptionEn:
      "An indoor kids' play area in Lotus's North Pattaya mall (2nd floor, by the food court). There are two Skippy Land zones side by side — to the left and right of the food court, with slightly different terms (session length and height — in the prices below). Each has a Kid's Soft Play area with a ball pit, slides and climbing frames (socks required — available on site) plus a hall of arcade machines and coin-op rides. Air-conditioned, with staff on site. While your child plays you can shop at Lotus's and grab a bite at the food court nearby; a large international kindergarten is close by.",
    address:
      "Lotus's North Pattaya (2nd floor), Muang Pattaya, Bang Lamung District, Chon Buri 20150",
    latitude: 12.9508423,
    longitude: 100.8933732,
    googleMapsUrl:
      "https://www.google.com/maps/place/Lotus's+North+Pattaya/@12.9508423,100.8918368,528m/data=!3m1!1e3!4m9!1m2!2m1!1ssoft+play!3m5!1s0x3102bfb3a6501d63:0x4dad9ccd9cbf816f!8m2!3d12.9508423!4d100.8933732!16s%2Fg%2F11hd_yk9xg",
    indoor: true,
    outdoor: false,
    hasAirCon: true, // термометр 23°C на фото — помещение кондиционировано
    hasParking: true, // парковка торгового центра (подтверждено Вероникой)
    canLeaveChild: false, // с каждым ребёнком нужен сопровождающий (от 18 лет)
    animalContact: false,
    // условия по фото Вероники (таблички у автоматов оплаты): рост, сеансы,
    // сопровождающий, сдача, компенсация. Сами цифры — в placeEntryPrice ниже.
    entryPriceNote:
      "В ТЦ две зоны Skippy Land рядом с чуть разными условиями: у фудкорта — сеанс 60 минут (ребёнок 100 ฿, сопровождающий 50 ฿, рост 85–135 см); вторая — сеанс 40 минут (60 ฿, рост 90–135 см). С каждым ребёнком нужен один взрослый (от 18 лет). Автомат оплаты сдачу не даёт. При травме центр компенсирует лечение до 10 000 ฿.",
    entryPriceNoteEn:
      "Two Skippy Land zones sit side by side in the mall with slightly different terms: by the food court — a 60-minute session (child 100 ฿, accompanying adult 50 ฿, height 85–135 cm); the other — a 40-minute session (60 ฿, height 90–135 cm). Each child needs one adult (18+). The payment machine gives no change. In case of injury the venue covers treatment up to 10,000 ฿.",
    status: "APPROVED" as const,
    cityId: pattaya.id,
  };
  const skippyLand = await prisma.place.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "skippy-land-lotus-north" } },
    update: skippyLandData,
    create: { ...skippyLandData, slug: "skippy-land-lotus-north" },
  });

  // Категория: крытая игровая
  {
    const indoorCategory = await prisma.category.findUnique({
      where: { slug: "indoor-playground" },
    });
    if (indoorCategory) {
      await prisma.placeCategory.upsert({
        where: {
          placeId_categoryId: { placeId: skippyLand.id, categoryId: indoorCategory.id },
        },
        update: {},
        create: { placeId: skippyLand.id, categoryId: indoorCategory.id },
      });
    }
  }

  // Часы (таблички Skippy Land): будни 14:00–22:00, выходные 10:00–22:00. На
  // табличках время зависит от возраста ребёнка (тайский закон об игровых) —
  // берём максимальный интервал работы места, нюанс возрастов — в описании.
  await prisma.placeSchedule.deleteMany({ where: { placeId: skippyLand.id } });
  await prisma.placeSchedule.createMany({
    data: [
      ...(["MON", "TUE", "WED", "THU", "FRI"] as const).map((day) => ({
        placeId: skippyLand.id,
        day,
        openTime: "14:00",
        closeTime: "22:00",
        isClosed: false,
      })),
      ...(["SAT", "SUN"] as const).map((day) => ({
        placeId: skippyLand.id,
        day,
        openTime: "10:00",
        closeTime: "22:00",
        isClosed: false,
      })),
    ],
  });

  // Цены входа (таблички у автоматов оплаты, фото Вероники): две зоны с
  // разными сеансами. Ростовые/сеансовые нюансы — в entryPriceNote выше.
  await prisma.placeEntryPrice.deleteMany({ where: { placeId: skippyLand.id } });
  await prisma.placeEntryPrice.createMany({
    data: [
      {
        placeId: skippyLand.id,
        label: "Зона у фудкорта · сеанс 60 мин",
        labelEn: "By the food court · 60 min session",
        childPrice: 100,
        adultPrice: 50,
        order: 1,
      },
      {
        placeId: skippyLand.id,
        label: "Вторая зона · сеанс 40 мин",
        labelEn: "Second zone · 40 min session",
        childPrice: 60,
        // сопровождающий у второй зоны на табличке отдельно не указан
        adultPrice: null,
        order: 2,
      },
    ],
  });

  // «Полезно знать»: носки (обязательны в мягкой игровой)
  await prisma.placeTip.deleteMany({ where: { placeId: skippyLand.id } });
  await prisma.placeTip.create({
    data: {
      placeId: skippyLand.id,
      topic: "socks",
      text: "В мягкую игровую Kid's Soft Play пускают только в носках — нужны и детям, и взрослым. Можно купить на месте (антискользящие, разных цветов).",
      textEn:
        "The Kid's Soft Play area requires socks — for both kids and adults. They're available on site (non-slip, various colours).",
      order: 1,
    },
  });

  // Мини-галерея (фото Вероники с места)
  await prisma.placePhoto.deleteMany({ where: { placeId: skippyLand.id } });
  await prisma.placePhoto.createMany({
    data: [
      {
        placeId: skippyLand.id,
        url: "/images/places/skippy-land-softplay.jpg",
        caption: "Мягкая игровая Kid's Soft Play",
        order: 1,
        source: "OWN" as const,
        rightsNote: "Фото Вероники (визит 2026-07)",
      },
      {
        placeId: skippyLand.id,
        url: "/images/places/skippy-land-play.jpg",
        caption: "Бассейн с шариками и горки",
        order: 2,
        source: "OWN" as const,
        rightsNote: "Фото Вероники (визит 2026-07)",
      },
    ],
  });

  // =========================
  // РЕАЛЬНОЕ МЕСТО: Winter Wonderland Pattaya (крытый парк снега и льда)
  // Источник (2026-07): визит Вероники + официальный сайт wwlandpattaya.com
  // (цены/что входит), фото её (права её). Открылось в начале июля 2026.
  // «Спрятаться от жары» по-крупному: внутри −10 °C. Билет на весь день,
  // касса до 17:00 (нюанс — в «полезно знать»). Ребёнка одного не оставляют.
  // =========================
  const winterWonderlandData = {
    name: "Winter Wonderland Pattaya",
    imageUrl: "/images/places/winter-wonderland.jpg",
    imageRightsNote: "Фото Вероники (визит 2026-07)",
    description:
      "Крытый парк снега и льда в районе Na Jomtien — способ спрятаться от тропической жары по-крупному: внутри держат −10 °C, пока на улице +32 °C. Под одной крышей две зоны. Снежная — с настоящим рыхлым снегом: большие снеговики, ледяные горки со спуском на надувном круге, детский снежный городок с деревянными горками и голографическое северное сияние на 360°. Ледяная — с фигурами и мебелью изо льда, декорациями-городами и крытым искусственным склоном. Тёплую куртку с капюшоном и сапоги выдают по билету; перчатки берут свои или покупают на кассе. Билет не ограничен по времени — можно прийти к открытию и остаться на весь день. Внутри есть еда. Ребёнка одного не оставляют — с каждым нужен сопровождающий взрослый.",
    descriptionEn:
      "An indoor snow-and-ice park in the Na Jomtien area — a big-scale way to escape the tropical heat: it's kept at −10 °C inside while it's +32 °C outdoors. Two zones under one roof. The snow zone has real powdery snow: giant snowmen, ice slides you ride down on a rubber ring, a kids' snow village with wooden slides and a 360° holographic aurora. The ice zone has ice sculptures and furniture, city-skyline sets and a covered artificial ski slope. A warm hooded jacket and boots come with the ticket; bring your own gloves or buy them at the desk. The ticket has no time limit — you can arrive at opening and stay all day. There's food inside. Children aren't left on their own — each child needs an accompanying adult.",
    address: "Na Jomtien, near Pattaya Floating Market, Chon Buri 20150",
    latitude: 12.8671072,
    longitude: 100.9043178,
    googleMapsUrl:
      "https://www.google.com/maps/place/Winter+Wonderland+Pattaya/@12.8671124,100.9017429,1057m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3102957cbde5dd6b:0x8f7b0cca921ee3ea!8m2!3d12.8671072!4d100.9043178!16s%2Fg%2F11nq8_nb0c",
    indoor: true,
    outdoor: false,
    hasFood: true, // еда внутри (подтверждено Вероникой)
    hasCafeSeating: true, // зоны кафе со столиками (подтверждено Вероникой)
    hasAirCon: true, // −10 °C: климат-помещение → попадает в «Спрятаться от жары»
    hasParking: true, // на фото фасада — своя площадка-парковка у входа
    canLeaveChild: false, // ребёнка одного не оставляют, нужен взрослый (Вероника)
    // hasWifi / hasPowerOutlets не проверяли — остаются «уточняется» (null)
    animalContact: false,
    // билеты — в структурной секции «Цены» (placeEntryPrice ниже); здесь
    // примечание с ростовыми порогами, льготами и что входит в стоимость
    entryPriceNote:
      "Детский билет — рост от 90 см, взрослый — от 130 см. Дети ростом до 90 см проходят бесплатно, гостям старше 60 лет — скидка 50 %. В стоимость входят тёплая куртка с капюшоном и сапоги; перчатки берут свои или покупают на кассе. Билет действует весь день — по времени не ограничен.",
    entryPriceNoteEn:
      "Child ticket — from 90 cm tall, adult — from 130 cm. Children under 90 cm enter free, visitors over 60 get 50% off. A warm hooded jacket and boots are included; bring your own gloves or buy them at the desk. The ticket is valid all day — no time limit.",
    status: "APPROVED" as const,
    cityId: pattaya.id,
  };
  const winterWonderland = await prisma.place.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "winter-wonderland" } },
    update: winterWonderlandData,
    create: { ...winterWonderlandData, slug: "winter-wonderland" },
  });

  // Категория: крытая игровая
  {
    const indoorCategory = await prisma.category.findUnique({
      where: { slug: "indoor-playground" },
    });
    if (indoorCategory) {
      await prisma.placeCategory.upsert({
        where: {
          placeId_categoryId: {
            placeId: winterWonderland.id,
            categoryId: indoorCategory.id,
          },
        },
        update: {},
        create: { placeId: winterWonderland.id, categoryId: indoorCategory.id },
      });
    }
  }

  // Часы: центр 09:00–18:00 все дни (нюанс «касса до 17:00» — в «полезно знать»)
  await prisma.placeSchedule.deleteMany({ where: { placeId: winterWonderland.id } });
  await prisma.placeSchedule.createMany({
    data: (["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const).map((day) => ({
      placeId: winterWonderland.id,
      day,
      openTime: "09:00",
      closeTime: "18:00",
      isClosed: false,
    })),
  });

  // Цены входа: билет по росту (детский/взрослый). Льготы и что входит —
  // в entryPriceNote (поле места выше), чтобы секция «Цены» была полной.
  await prisma.placeEntryPrice.deleteMany({ where: { placeId: winterWonderland.id } });
  await prisma.placeEntryPrice.create({
    data: {
      placeId: winterWonderland.id,
      label: "Входной билет",
      labelEn: "Admission",
      childPrice: 699,
      adultPrice: 899,
      order: 1,
    },
  });

  // «Полезно знать»: крайнее время входа и что взять с собой (инсайды).
  // Цены не дублируем — они в структурной секции «Цены» выше.
  await prisma.placeTip.deleteMany({ where: { placeId: winterWonderland.id } });
  await prisma.placeTip.createMany({
    data: [
      {
        placeId: winterWonderland.id,
        topic: "hours",
        text: "Центр работает до 18:00, но касса закрывается в 17:00. На картах и в контактах иногда указано «до 18:00» — ориентируйтесь на 17:00 как крайнее время входа.",
        textEn:
          "The park stays open until 18:00, but the ticket desk closes at 17:00. Maps and listings sometimes show '18:00' — treat 17:00 as the latest entry time.",
        order: 1,
      },
      {
        placeId: winterWonderland.id,
        topic: "what-to-bring",
        text: "Что взять с собой: сменные штаны ребёнку (от игр в снегу быстро промокают) и лёгкий шарф или тонкую шапку — капюшоны у выданных курток тёплые, но объёмные. Вязаные перчатки от долгой игры в снегу тоже промокают, пригодится запасная пара.",
        textEn:
          "What to bring: a change of trousers for your child (snow play soaks them fast) and a light scarf or thin hat — the jacket hoods are warm but bulky. Knitted gloves get wet during long snow play, so a spare pair helps.",
        order: 2,
      },
    ],
  });

  // Галерея: обложка — imageUrl отдельно; здесь остальные кадры визита
  await prisma.placePhoto.deleteMany({ where: { placeId: winterWonderland.id } });
  await prisma.placePhoto.createMany({
    data: [
      {
        placeId: winterWonderland.id,
        url: "/images/places/winter-wonderland-2.jpg",
        caption: "Снежная зона: снеговики и настоящий снег",
        order: 1,
        source: "OWN" as const,
        rightsNote: "Фото Вероники (визит 2026-07)",
      },
      {
        placeId: winterWonderland.id,
        url: "/images/places/winter-wonderland-3.jpg",
        caption: "Снежный городок с деревянными горками",
        order: 2,
        source: "OWN" as const,
        rightsNote: "Фото Вероники (визит 2026-07)",
      },
      {
        placeId: winterWonderland.id,
        url: "/images/places/winter-wonderland-4.jpg",
        caption: "Ледяная зона с фигурами и подсветкой",
        order: 3,
        source: "OWN" as const,
        rightsNote: "Фото Вероники (визит 2026-07)",
      },
      {
        placeId: winterWonderland.id,
        url: "/images/places/winter-wonderland-5.jpg",
        caption: "Мебель и скульптуры изо льда",
        order: 4,
        source: "OWN" as const,
        rightsNote: "Фото Вероники (визит 2026-07)",
      },
    ],
  });

  // =========================
  // РЕАЛЬНАЯ РАЗВИВАШКА (первая безместная): Tara Tots Playgroup
  // Источник (2026-07-16): афиша Instagram @tpis_pattaya + фото Вероники с
  // визита (права её). Регулярная плейгруппа на базе международной школы Tara
  // Pattana — у школы нет своей карточки-места, поэтому занятие с текстовым
  // venueName (кейс п.9). Возраст 0–3 года — подтверждён Вероникой лично
  // (была с дочкой на этих занятиях; в афише возраст не указан).
  // =========================
  const taraTotsOld = await prisma.placeProgram.findMany({
    where: { slug: "tara-tots-playgroup" },
    select: { id: true },
  });
  await prisma.programActivityCategory.deleteMany({
    where: { programId: { in: taraTotsOld.map((p) => p.id) } },
  });
  await prisma.placeProgram.deleteMany({ where: { slug: "tara-tots-playgroup" } });
  const taraTots = await prisma.placeProgram.create({
    data: {
      slug: "tara-tots-playgroup",
      imageUrl: "/images/activities/tara-tots.jpg",
      type: "COURSE",
      name: "Плейгруппа Tara Tots",
      nameEn: "Tara Tots Playgroup",
      description:
        "Утренняя развивающая плейгруппа для малышей на базе международной школы Tara Pattana. Свободная игра, сенсорные активности, музыка и раннее развитие в спокойной безопасной среде — а родители тем временем общаются друг с другом. Занятия по понедельникам, средам и пятницам, 9:30–11:30. Запись: Admissions@tpis.ac.th, 062 620 6888.",
      descriptionEn:
        "A morning playgroup for little ones at Tara Pattana International School. Free play, sensory activities, music and early learning in a calm, safe environment — while parents connect with one another. Every Monday, Wednesday and Friday, 9:30–11:30. To join: Admissions@tpis.ac.th, 062 620 6888.",
      price: 250,
      currency: "THB",
      priceUnit: "за ребёнка и взрослого",
      priceUnitEn: "per child + adult",
      // 0–3 года — подтверждено Вероникой лично (была с дочкой), не из афиши
      minAgeMonths: 0,
      maxAgeMonths: 36,
      venueName: "Tara Pattana International School Thailand",
      cityId: pattaya.id,
      order: 5,
    },
  });
  const earlyDevForTaraTots = await prisma.activityCategory.findUnique({
    where: { slug: "early-development" },
  });
  if (earlyDevForTaraTots) {
    await prisma.programActivityCategory.create({
      data: { programId: taraTots.id, categoryId: earlyDevForTaraTots.id },
    });
  }

  // =========================
  // [ДЕМО] РАЗВИВАШКА В САДУ — занятие БЕЗ каталожного места (п.9 финал).
  // Показывает, как выглядит развивашка на базе сада (у сада нет своей страницы):
  // место проведения — текстом (venueName/venueAddress), город задан явно (cityId).
  // Реальный образец теперь выше (Tara Tots) — демо оставлено для наглядности.
  // =========================
  const demoKgOld = await prisma.placeProgram.findMany({
    where: { slug: "demo-kindergarten-class" },
    select: { id: true },
  });
  await prisma.programActivityCategory.deleteMany({
    where: { programId: { in: demoKgOld.map((p) => p.id) } },
  });
  await prisma.placeProgram.deleteMany({ where: { slug: "demo-kindergarten-class" } });
  const demoKgProgram = await prisma.placeProgram.create({
    data: {
      slug: "demo-kindergarten-class",
      imageUrl: "/images/places/sample.svg",
      type: "COURSE",
      name: "[Демо] Раннее развитие в саду «Солнышко»",
      description:
        "Демонстрация: занятие на базе детского сада, у которого нет своей страницы места. Место проведения показано текстом, без ссылки.",
      price: 350,
      currency: "THB",
      priceUnit: "за занятие",
      minAgeMonths: 12,
      maxAgeMonths: 48,
      venueName: "Детский сад «Солнышко»",
      venueAddress: "Демо-адрес, Северная Паттайя",
      cityId: pattaya.id,
      isDemo: true,
      order: 10,
    },
  });
  const earlyDevForDemo = await prisma.activityCategory.findUnique({
    where: { slug: "early-development" },
  });
  if (earlyDevForDemo) {
    await prisma.programActivityCategory.create({
      data: { programId: demoKgProgram.id, categoryId: earlyDevForDemo.id },
    });
  }

  // =========================
  // 9. [DEMO] UPCOMING EVENT
  // =========================
  const upcomingWorkshopEvent = await prisma.event.upsert({
    where: {
      cityId_slug: { cityId: pattaya.id, slug: "kids-art-workshop-pattaya-upcoming" },
    },
    update: {
      title: "[Демо] Детский арт-мастер-класс",
      imageUrl: "/images/events/demo-event-1.jpg",
      description: "Демонстрационное событие (тестовые данные для разработки).",
      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 2),
      minAgeMonths: 36,
      maxAgeMonths: 72,
      locationName: "Central Festival Pattaya",
      address: "Central Festival Pattaya Beach, Pattaya",
      status: "APPROVED",
      isAnonymous: true,
      isDemo: true,
    },
    create: {
      title: "[Демо] Детский арт-мастер-класс",
      slug: "kids-art-workshop-pattaya-upcoming",
      imageUrl: "/images/events/demo-event-1.jpg",
      cityId: pattaya.id,
      description: "Демонстрационное событие (тестовые данные для разработки).",
      minAgeMonths: 36,
      maxAgeMonths: 72,
      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 2),
      locationName: "Central Festival Pattaya",
      address: "Central Festival Pattaya Beach, Pattaya",
      status: "APPROVED",
      isAnonymous: true,
      isDemo: true,
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
      imageUrl: "/images/events/demo-event-2.jpg",
      description: "Демонстрационное событие: проверка статуса «Сейчас идёт».",
      startDate: new Date(now.getTime() - 1000 * 60 * 60),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 3),
      locationName: "Terminal 21 Pattaya",
      address: "Terminal 21, Pattaya",
      status: "APPROVED",
      isAnonymous: true,
      isDemo: true,
    },
    create: {
      title: "[Демо] Игровая зона выходного дня",
      imageUrl: "/images/events/demo-event-2.jpg",
      slug: "weekend-kids-play-zone-ongoing",
      cityId: pattaya.id,
      description: "Демонстрационное событие: проверка статуса «Сейчас идёт».",
      startDate: new Date(now.getTime() - 1000 * 60 * 60),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 3),
      locationName: "Terminal 21 Pattaya",
      address: "Terminal 21, Pattaya",
      status: "APPROVED",
      isAnonymous: true,
      isDemo: true,
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
      imageUrl: "/images/events/demo-event-3.jpg",
      description: "Демонстрационное событие: проверка прошедших событий.",
      startDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10),
      endDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 9),
      locationName: "City Park Pattaya",
      address: "Pattaya City Park",
      status: "APPROVED",
      isAnonymous: true,
      isDemo: true,
    },
    create: {
      title: "[Демо] Детский фестиваль (прошедший)",
      imageUrl: "/images/events/demo-event-3.jpg",
      slug: "kids-festival-pattaya-past",
      cityId: pattaya.id,
      description: "Демонстрационное событие: проверка прошедших событий.",
      startDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10),
      endDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 9),
      locationName: "City Park Pattaya",
      address: "Pattaya City Park",
      status: "APPROVED",
      isAnonymous: true,
      isDemo: true,
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
      imageUrl: "/images/events/demo-event-4.jpg",
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
      isDemo: true,
    },
    create: {
      title: "[Демо] Мастер-класс выходного дня",
      imageUrl: "/images/events/demo-event-4.jpg",
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
      isDemo: true,
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
