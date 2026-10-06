/**
 * Точечная правка: тайское имя города Паттайя — «พัทยา» (City.nameTh).
 * Без него th-страницы показывали английское «Pattaya» в заголовках
 * («Skippy Land สาขาอื่นใน Pattaya», шапка города). Меняет только nameTh
 * (и nameEn, если вдруг пусто). Новых колонок нет — db push НЕ нужен.
 * Повторный запуск безопасен.
 *
 * Запуск:
 *   npx tsx prisma/fix-city-names.ts
 * Потом в админке «Обновить кэш».
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const CITY_NAMES: Record<string, { nameEn: string; nameTh: string }> = {
  pattaya: { nameEn: "Pattaya", nameTh: "พัทยา" },
};

async function main(): Promise<void> {
  for (const [slug, names] of Object.entries(CITY_NAMES)) {
    const city = await prisma.city.findFirst({ where: { slug } });
    if (!city) {
      console.log(`⚠ город ${slug} не найден, пропускаю`);
      continue;
    }
    await prisma.city.update({
      where: { id: city.id },
      data: { nameTh: names.nameTh, nameEn: city.nameEn ?? names.nameEn },
    });
    console.log(`✓ ${city.name}: nameTh = ${names.nameTh}`);
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
