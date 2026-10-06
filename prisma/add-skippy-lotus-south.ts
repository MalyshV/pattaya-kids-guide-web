/**
 * Точечный занос: Skippy Land в Lotus's South Pattaya (одна новая карточка).
 * Только эта запись — остальное, в том числе обе зоны Lotus's North, не трогает.
 * Новых колонок не требует — db push НЕ нужен. Повторный запуск безопасен.
 *
 * Запуск (после мержа PR — чтобы на сайте уже были фото):
 *   npx tsx prisma/add-skippy-lotus-south.ts
 * Потом в админке «Обновить кэш».
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import {
  SKIPPY_LOTUS_SOUTH_SLUG,
  upsertSkippyLandLotusSouth,
} from "./places/skippy-land-lotus-south";

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
  await upsertSkippyLandLotusSouth(prisma, pattaya.id);
  console.log("✓ Skippy Land · Lotus's South добавлен");
  console.log(`\nГотово. Открой на проде: /ru/pattaya/places/${SKIPPY_LOTUS_SOUTH_SLUG}`);
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
