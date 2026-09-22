import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Точечные правки данных мест (21.09.2026): `npx tsx prisma/fix-place-data-2026-09.ts`.
 *
 *  - Winter Wonderland: адрес по карточке Google Карт — Na Jomtien относится к
 *    району Sattahip, индекс 20250 (стоял паттайский 20150);
 *  - LariDea: ссылка «Facebook» вела в группу, а не на страницу кафе —
 *    правильная facebook.com/LariDea (так ссылается их сайт laridea.co.th).
 *
 * seed.ts уже исправлен (PR #78); этот скрипт догоняет прод-базу. Идемпотентен:
 * обновляет по slug, повторный запуск ничего не ломает. db push не нужен.
 * После запуска — «Обновить кэш» в админке, чтобы сайт показал новое сразу.
 */

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const WINTER_WONDERLAND_ADDRESS =
  "226 Moo 1, Na Jomtien, Sattahip District, Chon Buri 20250 (near Pattaya Floating Market)";
const LARIDEA_FACEBOOK = "https://www.facebook.com/LariDea";

async function main(): Promise<void> {
  const address = await prisma.place.updateMany({
    where: { slug: "winter-wonderland" },
    data: { address: WINTER_WONDERLAND_ADDRESS },
  });
  console.log(
    address.count > 0
      ? `✓ Winter Wonderland: адрес → ${WINTER_WONDERLAND_ADDRESS}`
      : "– Winter Wonderland не найден (slug winter-wonderland)",
  );

  const laridea = await prisma.place.findFirst({ where: { slug: "laridea" } });
  if (!laridea) {
    console.log("– LariDea не найдено (slug laridea)");
    return;
  }
  const facebook = await prisma.placeContact.updateMany({
    where: { placeId: laridea.id, type: "facebook" },
    data: { value: LARIDEA_FACEBOOK },
  });
  console.log(
    facebook.count > 0
      ? `✓ LariDea: Facebook → ${LARIDEA_FACEBOOK}`
      : "– у LariDea нет контакта facebook — ничего не меняла",
  );
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
