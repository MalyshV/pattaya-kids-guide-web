/**
 * Тайские переводы КОНТЕНТА (фаза 3). Единый источник — prisma/thai-content.json
 * (переведён и верифицирован нативным воркфлоу). Этот модуль накладывает Th-поля
 * на уже существующие записи по устойчивым ключам (slug / диапазон возраста /
 * код языка / точный оригинал label|text|schedule). Идемпотентно: повторный
 * запуск просто перезапишет те же значения.
 *
 * Два способа запуска:
 *  - из seed.ts:  await applyThaiTranslations(prisma)  (после основного наполнения)
 *  - на проде:    npx tsx --env-file=.env prisma/apply-thai.ts
 *
 * Названия-бренды мест НЕ переводятся (остаются латиницей) — им Th не даём,
 * витрина честно падает на латинское имя (см. lib/i18n/localize).
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { PrismaClient } from "@prisma/client";

type Ref = { slug?: string; code?: string; minAge?: number; maxAge?: number; th: string };
type KeyedTh = { label?: string; text?: string; th: string };
type PlaceTr = {
  slug: string;
  descriptionTh: string | null;
  entryPriceNoteTh: string | null;
  tips: Array<{ text: string; th: string }>;
  entryPrices: Array<{ label: string; th: string }>;
  birthdayNotesTh: string | null;
};
type ClassTr = {
  ageLabel: string;
  ageLabelTh: string;
  schedule: string;
  scheduleTh: string;
};
type ProgramTr = {
  matchKey: string;
  nameTh: string | null;
  descriptionTh: string | null;
  priceUnitTh: string | null;
  classes: ClassTr[];
};
type EventTr = {
  slug: string;
  titleTh: string | null;
  descriptionTh: string | null;
  locationNameTh: string | null;
};
type ThaiContent = {
  reference: {
    eventCategories: Ref[];
    placeCategories: Ref[];
    activityCategories: Ref[];
    ageGroups: Ref[];
    languages: Ref[];
    amenities: Ref[];
  };
  places: PlaceTr[];
  programs: ProgramTr[];
  events: EventTr[];
};

function loadContent(): ThaiContent {
  const here = dirname(fileURLToPath(import.meta.url));
  return JSON.parse(readFileSync(join(here, "thai-content.json"), "utf8")) as ThaiContent;
}

export async function applyThaiTranslations(prisma: PrismaClient): Promise<void> {
  const data = loadContent();
  let missing = 0;

  // --- справочники (по slug / коду / диапазону) ---
  for (const c of data.reference.eventCategories) {
    await prisma.eventCategory.updateMany({
      where: { slug: c.slug },
      data: { nameTh: c.th },
    });
  }
  for (const c of data.reference.placeCategories) {
    await prisma.category.updateMany({ where: { slug: c.slug }, data: { nameTh: c.th } });
  }
  for (const c of data.reference.activityCategories) {
    await prisma.activityCategory.updateMany({
      where: { slug: c.slug },
      data: { nameTh: c.th },
    });
  }
  for (const g of data.reference.ageGroups) {
    await prisma.ageGroup.updateMany({
      where: { minAge: g.minAge, maxAge: g.maxAge },
      data: { nameTh: g.th },
    });
  }
  for (const l of data.reference.languages) {
    await prisma.language.updateMany({ where: { code: l.code }, data: { nameTh: l.th } });
  }
  for (const a of data.reference.amenities) {
    await prisma.amenity.updateMany({ where: { slug: a.slug }, data: { nameTh: a.th } });
  }

  // --- места (+ вложенные tips / entryPrices / birthdayInfo) ---
  for (const p of data.places) {
    const place = await prisma.place.findFirst({ where: { slug: p.slug } });
    if (!place) {
      console.warn(`⚠️  место не найдено: ${p.slug}`);
      missing += 1;
      continue;
    }
    await prisma.place.update({
      where: { id: place.id },
      data: { descriptionTh: p.descriptionTh, entryPriceNoteTh: p.entryPriceNoteTh },
    });
    for (const tip of p.tips) {
      await prisma.placeTip.updateMany({
        where: { placeId: place.id, text: tip.text },
        data: { textTh: tip.th },
      });
    }
    for (const ep of p.entryPrices) {
      await prisma.placeEntryPrice.updateMany({
        where: { placeId: place.id, label: ep.label },
        data: { labelTh: ep.th },
      });
    }
    if (p.birthdayNotesTh) {
      await prisma.placeBirthdayInfo.updateMany({
        where: { placeId: place.id },
        data: { notesTh: p.birthdayNotesTh },
      });
    }
  }

  // --- программы занятий (по slug или точному имени) + классы ---
  for (const pr of data.programs) {
    const program = await prisma.placeProgram.findFirst({
      where: { OR: [{ slug: pr.matchKey }, { name: pr.matchKey }] },
    });
    if (!program) {
      console.warn(`⚠️  программа не найдена: ${pr.matchKey}`);
      missing += 1;
      continue;
    }
    await prisma.placeProgram.update({
      where: { id: program.id },
      data: {
        nameTh: pr.nameTh,
        descriptionTh: pr.descriptionTh,
        priceUnitTh: pr.priceUnitTh,
      },
    });
    for (const cls of pr.classes) {
      await prisma.placeClass.updateMany({
        where: { programId: program.id, ageLabel: cls.ageLabel, schedule: cls.schedule },
        data: { ageLabelTh: cls.ageLabelTh, scheduleTh: cls.scheduleTh },
      });
    }
  }

  // --- события (по slug) ---
  for (const e of data.events) {
    const res = await prisma.event.updateMany({
      where: { slug: e.slug },
      data: {
        titleTh: e.titleTh,
        descriptionTh: e.descriptionTh,
        locationNameTh: e.locationNameTh,
      },
    });
    if (res.count === 0) {
      console.warn(`⚠️  событие не найдено: ${e.slug}`);
      missing += 1;
    }
  }

  const counts = data.places.length + data.programs.length + data.events.length;
  console.log(
    `🇹🇭 Тайский контент наложен: ${counts} сущностей (места/занятия/события) + справочники` +
      (missing ? `, не найдено: ${missing}` : ""),
  );
}

// Прямой запуск на проде (не при импорте из seed): создаём своё соединение.
const invokedDirectly = process.argv[1]
  ?.replace(/\\/g, "/")
  .endsWith("prisma/apply-thai.ts");
if (invokedDirectly) {
  const run = async (): Promise<void> => {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined");
    }
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const pg = (await import("pg")).default;
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
    try {
      await applyThaiTranslations(prisma);
      console.log("\nПроверь на проде: /th/pattaya");
    } finally {
      await prisma.$disconnect();
    }
  };
  run().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
