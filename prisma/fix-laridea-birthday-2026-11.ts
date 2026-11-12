/**
 * LariDea: новый пакет дня рождения (пост в Instagram 22.09.2026).
 *
 * Вместо трёх мартовских пакетов — один на 3 часа: 1 280 ฿ за ребёнка,
 * минимум 10 детей, НДС 7% и сбор персоналу сверху. Скрипт догоняет
 * прод-базу: текст блока «День рождения» на трёх языках и минимум гостей.
 * seed.ts и thai-content.json уже исправлены (prisma/places/laridea-birthday.ts).
 *
 * Поле меняется, только если в нём сейчас прежний текст — до или после
 * правки НДС (fix-laridea-vat-2026-11.ts), запускать можно в любом порядке.
 * Правку из админки скрипт не трогает и сообщает о ней. Повторный запуск
 * ничего не меняет.
 *
 * По умолчанию — проверка без записи (dry-run). Запись — только с --write:
 *   npx tsx --env-file=.env prisma/fix-laridea-birthday-2026-11.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/fix-laridea-birthday-2026-11.ts --write   # записать
 * После записи — «Обновить кэш» в админке.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { planKnownText } from "../src/lib/import/known-text";
import { LARIDEA_BIRTHDAY, LARIDEA_BIRTHDAY_PREVIOUS } from "./places/laridea-birthday";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const write = process.argv.includes("--write");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const TEXT_FIELDS = ["notes", "notesEn", "notesTh"] as const;

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
  const info = place.birthdayInfo;
  if (!info) {
    console.log("– у LariDea нет блока «День рождения» — пропуск");
    return;
  }

  const data: { notes?: string; notesEn?: string; notesTh?: string; minGuests?: number } =
    {};
  for (const field of TEXT_FIELDS) {
    const plan = planKnownText(
      info[field],
      LARIDEA_BIRTHDAY_PREVIOUS[field],
      LARIDEA_BIRTHDAY[field],
    );
    if (plan.action === "set") {
      data[field] = plan.value;
      console.log(`${write ? "✓" : "·"} ${field}: «${plan.value.slice(0, 60)}…»`);
    } else if (plan.action === "same") {
      console.log(`= ${field}: уже новый пакет`);
    } else {
      console.log(`! ${field}: текст в базе другой (правили в админке?) — не трогаю`);
    }
  }

  const previousMin: readonly number[] = LARIDEA_BIRTHDAY_PREVIOUS.minGuests;
  if (info.minGuests === LARIDEA_BIRTHDAY.minGuests) {
    console.log(`= minGuests: уже ${LARIDEA_BIRTHDAY.minGuests}`);
  } else if (info.minGuests === null || previousMin.includes(info.minGuests)) {
    data.minGuests = LARIDEA_BIRTHDAY.minGuests;
    console.log(
      `${write ? "✓" : "·"} minGuests: ${info.minGuests ?? "пусто"} → ${LARIDEA_BIRTHDAY.minGuests}`,
    );
  } else {
    console.log(`! minGuests: в базе ${info.minGuests} (правили в админке?) — не трогаю`);
  }

  const total = Object.keys(data).length;
  if (write && total > 0) {
    await prisma.placeBirthdayInfo.update({ where: { placeId: place.id }, data });
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
