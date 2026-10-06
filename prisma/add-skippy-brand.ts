/**
 * Точечный занос: сеть Skippy Land (docs/CHAINS_PLAN.md, шаг 1).
 * - заводит бренд skippy-land (имя + написания для поиска);
 * - у трёх зон (Lotus's North у фудкорта и за эскалатором, Lotus's South)
 *   ставит name «Skippy Land», связь с брендом, метку и фразу точки на трёх
 *   языках. Slug не трогает — ♡/✓ родителей и ссылки в Telegram живут.
 * Меняет ТОЛЬКО эти поля: цены, советы, фото, часы и остальное не трогает.
 *
 * ⚠️ Нужны новые колонки: СНАЧАЛА `npx prisma db push`, потом мерж PR, потом
 * этот скрипт. Повторный запуск безопасен.
 *
 * Запуск:
 *   npx tsx prisma/add-skippy-brand.ts
 * Потом в админке «Обновить кэш».
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { upsertSkippyBrand, zoneBrandData } from "./places/skippy-land";
import { LOTUS_NORTH_ZONES } from "./places/skippy-land-lotus-north";
import { LOTUS_SOUTH_ZONES } from "./places/skippy-land-lotus-south";

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

  const brandId = await upsertSkippyBrand(prisma);
  console.log("✓ Бренд Skippy Land заведён");

  for (const zone of [...LOTUS_NORTH_ZONES, ...LOTUS_SOUTH_ZONES]) {
    const place = await prisma.place.findUnique({
      where: { cityId_slug: { cityId: pattaya.id, slug: zone.slug } },
      select: { id: true },
    });
    if (!place) {
      console.log(`⚠ ${zone.slug} — не найдено, пропускаю`);
      continue;
    }
    await prisma.place.update({
      where: { id: place.id },
      data: zoneBrandData(zone, brandId),
    });
    console.log(`✓ ${zone.name} · ${zone.branchLabel} (${zone.slug})`);
  }

  console.log(
    "\nГотово. В админке — «Обновить кэш». Проверь блок «Другие Skippy Land в Паттайе»:",
  );
  for (const zone of [...LOTUS_NORTH_ZONES, ...LOTUS_SOUTH_ZONES]) {
    console.log(`  /ru/pattaya/places/${zone.slug}`);
  }
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
