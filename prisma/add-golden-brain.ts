/**
 * Точечный занос ОДНОГО занятия: ментальная арифметика Golden Brain, филиал
 * North Pattaya (безместное занятие — как Tara Tots и Phoenix). Только эта
 * запись с таблицей групп и «Полезно знать» — остальное не трогает.
 * Повторный запуск безопасен (запись пересоздаётся).
 *
 * Нужны новые колонки PlaceClass.nameEn/nameTh, поэтому порядок такой:
 *   1) до мержа, с ветки PR: npx prisma db push
 *   2) мерж PR (Vercel задеплоит обложку и код)
 *   3) npx tsx prisma/add-golden-brain.ts
 * Потом в админке «Обновить кэш».
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import {
  GOLDEN_BRAIN_SLUG,
  upsertGoldenBrainNorthPattaya,
} from "./programs/golden-brain-north-pattaya";

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
  const { classes, tips } = await upsertGoldenBrainNorthPattaya(prisma, pattaya.id);
  console.log(`✓ Golden Brain North Pattaya: ${classes} строки групп, ${tips} совета`);
  console.log(`\nГотово. Открой на проде: /ru/pattaya/activities/${GOLDEN_BRAIN_SLUG}`);
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
