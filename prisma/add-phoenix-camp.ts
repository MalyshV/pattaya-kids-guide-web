/**
 * Точечный занос ОДНОГО лагеря: Октябрьский лагерь в Phoenix Wittaya School
 * (1–30 октября 2026, безместное занятие — как Tara Tots). Только эта запись
 * с её таблицей групп — остальное не трогает. Новых колонок не требует, поэтому
 * db push НЕ нужен. Повторный запуск безопасен (запись пересоздаётся).
 *
 * Запуск (после мержа PR — чтобы на сайте уже была обложка):
 *   npx tsx prisma/add-phoenix-camp.ts
 * Потом в админке «Обновить кэш».
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import {
  PHOENIX_CAMP_SLUG,
  upsertPhoenixOctoberCamp,
} from "./programs/phoenix-october-camp";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main(): Promise<void> {
  const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
  if (!pattaya) {
    throw new Error("Город pattaya не найден — сначала общий seed");
  }
  const { classes } = await upsertPhoenixOctoberCamp(prisma, pattaya.id);
  console.log(`✓ Лагерь Phoenix School: ${classes} строк в таблице групп и цен`);
  console.log(`\nГотово. Открой на проде: /ru/pattaya/activities/${PHOENIX_CAMP_SLUG}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
