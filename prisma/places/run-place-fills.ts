/**
 * Общий занос наполнения карточек (PlaceFill): описание RU/EN, «Полезно знать»,
 * часы, признаки, категории, цены, контакты, обложка и галерея.
 * Работает только с уже существующими местами по slug; статус не меняет.
 *
 * Заполняет только пустое (src/lib/import/place-fill.ts). Всё, что уже сделано
 * в админке, остаётся — в отчёте это видно как «оставлено». Повторный запуск
 * ничего не меняет. Dry-run по умолчанию, запись — только с --write.
 */
import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { planContactSync } from "../../src/lib/import/contact-sync";
import {
  FILL_FLAGS,
  isEmptyPlan,
  planPlaceFill,
  validatePlaceFill,
  type FillFlag,
  type PlaceFill,
} from "../../src/lib/import/place-fill";

export type PlaceFillRunOptions = {
  /// места, которые этот же запуск создаёт черновиками: в проверке без записи
  /// их в базе ещё нет — это не ошибка
  createdInSameRun?: ReadonlySet<string>;
};

export async function runPlaceFills(
  fills: readonly PlaceFill[],
  options: PlaceFillRunOptions = {},
): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const write = process.argv.includes("--write");
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    await fillPlaces(prisma, fills, write, options.createdInSameRun ?? new Set());
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

async function fillPlaces(
  prisma: PrismaClient,
  fills: readonly PlaceFill[],
  write: boolean,
  createdInSameRun: ReadonlySet<string>,
): Promise<void> {
  const problems = fills.flatMap(validatePlaceFill);
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

  for (const fill of fills) {
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
            photos: true,
          },
        },
      },
    });
    if (!place) {
      if (!write && createdInSameRun.has(fill.slug)) {
        touched += 1;
        console.log(
          `· ${fill.slug}: место создаётся этим же запуском — наполнится при записи`,
        );
        continue;
      }
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
        imageUrl: place.imageUrl,
        photoCount: place._count.photos,
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
    if (plan.cover) {
      parts.push("обложка");
    }
    if (plan.photos) {
      parts.push(`галерея: ${fill.photos?.length ?? 0} фото`);
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
      if (plan.cover && fill.cover) {
        data.imageUrl = fill.cover.url;
        data.imageRightsNote = fill.cover.rightsNote;
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

      if (plan.photos) {
        await tx.placePhoto.createMany({
          data: (fill.photos ?? []).map((photo, index) => ({
            placeId: place.id,
            url: photo.url,
            caption: photo.caption,
            order: index + 1,
            source: "OWN" as const,
            rightsNote: fill.photoRightsNote ?? null,
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
    `\nИтого: ${write ? "записано" : "будет записано"} ${touched}, без изменений ${unchanged}, не найдено ${missing}, всего в партии ${fills.length}.`,
  );
  if (!write) {
    console.log("Ничего не записано. Для записи добавьте --write.");
  }
}
