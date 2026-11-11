/**
 * LariDea: НДС 7% добавляется к ценам сверху (11.11.2026).
 *
 * В карточке стояло «Цены с НДС 7%», но с июля 2026 кафе берёт 7% сверху ко
 * всем ценам — вход, абонементы, дни рождения (объявление в сториз «Prices»
 * их Instagram). Скрипт догоняет прод-базу: подпись под ценами входа и текст
 * пакетов дня рождения на трёх языках. seed.ts и thai-content.json уже
 * исправлены.
 *
 * Текст меняется, только если сейчас в базе стоит прежний (из seed или
 * перевода): правку, сделанную в админке, скрипт не трогает и сообщает о ней.
 * Повторный запуск ничего не меняет.
 *
 * По умолчанию — проверка без записи (dry-run). Запись — только с --write:
 *   npx tsx --env-file=.env prisma/fix-laridea-vat-2026-11.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/fix-laridea-vat-2026-11.ts --write   # записать
 * После записи — «Обновить кэш» в админке.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const write = process.argv.includes("--write");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

type Change = { field: string; from: string; to: string };

const ENTRY_NOTE: readonly Change[] = [
  {
    field: "entryPriceNote",
    from: "В будни при посещении до 15:00 — скидка 10%. Цены с НДС 7%.",
    to: "В будни при посещении до 15:00 — скидка 10%. К ценам добавляется НДС 7%.",
  },
  {
    field: "entryPriceNoteEn",
    from: "10% off on weekdays before 15:00. Prices include 7% VAT.",
    to: "10% off on weekdays before 15:00. 7% VAT is added to the prices.",
  },
  {
    field: "entryPriceNoteTh",
    from: "วันธรรมดาหากเข้าใช้บริการก่อน 15:00 ลด 10% ราคารวมภาษีมูลค่าเพิ่ม 7% แล้ว",
    to: "วันธรรมดาหากเข้าใช้บริการก่อน 15:00 ลด 10% ราคายังไม่รวมภาษีมูลค่าเพิ่ม 7%",
  },
];

/// у пакетов дня рождения меняется только последняя строка текста
const BIRTHDAY_TAIL: readonly Change[] = [
  {
    field: "notes",
    from: "Депозит 50%, цены включают VAT. Допы: декор, фотограф, шоу.",
    to: "Депозит 50%, к ценам добавляется НДС 7%. Допы: декор — 2 500 ฿, фотограф — 6 000 ฿, шоу фокусов — 6 000 ฿.",
  },
  {
    field: "notesEn",
    from: "50% deposit, prices include VAT. Add-ons: decor, photographer, show.",
    to: "50% deposit; 7% VAT is added to the prices. Add-ons: decorations — 2,500 ฿, photographer — 6,000 ฿, magic show — 6,000 ฿.",
  },
  {
    field: "notesTh",
    from: "มัดจำ 50% ราคารวม VAT แล้ว เพิ่มเติมได้: ตกแต่ง ช่างภาพ โชว์",
    to: "มัดจำ 50% ราคายังไม่รวม VAT 7% เพิ่มเติมได้: ตกแต่ง 2,500 ฿ ช่างภาพ 6,000 ฿ โชว์มายากล 6,000 ฿",
  },
];

/** Новое значение поля или null, если менять нечего / нельзя. */
function nextValue(
  label: string,
  current: string | null,
  change: Change,
  mode: "whole" | "tail",
): string | null {
  const value = current ?? "";
  if (value.includes(change.to)) {
    console.log(`= ${label}: уже исправлено`);
    return null;
  }
  const matches = mode === "whole" ? value === change.from : value.endsWith(change.from);
  if (!matches) {
    console.log(`! ${label}: текст в базе другой (правили в админке?) — не трогаю`);
    return null;
  }
  console.log(`${write ? "✓" : "·"} ${label}: «…${change.to.slice(0, 60)}…»`);
  return mode === "whole"
    ? change.to
    : value.slice(0, value.length - change.from.length) + change.to;
}

async function main(): Promise<void> {
  console.log(write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)");

  const place = await prisma.place.findFirst({
    where: { slug: "laridea" },
    include: { birthdayInfo: true },
  });
  if (!place) {
    console.log("– LariDea не найдено (slug laridea)");
    return;
  }

  const placeData: Record<string, string> = {};
  for (const change of ENTRY_NOTE) {
    const current = place[change.field as "entryPriceNote"];
    const next = nextValue(`цены входа · ${change.field}`, current, change, "whole");
    if (next !== null) {
      placeData[change.field] = next;
    }
  }

  const birthdayData: Record<string, string> = {};
  if (place.birthdayInfo) {
    for (const change of BIRTHDAY_TAIL) {
      const current = place.birthdayInfo[change.field as "notes"];
      const next = nextValue(`день рождения · ${change.field}`, current, change, "tail");
      if (next !== null) {
        birthdayData[change.field] = next;
      }
    }
  } else {
    console.log("– у LariDea нет блока «День рождения» — пропуск");
  }

  const total = Object.keys(placeData).length + Object.keys(birthdayData).length;
  if (write) {
    await prisma.$transaction(async (tx) => {
      if (Object.keys(placeData).length > 0) {
        await tx.place.update({ where: { id: place.id }, data: placeData });
      }
      if (Object.keys(birthdayData).length > 0) {
        await tx.placeBirthdayInfo.update({
          where: { placeId: place.id },
          data: birthdayData,
        });
      }
    });
  }
  console.log(
    `\nИтого: ${write ? "изменено" : "будет изменено"} полей — ${total}.${write ? "" : " Ничего не записано. Для записи добавьте --write."}`,
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
