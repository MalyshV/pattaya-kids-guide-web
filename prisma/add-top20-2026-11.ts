/**
 * Наполнение двадцати карточек из сбора 21.10 (prisma/places/top20-2026-11.ts):
 * описание RU/EN, «Полезно знать», часы, признаки, категории, цены, контакты.
 * Работает только с уже существующими местами по slug; статус не меняет.
 *
 * Заполняет только пустое (src/lib/import/place-fill.ts): описание заменяется,
 * если там пометка «[черновик]» из сбора; советы, часы, цены и категории
 * пишутся, только если их у места ещё нет; признак ставится, пока он
 * «уточняется». Всё, что уже сделано в админке, остаётся — в отчёте это
 * видно как «оставлено». Повторный запуск ничего не меняет.
 *
 * По умолчанию — проверка без записи (dry-run). Запись — только с --write:
 *   npx tsx --env-file=.env prisma/add-top20-2026-11.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/add-top20-2026-11.ts --write   # записать
 * После записи — «Обновить кэш» в админке.
 */
import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { planContactSync } from "../src/lib/import/contact-sync";
import {
  FILL_FLAGS,
  isEmptyPlan,
  planPlaceFill,
  validatePlaceFill,
  type FillFlag,
} from "../src/lib/import/place-fill";
import { TOP20_2026_11 } from "./places/top20-2026-11";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const write = process.argv.includes("--write");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const problems = TOP20_2026_11.flatMap(validatePlaceFill);
  if (problems.length > 0) {
    throw new Error(`Ошибки в заготовках:\n${problems.join("\n")}`);
  }

  const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
  if (!pattaya) {
    throw new Error("Город pattaya не найден — сначала общий seed");
  }

  const categories = await prisma.category.findMany({ select: { id: true, slug: true } });
  const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  console.log(write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)");

  let touched = 0;
  let unchanged = 0;
  let missing = 0;

  for (const fill of TOP20_2026_11) {
    const place = await prisma.place.findUnique({
      where: { cityId_slug: { cityId: pattaya.id, slug: fill.slug } },
      include: {
        contacts: true,
        _count: {
          select: {
            tips: true,
            schedules: true,
            entryPrices: true,
            pricing: true,
            categories: true,
          },
        },
      },
    });
    if (!place) {
      missing += 1;
      console.log(`— нет места «${fill.slug}»: пропуск`);
      continue;
    }

    const unknownCategories = (fill.categorySlugs ?? []).filter(
      (slug) => !categoryIdBySlug.has(slug),
    );
    if (unknownCategories.length > 0) {
      throw new Error(`${fill.slug}: нет категорий ${unknownCategories.join(", ")}`);
    }

    const flags = Object.fromEntries(
      FILL_FLAGS.map((flag) => [flag, place[flag]]),
    ) as Record<FillFlag, boolean | null>;

    const plan = planPlaceFill(
      {
        description: place.description,
        tipsCount: place._count.tips,
        scheduleCount: place._count.schedules,
        entryPriceCount: place._count.entryPrices,
        pricingCount: place._count.pricing,
        categoryCount: place._count.categories,
        flags,
        leaveChildFromMonths: place.leaveChildFromMonths,
      },
      fill,
    );
    const contactPlan = planContactSync(
      place.contacts.map((c) => ({ id: c.id, type: c.type, value: c.value })),
      fill.contacts ?? [],
      fill.replaceTypes ?? [],
    );
    const contactsChange = contactPlan.create.length > 0 || contactPlan.remove.length > 0;

    const parts: string[] = [];
    if (plan.description) {
      parts.push("описание");
    }
    if (plan.tips) {
      parts.push(`советы: ${fill.tips?.length ?? 0}`);
    }
    if (plan.schedule) {
      parts.push(`часы: ${plan.schedule.length} дн.`);
    }
    const flagNames = Object.keys(plan.flags);
    if (flagNames.length > 0) {
      parts.push(`признаки: ${flagNames.join(", ")}`);
    }
    if (plan.leaveChildFromMonths !== null) {
      parts.push(`можно оставить с ${plan.leaveChildFromMonths} мес.`);
    }
    if (plan.categories) {
      parts.push(`категории: ${(fill.categorySlugs ?? []).join(", ")}`);
    }
    if (plan.free) {
      parts.push("вход бесплатный");
    }
    if (plan.entryRows) {
      parts.push(`цены: ${fill.entryRows?.length ?? 0} стр.`);
    }
    if (contactPlan.create.length > 0) {
      parts.push(`+контакты: ${contactPlan.create.map((c) => c.type).join(", ")}`);
    }
    if (contactPlan.remove.length > 0) {
      parts.push(
        `−контакты: ${contactPlan.remove.map((c) => `${c.type} ${c.value}`).join("; ")}`,
      );
    }
    const kept =
      plan.skipped.length > 0 ? ` (оставлено: ${plan.skipped.join(", ")})` : "";

    if (isEmptyPlan(plan) && !contactsChange) {
      unchanged += 1;
      console.log(`= ${place.name}: без изменений${kept}`);
      continue;
    }
    console.log(`${write ? "✓" : "·"} ${place.name}: ${parts.join(" | ")}${kept}`);
    touched += 1;

    if (!write) {
      continue;
    }

    await prisma.$transaction(async (tx) => {
      const data: Prisma.PlaceUpdateInput = { ...plan.flags };
      if (plan.description) {
        data.description = fill.description;
        data.descriptionEn = fill.descriptionEn;
      }
      if (plan.leaveChildFromMonths !== null) {
        data.leaveChildFromMonths = plan.leaveChildFromMonths;
      }
      if (plan.entryRows) {
        data.entryPriceNote = fill.note ?? null;
        data.entryPriceNoteEn = fill.noteEn ?? null;
      }
      if (Object.keys(data).length > 0) {
        await tx.place.update({ where: { id: place.id }, data });
      }

      if (plan.tips) {
        await tx.placeTip.createMany({
          data: (fill.tips ?? []).map((tip, index) => ({
            placeId: place.id,
            text: tip.text,
            textEn: tip.textEn,
            order: index + 1,
          })),
        });
      }

      if (plan.schedule) {
        await tx.placeSchedule.createMany({
          data: plan.schedule.map((row) => ({ ...row, placeId: place.id })),
        });
      }

      if (plan.categories) {
        await tx.placeCategory.createMany({
          data: (fill.categorySlugs ?? []).map((slug) => ({
            placeId: place.id,
            categoryId: categoryIdBySlug.get(slug) as string,
          })),
        });
      }

      if (plan.free) {
        await tx.placePricing.create({
          data: {
            placeId: place.id,
            priceType: "FREE",
            audience: "GENERAL",
            currency: "THB",
          },
        });
      }

      if (plan.entryRows) {
        await tx.placeEntryPrice.createMany({
          data: (fill.entryRows ?? []).map((row, index) => ({
            placeId: place.id,
            label: row.label,
            labelEn: row.labelEn,
            childPrice: row.child,
            adultPrice: row.adult,
            currency: "THB",
            order: index + 1,
          })),
        });
      }

      if (contactPlan.remove.length > 0) {
        await tx.placeContact.deleteMany({
          where: { id: { in: contactPlan.remove.map((c) => c.id) } },
        });
      }
      if (contactPlan.create.length > 0) {
        const lastOrder = place.contacts.reduce((max, c) => Math.max(max, c.order), 0);
        await tx.placeContact.createMany({
          data: contactPlan.create.map((c, index) => ({
            placeId: place.id,
            type: c.type,
            value: c.value,
            order: lastOrder + index + 1,
          })),
        });
      }
    });
  }

  console.log(
    `\nИтого: ${write ? "записано" : "будет записано"} ${touched}, без изменений ${unchanged}, не найдено ${missing}, всего в партии ${TOP20_2026_11.length}.`,
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
