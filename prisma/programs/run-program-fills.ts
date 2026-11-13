/**
 * Общий занос наполнения карточек занятий (ProgramFill): название EN/TH,
 * описание RU/EN/TH, «Полезно знать», возраст, цена, таблица групп,
 * категории, обложка и галерея. Работает только с уже существующими
 * занятиями по slug; статус не меняет.
 *
 * Заполняет только пустое (src/lib/import/program-fill.ts). Всё, что уже
 * сделано в админке, остаётся — в отчёте это видно как «оставлено». Повторный
 * запуск ничего не меняет. Dry-run по умолчанию, запись — только с --write.
 */
import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import {
  isEmptyProgramPlan,
  planProgramFill,
  validateProgramFill,
  type ProgramFill,
} from "../../src/lib/import/program-fill";

export async function runProgramFills(fills: readonly ProgramFill[]): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const problems = fills.flatMap(validateProgramFill);
  if (problems.length > 0) {
    throw new Error(`Ошибки в заготовках:\n${problems.join("\n")}`);
  }
  const write = process.argv.includes("--write");
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    await fillPrograms(prisma, fills, write);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

async function fillPrograms(
  prisma: PrismaClient,
  fills: readonly ProgramFill[],
  write: boolean,
): Promise<void> {
  const categories = await prisma.activityCategory.findMany({
    select: { id: true, slug: true },
  });
  const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  const unknown = fills.flatMap((fill) =>
    (fill.categorySlugs ?? [])
      .filter((slug) => !categoryIdBySlug.has(slug))
      .map((slug) => `${fill.slug}: ${slug}`),
  );
  if (unknown.length > 0) {
    throw new Error(`Нет категорий занятий в справочнике:\n${unknown.join("\n")}`);
  }

  console.log(write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)");

  let touched = 0;
  let unchanged = 0;
  let missing = 0;

  for (const fill of fills) {
    const program = await prisma.placeProgram.findUnique({
      where: { slug: fill.slug },
      include: {
        _count: { select: { tips: true, classes: true, categories: true, photos: true } },
      },
    });
    if (!program) {
      missing += 1;
      console.log(`— нет занятия «${fill.slug}»: пропуск`);
      continue;
    }

    const plan = planProgramFill(
      {
        description: program.description,
        nameEn: program.nameEn,
        nameTh: program.nameTh,
        tipsCount: program._count.tips,
        classCount: program._count.classes,
        categoryCount: program._count.categories,
        photoCount: program._count.photos,
        price: program.price,
        minAgeMonths: program.minAgeMonths,
        maxAgeMonths: program.maxAgeMonths,
        imageUrl: program.imageUrl,
      },
      fill,
    );

    const parts: string[] = [];
    if (plan.description) {
      parts.push("описание");
    }
    if (plan.nameEn || plan.nameTh) {
      parts.push("название");
    }
    if (plan.tips) {
      parts.push(`советы: ${fill.tips?.length ?? 0}`);
    }
    if (plan.age) {
      parts.push("возраст");
    }
    if (plan.price) {
      parts.push(`цена: ${fill.price} ฿ ${fill.priceUnit ?? ""}`.trim());
    }
    if (plan.classes) {
      parts.push(`группы: ${fill.classes?.length ?? 0}`);
    }
    if (plan.categories) {
      parts.push(`категории: ${(fill.categorySlugs ?? []).join(", ")}`);
    }
    if (plan.cover) {
      parts.push("обложка");
    }
    if (plan.photos) {
      parts.push(`галерея: ${fill.photos?.length ?? 0} фото`);
    }
    const kept =
      plan.skipped.length > 0 ? ` (оставлено: ${plan.skipped.join(", ")})` : "";

    if (isEmptyProgramPlan(plan)) {
      unchanged += 1;
      console.log(`= ${program.name}: без изменений${kept}`);
      continue;
    }
    console.log(`${write ? "✓" : "·"} ${program.name}: ${parts.join(" | ")}${kept}`);
    touched += 1;

    if (!write) {
      continue;
    }

    await prisma.$transaction(async (tx) => {
      const data: Prisma.PlaceProgramUpdateInput = {};
      if (plan.description) {
        data.description = fill.description;
        data.descriptionEn = fill.descriptionEn;
        data.descriptionTh = fill.descriptionTh ?? null;
      }
      if (plan.nameEn) {
        data.nameEn = fill.nameEn;
      }
      if (plan.nameTh) {
        data.nameTh = fill.nameTh;
      }
      if (plan.age) {
        data.minAgeMonths = fill.minAgeMonths ?? null;
        data.maxAgeMonths = fill.maxAgeMonths ?? null;
      }
      if (plan.price) {
        data.price = fill.price;
        data.priceUnit = fill.priceUnit ?? null;
        data.priceUnitEn = fill.priceUnitEn ?? null;
        data.priceUnitTh = fill.priceUnitTh ?? null;
      }
      if (plan.cover) {
        data.imageUrl = fill.cover;
      }
      if (Object.keys(data).length > 0) {
        await tx.placeProgram.update({ where: { id: program.id }, data });
      }

      if (plan.tips) {
        await tx.programTip.createMany({
          data: (fill.tips ?? []).map((tip, index) => ({
            programId: program.id,
            text: tip.text,
            textEn: tip.textEn,
            textTh: tip.textTh ?? null,
            order: index + 1,
          })),
        });
      }

      if (plan.classes) {
        await tx.placeClass.createMany({
          data: (fill.classes ?? []).map((cls, index) => ({
            programId: program.id,
            name: cls.name,
            nameEn: cls.nameEn ?? null,
            nameTh: cls.nameTh ?? null,
            ageLabel: cls.ageLabel,
            ageLabelEn: cls.ageLabelEn ?? null,
            ageLabelTh: cls.ageLabelTh ?? null,
            minAgeMonths: cls.minAgeMonths,
            maxAgeMonths: cls.maxAgeMonths,
            parentRequired: cls.parentRequired,
            schedule: cls.schedule,
            scheduleEn: cls.scheduleEn ?? null,
            scheduleTh: cls.scheduleTh ?? null,
            order: index + 1,
          })),
        });
      }

      if (plan.categories) {
        await tx.programActivityCategory.createMany({
          data: (fill.categorySlugs ?? []).map((slug) => ({
            programId: program.id,
            categoryId: categoryIdBySlug.get(slug) as string,
          })),
        });
      }

      if (plan.photos) {
        await tx.programPhoto.createMany({
          data: (fill.photos ?? []).map((photo, index) => ({
            programId: program.id,
            url: photo.url,
            caption: photo.caption,
            order: index + 1,
            source: fill.photoSource ?? "OWN",
            rightsNote: fill.photoRightsNote ?? null,
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
