/**
 * Точечный занос НОВЫХ мест: Gaya Wellness Studio (+событие «Детский пилатес»)
 * и Skippy Land (Lotus's North Pattaya). Только upsert этих записей — другие
 * места/события не трогает, поэтому безопасно на проде, даже если что-то
 * правилось через /admin. Идемпотентно (повторный запуск не создаёт дублей).
 * Запуск: npx tsx --env-file=.env prisma/add-new-places.ts
 * После успешного заноса файл можно удалить (данные уже в seed.ts как истина).
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
  if (!pattaya) {
    throw new Error("Город pattaya не найден — сначала общий seed");
  }

  // ===== Gaya Wellness Studio + событие «Детский пилатес» =====
  const gayaData = {
    name: "Gaya Wellness Studio",
    description:
      "Студия пилатеса на реформерах в центре Паттайи (район Pattaya Klang). Летом 2026 студия запустила детское направление — Kids Pilates для детей 10–15 лет: занятия на профессиональном оборудовании небольшими группами, с инструктором. Запись через Instagram или Line студии.",
    descriptionEn:
      "A reformer Pilates studio in central Pattaya (Pattaya Klang). In summer 2026 the studio launched a kids' program — Kids Pilates for ages 10–15: small-group sessions on professional equipment with an instructor. Book via the studio's Instagram or Line.",
    address: "512/10 Moo 9, Pattaya City, Bang Lamung District, Chon Buri 20150",
    latitude: 12.9328173,
    longitude: 100.8973319,
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
  const ageGroup10to15 = await prisma.ageGroup.upsert({
    where: { minAge_maxAge: { minAge: 10, maxAge: 15 } },
    update: { name: "10–15 лет", nameEn: "10–15 years" },
    create: { name: "10–15 лет", nameEn: "10–15 years", minAge: 10, maxAge: 15 },
  });
  await prisma.placeAgeGroup.upsert({
    where: { placeId_ageGroupId: { placeId: gaya.id, ageGroupId: ageGroup10to15.id } },
    update: {},
    create: { placeId: gaya.id, ageGroupId: ageGroup10to15.id },
  });
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
  const workshopCategory = await prisma.eventCategory.findUnique({
    where: { slug: "workshop" },
  });
  const gayaKidsPilatesData = {
    title: "Детский пилатес — первый класс",
    titleEn: "Kids Pilates — First Class",
    description:
      "Первое занятие детского пилатеса в студии Gaya (Pattaya Klang) с инструктором Yoyo. Реформер-пилатес для детей 10–15 лет в небольшой группе — всего 7 мест. Нужно согласие родителя. Стоимость — 699 ฿ за ребёнка. Запись через Instagram или Line студии @gayawellnessstudio.",
    descriptionEn:
      "The first kids' Pilates class at Gaya studio (Pattaya Klang) with instructor Yoyo. Reformer Pilates for ages 10–15 in a small group — only 7 spots. Parental consent required. 699 ฿ per child. Book via the studio's Instagram or Line @gayawellnessstudio.",
    startDate: new Date("2026-07-18T08:00:00Z"),
    endDate: new Date("2026-07-18T09:00:00Z"),
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
  console.log(`✓ Gaya Wellness Studio + событие «Детский пилатес» (18.07.2026)`);

  // ===== Skippy Land (Lotus's North Pattaya) =====
  const skippyLandData = {
    // name у Place не переводится (нет nameEn) — название и так латиницей
    name: "Skippy Land (Lotus's North Pattaya)",
    imageUrl: "/images/places/skippy-land.jpg",
    imageRightsNote: "Фото Вероники (визит 2026-07)",
    description:
      "Крытая детская игровая в торговом центре Lotus's North Pattaya (2 этаж, у фудкорта). Здесь две игровые зоны Skippy Land рядом — слева и справа от фудкорта. В каждой: мягкая игровая Kid's Soft Play с бассейном из шариков, горками и лазалками (вход 60 ฿, рост 90–135 см, обязательны носки — можно купить на месте) и зал аркадных автоматов и качалок. Есть кондиционер, работает персонал. Пока ребёнок играет, рядом можно закупиться в Lotus's и поесть на фудкорте; неподалёку — крупный международный детский сад.",
    descriptionEn:
      "An indoor kids' play area in Lotus's North Pattaya mall (2nd floor, by the food court). There are two Skippy Land zones side by side — to the left and right of the food court. Each has a Kid's Soft Play area with a ball pit, slides and climbing frames (entry 60 ฿, height 90–135 cm, socks required — available on site) plus a hall of arcade machines and coin-op rides. Air-conditioned, with staff on site. While your child plays you can shop at Lotus's and grab a bite at the food court nearby; a large international kindergarten is close by.",
    address:
      "Lotus's North Pattaya (2 этаж), Muang Pattaya, Bang Lamung District, Chon Buri 20150",
    latitude: 12.9508423,
    longitude: 100.8933732,
    googleMapsUrl:
      "https://www.google.com/maps/place/Lotus's+North+Pattaya/@12.9508423,100.8918368,528m/data=!3m1!1e3!4m9!1m2!2m1!1ssoft+play!3m5!1s0x3102bfb3a6501d63:0x4dad9ccd9cbf816f!8m2!3d12.9508423!4d100.8933732!16s%2Fg%2F11hd_yk9xg",
    indoor: true,
    outdoor: false,
    hasAirCon: true,
    hasParking: true,
    animalContact: false,
    status: "APPROVED" as const,
    cityId: pattaya.id,
  };
  const skippyLand = await prisma.place.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "skippy-land-lotus-north" } },
    update: skippyLandData,
    create: { ...skippyLandData, slug: "skippy-land-lotus-north" },
  });
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
  console.log(`✓ Skippy Land (Lotus's North Pattaya)`);

  console.log("\nГотово. Проверь на проде:");
  console.log("  /ru/pattaya/places/gaya-wellness-studio");
  console.log("  /ru/pattaya/places/skippy-land-lotus-north");
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
