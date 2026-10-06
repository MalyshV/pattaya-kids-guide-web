/**
 * Точечная правка: часы работы всех зон Skippy Land — 9:30–19:50 каждый день
 * (со слов Вероники, 06.10). Меняет ТОЛЬКО часы этих трёх карточек — цены,
 * советы, фото и остальное не трогает. Новых колонок нет — db push НЕ нужен.
 * Повторный запуск безопасен.
 *
 * Запуск (после мержа PR):
 *   npx tsx prisma/fix-skippy-hours.ts
 * Потом в админке «Обновить кэш».
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { setSkippyHours } from "./places/skippy-land";
import {
  SKIPPY_ESCALATOR_SLUG,
  SKIPPY_FOOD_COURT_SLUG,
} from "./places/skippy-land-lotus-north";
import { SKIPPY_LOTUS_SOUTH_SLUG } from "./places/skippy-land-lotus-south";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const SLUGS = [SKIPPY_FOOD_COURT_SLUG, SKIPPY_ESCALATOR_SLUG, SKIPPY_LOTUS_SOUTH_SLUG];

async function main(): Promise<void> {
  const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
  if (!pattaya) {
    throw new Error("Город pattaya не найден — сначала общий seed");
  }
  for (const slug of SLUGS) {
    const place = await prisma.place.findUnique({
      where: { cityId_slug: { cityId: pattaya.id, slug } },
      select: { id: true, name: true },
    });
    if (!place) {
      console.log(`⚠ ${slug} — не найдено, пропускаю`);
      continue;
    }
    await setSkippyHours(prisma, place.id);
    console.log(`✓ ${place.name}: 9:30–19:50 каждый день`);
  }
  console.log("\nГотово. В админке — «Обновить кэш».");
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
