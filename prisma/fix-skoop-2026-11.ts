/**
 * Skoop Beach Café: ваучер на входе и новая обложка (12.11.2026).
 *
 * Партию «из личных альбомов» могли уже занести (add-albums-2026-11.ts), а
 * наполнение заполняет только пустое — поэтому дополнение догоняет базу
 * отдельно. Текст и обложка — в prisma/places/albums-2026-11.ts.
 * - совет про ваучер добавляется в конец «Полезно знать», если его ещё нет;
 * - строка цены «ваучер 100 ฿» — только если у места нет ни одной цены;
 * - обложка меняется, только если там прежняя (или пусто): фото, загруженное
 *   в админке, скрипт не трогает.
 * Повторный запуск ничего не меняет. Если места ещё нет — сначала
 * add-albums-2026-11.ts: он уже возьмёт новые данные, и этот скрипт не нужен.
 *
 * По умолчанию — проверка без записи (dry-run). Запись — только с --write:
 *   npx tsx --env-file=.env prisma/fix-skoop-2026-11.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/fix-skoop-2026-11.ts --write   # записать
 * После записи — «Обновить кэш» в админке.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import {
  SKOOP_COVER,
  SKOOP_PREVIOUS_COVER_URL,
  SKOOP_VOUCHER_ENTRY,
  SKOOP_VOUCHER_TIP,
} from "./places/albums-2026-11";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const write = process.argv.includes("--write");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main(): Promise<void> {
  console.log(write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)");

  const place = await prisma.place.findFirst({
    where: { slug: "skoop-beach-cafe" },
    include: {
      tips: { select: { text: true, order: true } },
      _count: { select: { entryPrices: true, pricing: true } },
    },
  });
  if (!place) {
    console.log(
      "– Skoop Beach Café ещё нет — запустите add-albums-2026-11.ts, этот скрипт не нужен",
    );
    return;
  }

  const mark = write ? "✓" : "·";
  const addTip = !place.tips.some((tip) => tip.text === SKOOP_VOUCHER_TIP.text);
  console.log(addTip ? `${mark} совет про ваучер` : "= совет про ваучер уже есть");

  const addEntry = place._count.entryPrices === 0 && place._count.pricing === 0;
  console.log(
    addEntry
      ? `${mark} цена: ваучер 100 ฿`
      : "= цены уже заполнены (в админке?) — не трогаю",
  );

  let setCover = false;
  if (place.imageUrl === SKOOP_COVER.url) {
    console.log("= обложка уже новая");
  } else if (place.imageUrl === null || place.imageUrl === SKOOP_PREVIOUS_COVER_URL) {
    setCover = true;
    console.log(`${mark} обложка → ${SKOOP_COVER.url}`);
  } else {
    console.log(`! обложка другая (${place.imageUrl}) — загружена в админке, не трогаю`);
  }

  if (write && (addTip || addEntry || setCover)) {
    await prisma.$transaction(async (tx) => {
      if (addTip) {
        const lastOrder = place.tips.reduce((max, tip) => Math.max(max, tip.order), 0);
        await tx.placeTip.create({
          data: { placeId: place.id, ...SKOOP_VOUCHER_TIP, order: lastOrder + 1 },
        });
      }
      if (addEntry) {
        const { row, note, noteEn } = SKOOP_VOUCHER_ENTRY;
        await tx.placeEntryPrice.create({
          data: {
            placeId: place.id,
            label: row.label,
            labelEn: row.labelEn,
            childPrice: row.child,
            adultPrice: row.adult,
            currency: "THB",
            order: 1,
          },
        });
        await tx.place.update({
          where: { id: place.id },
          data: { entryPriceNote: note, entryPriceNoteEn: noteEn },
        });
      }
      if (setCover) {
        await tx.place.update({
          where: { id: place.id },
          data: { imageUrl: SKOOP_COVER.url, imageRightsNote: SKOOP_COVER.rightsNote },
        });
      }
    });
  }
  if (!write) {
    console.log("\nНичего не записано. Для записи добавьте --write.");
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
