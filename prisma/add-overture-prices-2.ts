/**
 * Цены и контакты черновиков из отбора Overture (prisma/places/overture-prices-2.ts):
 * таблицы входа (PlaceEntryPrice) + подпись под ними, пометка «вход бесплатный»,
 * контакты (сайт, Facebook, Instagram, LINE…). Черновики остаются скрытыми —
 * статус не меняется. Работает только с уже существующими местами по slug.
 *
 * Идемпотентно: таблица входа перезаписывается целиком, контакты приводятся
 * к списку (тип из replaceTypes заменяется, прочие только пополняются).
 *
 * По умолчанию — проверка без записи (dry-run). Запись — только с --write:
 *   npx tsx --env-file=.env prisma/add-overture-prices-2.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/add-overture-prices-2.ts --write   # записать
 * После успешного заноса файл можно удалить (данные уже в базе).
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { planContactSync } from "../src/lib/import/contact-sync";
import { OVERTURE_PRICES_2 } from "./places/overture-prices-2";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const write = process.argv.includes("--write");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
  if (!pattaya) {
    throw new Error("Город pattaya не найден — сначала общий seed");
  }

  console.log(write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)");

  let touched = 0;
  let missing = 0;

  for (const extras of OVERTURE_PRICES_2) {
    const place = await prisma.place.findUnique({
      where: { cityId_slug: { cityId: pattaya.id, slug: extras.slug } },
      include: { contacts: true },
    });
    if (!place) {
      missing += 1;
      console.log(`— нет места «${extras.slug}»: пропуск`);
      continue;
    }

    const plan = planContactSync(
      place.contacts.map((c) => ({ id: c.id, type: c.type, value: c.value })),
      extras.contacts ?? [],
      extras.replaceTypes ?? [],
    );

    const parts: string[] = [];
    if (extras.free) {
      parts.push("вход бесплатный");
    }
    if (extras.entryRows) {
      parts.push(`цены: ${extras.entryRows.length} стр.`);
    }
    if (plan.create.length > 0) {
      parts.push(`+контакты: ${plan.create.map((c) => c.type).join(", ")}`);
    }
    if (plan.remove.length > 0) {
      parts.push(
        `−контакты: ${plan.remove.map((c) => `${c.type} ${c.value}`).join("; ")}`,
      );
    }
    console.log(
      `${write ? "✓" : "·"} ${place.name}: ${parts.join(" | ") || "без изменений"}`,
    );

    if (!write) {
      touched += 1;
      continue;
    }

    await prisma.$transaction(async (tx) => {
      if (extras.free) {
        await tx.placePricing.deleteMany({ where: { placeId: place.id } });
        await tx.placePricing.create({
          data: {
            placeId: place.id,
            priceType: "FREE",
            audience: "GENERAL",
            currency: "THB",
          },
        });
      }

      if (extras.entryRows) {
        await tx.placeEntryPrice.deleteMany({ where: { placeId: place.id } });
        await tx.placeEntryPrice.createMany({
          data: extras.entryRows.map((row, index) => ({
            placeId: place.id,
            label: row.label,
            labelEn: row.labelEn,
            childPrice: row.child,
            adultPrice: row.adult,
            currency: "THB",
            order: index + 1,
          })),
        });
        await tx.place.update({
          where: { id: place.id },
          data: {
            entryPriceNote: extras.note ?? null,
            entryPriceNoteEn: extras.noteEn ?? null,
          },
        });
      }

      if (plan.remove.length > 0) {
        await tx.placeContact.deleteMany({
          where: { id: { in: plan.remove.map((c) => c.id) } },
        });
      }
      if (plan.create.length > 0) {
        const lastOrder = place.contacts.reduce((max, c) => Math.max(max, c.order), 0);
        await tx.placeContact.createMany({
          data: plan.create.map((c, index) => ({
            placeId: place.id,
            type: c.type,
            value: c.value,
            order: lastOrder + index + 1,
          })),
        });
      }
    });
    touched += 1;
  }

  console.log(
    `\nИтого: ${write ? "обработано" : "будет обработано"} ${touched}, не найдено ${missing}, всего в партии ${OVERTURE_PRICES_2.length}.`,
  );
  if (!write) {
    console.log("Ничего не записано. Для записи добавьте --write.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
