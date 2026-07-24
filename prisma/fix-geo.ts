import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Точечный занос координат для единой карты: `npx tsx prisma/fix-geo.ts`.
 *
 * Закрывает гео-пробелы существующих записей (сверка 2026-07-24):
 *  - событие Kicks & Fun и демо-события — координаты площадок;
 *  - занятие Tara Tots (и демо-сад) — координаты текстовой площадки
 *    (новые поля venueLatitude/venueLongitude — перед запуском нужен db push).
 *
 * Источник координат — OpenStreetMap (Nominatim/Photon), 2026-07-24.
 * Идемпотентен: обновляет по slug, повторный запуск ничего не ломает.
 * Порядок на проде: 1) npx prisma db push  2) npx tsx prisma/fix-geo.ts
 */

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const EVENT_GEO: Array<{ slug: string; latitude: number; longitude: number }> = [
  // Terminal 21 Pattaya
  { slug: "terminal21-kicks-and-fun-2026", latitude: 12.9498756, longitude: 100.8897673 },
  {
    slug: "weekend-kids-play-zone-ongoing",
    latitude: 12.9498756,
    longitude: 100.8897673,
  },
  // Central Pattaya (Beach Road), центр комплекса
  { slug: "kids-art-workshop-pattaya-upcoming", latitude: 12.9343, longitude: 100.8838 },
  // городской парк Паттайи (สวนสาธารณะเมืองพัทยา)
  { slug: "kids-festival-pattaya-past", latitude: 12.8854685, longitude: 100.9221101 },
];

const PROGRAM_GEO: Array<{
  slug: string;
  venueAddress?: string;
  venueLatitude: number;
  venueLongitude: number;
}> = [
  {
    slug: "tara-tots-playgroup",
    venueAddress: "Phatthanakan Road, Huai Yai, Bang Lamung, Chonburi 20150",
    venueLatitude: 12.9065872,
    venueLongitude: 100.9245352,
  },
  {
    slug: "demo-kindergarten-class",
    venueLatitude: 12.966,
    venueLongitude: 100.9,
  },
];

async function main(): Promise<void> {
  for (const { slug, ...geo } of EVENT_GEO) {
    const updated = await prisma.event.updateMany({ where: { slug }, data: geo });
    console.log(
      updated.count > 0
        ? `✓ событие ${slug}: ${geo.latitude}, ${geo.longitude}`
        : `— событие ${slug} не найдено (пропущено)`,
    );
  }

  for (const { slug, ...geo } of PROGRAM_GEO) {
    const updated = await prisma.placeProgram.updateMany({ where: { slug }, data: geo });
    console.log(
      updated.count > 0
        ? `✓ занятие ${slug}: ${geo.venueLatitude}, ${geo.venueLongitude}`
        : `— занятие ${slug} не найдено (пропущено)`,
    );
  }

  await prisma.$disconnect();
  await pool.end();
}

void main();
