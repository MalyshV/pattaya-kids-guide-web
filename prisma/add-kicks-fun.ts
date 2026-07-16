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
      "Футбольная игровая ко времени чемпионата мира на первом этаже Terminal 21 Pattaya (зона Paris, под Эйфелевой башней). Активности для всей семьи: «Kicks & Hit» — игра на меткость с мячом (за лучший счёт — приз), «Jump for Joy» — прыжки и ловкость, и творческие DIY — распиши свою футбольную футболку и свой мяч, а также фигурки и холсты (краски, кисть и вода включены; за 3D-гипсовую фигурку — доплата 50 ฿). Идёт с 14 по 20 июля, ежедневно 11:00–20:00. Как участвовать: покупка от 1000 ฿ в любом магазине ТЦ даёт 1 бесплатную активность на выбор; можно объединить до двух чеков за день — максимум 2 активности на человека в день. Без чека — участие платное, от 50 ฿.",
    descriptionEn:
      "A World Cup–themed football playground on the ground floor of Terminal 21 Pattaya (the Paris zone, under the Eiffel Tower). Activities for the whole family: “Kicks & Hit” — a football accuracy game (top score wins a prize), “Jump for Joy” — jumping and agility, and creative DIY — paint your own football T-shirt and ball, plus figurines and canvases (paints, brush and water included; a 3D plaster figurine costs an extra 50 ฿). Runs 14–20 July, daily 11:00–20:00. How to join: a purchase of 1,000 ฿+ at any mall shop earns 1 free activity of your choice; you can combine up to two receipts per day — max 2 activities per person per day. Without a receipt, paid entry from 50 ฿.",
    startDate: new Date("2026-07-14T04:00:00Z"),
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
