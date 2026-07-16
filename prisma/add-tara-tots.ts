/**
 * Точечный занос ОДНОГО занятия: Плейгруппа Tara Tots (регулярная развивашка
 * на базе международной школы Tara Pattana — безместное занятие с venueName).
 * Только upsert этой записи — остальное не трогает. Новых колонок не требует
 * (venueName/возраст занятия уже в main), поэтому db push НЕ нужен.
 * Запуск: npx tsx --env-file=.env prisma/add-tara-tots.ts
 * После успеха файл можно удалить (данные уже в seed.ts как истина).
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

  // идемпотентно: чистим прежнюю версию (связи категорий → саму программу)
  const old = await prisma.placeProgram.findMany({
    where: { slug: "tara-tots-playgroup" },
    select: { id: true },
  });
  await prisma.programActivityCategory.deleteMany({
    where: { programId: { in: old.map((p) => p.id) } },
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

  const earlyDev = await prisma.activityCategory.findUnique({
    where: { slug: "early-development" },
  });
  if (earlyDev) {
    await prisma.programActivityCategory.create({
      data: { programId: taraTots.id, categoryId: earlyDev.id },
    });
  }

  console.log(`✓ Занятие: ${taraTots.name} (${taraTots.slug}), возраст 0–3 года`);
  console.log("\nГотово. Открой на проде: /ru/pattaya/activities/tara-tots-playgroup");
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
