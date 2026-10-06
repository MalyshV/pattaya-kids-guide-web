/**
 * Точечный занос: Skippy Land в Lotus's North — делим одну карточку на ДВЕ зоны.
 * - зона у фудкорта остаётся на старом адресе skippy-land-lotus-north
 *   (ссылки и ♡/✓ родителей не ломаются), условия — только её;
 * - зона за эскалатором — новая карточка skippy-land-lotus-north-escalator.
 * Часы обеих зон снимаются (на сайте «уточняется», `npm run gaps` напомнит).
 *
 * ⚠️ У зоны у фудкорта пересоздаются цены, советы, фото галереи и контакт —
 * правки этих блоков через админку, если были, перезапишутся данными модуля.
 *
 * Новых колонок не требует — db push НЕ нужен. Повторный запуск безопасен.
 *
 * Запуск (после мержа PR — чтобы на сайте уже были фото):
 *   npx tsx prisma/add-skippy-split.ts
 * Потом в админке «Обновить кэш».
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import {
  SKIPPY_ESCALATOR_SLUG,
  SKIPPY_FOOD_COURT_SLUG,
  upsertSkippyLandLotusNorth,
} from "./places/skippy-land-lotus-north";

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
  await upsertSkippyLandLotusNorth(prisma, pattaya.id);
  console.log("✓ Skippy Land: зона у фудкорта обновлена, зона за эскалатором добавлена");
  console.log("\nГотово. Открой на проде:");
  console.log(`  /ru/pattaya/places/${SKIPPY_FOOD_COURT_SLUG}`);
  console.log(`  /ru/pattaya/places/${SKIPPY_ESCALATOR_SLUG}`);
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
