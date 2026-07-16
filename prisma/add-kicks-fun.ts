/**
 * Точечный занос ОДНОГО события: Kicks & Fun — World Football Playground
 * (идёт в Terminal 21 Pattaya до 20 июля). Только upsert этой записи.
 * Новых колонок не требует — db push НЕ нужен.
 * Запуск: npx tsx --env-file=.env prisma/add-kicks-fun.ts
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
  const kidsActivity = await prisma.eventCategory.findUnique({
    where: { slug: "kids-activity" },
  });

  const data = {
    title: "Футбольная игровая «Kicks & Fun»",
    titleEn: "Kicks & Fun — World Football Playground",
    description:
      "Футбольная игровая ко времени чемпионата мира на первом этаже Terminal 21 Pattaya (зона Paris, под Эйфелевой башней). Игры с футбольными мячами — в одной можно выиграть приз за меткость — и столики для творчества: роспись фигурок и холстов, краски с кистью и водой уже включены (за 3D-гипсовую фигурку — доплата 50 ฿). Идёт до 20 июля, ежедневно 11:00–20:00. Как участвовать: при чеке из любого магазина ТЦ от 1000 ฿ выдают 2 купона на активности; без чека — участие платное, от 50 ฿.",
    descriptionEn:
      "A World Cup–themed football playground on the ground floor of Terminal 21 Pattaya (the Paris zone, under the Eiffel Tower). Football skill games — one with a prize for accuracy — and craft tables: paint figurines and canvases, with paints, brush and water included (a 3D plaster figurine costs an extra 50 ฿). Runs until 20 July, daily 11:00–20:00. How to join: a receipt of 1,000 ฿+ from any mall shop gets you 2 activity coupons; without a receipt, paid entry from 50 ฿.",
    startDate: new Date("2026-07-01T04:00:00Z"),
    endDate: new Date("2026-07-20T13:00:00Z"),
    locationName: "Terminal 21 Pattaya",
    locationNameEn: "Terminal 21 Pattaya",
    address: "G Floor (зона Paris), Terminal 21 Pattaya, Pattaya, Chon Buri",
    sourceType: "ADMIN" as const,
    status: "APPROVED" as const,
    cityId: pattaya.id,
  };
  const kicksFun = await prisma.event.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "terminal21-kicks-and-fun-2026" } },
    update: data,
    create: { ...data, slug: "terminal21-kicks-and-fun-2026" },
  });
  if (kidsActivity) {
    await prisma.eventCategoryLink.upsert({
      where: {
        eventId_categoryId: { eventId: kicksFun.id, categoryId: kidsActivity.id },
      },
      update: {},
      create: { eventId: kicksFun.id, categoryId: kidsActivity.id },
    });
  }

  console.log(`✓ Событие: ${kicksFun.title} (идёт до 20.07.2026)`);
  console.log(
    "\nГотово. Открой на проде: /ru/pattaya/events/terminal21-kicks-and-fun-2026",
  );
  console.log("Оно ongoing → попадёт в Telegram-канал ближайшим прогоном автопоста.");
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
