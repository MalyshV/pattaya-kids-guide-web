/**
 * Новые категории занятий (решение 21.10.2026): «Единоборства», «Спортивные
 * секции», «Языки», «Роботы и код» — с en/th. Заводит их в справочник и
 * проставляет занятиям, у которых категории ещё нет: черновикам сбора 21.10
 * (их categorySlug) и четырём ранним черновикам из отбора Overture. Занятия с
 * уже выбранной категорией не трогает. Идемпотентно. По умолчанию — проверка
 * без записи.
 *   npx tsx --env-file=.env prisma/add-activity-categories-2026-10.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/add-activity-categories-2026-10.ts --write   # записать
 * После заноса файл можно удалить.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { HARVEST_2026_10_PROGRAMS } from "./programs/harvest-2026-10";
import { HARVEST_2026_10_PROGRAMS_B } from "./programs/harvest-2026-10-b";

const NEW_CATEGORIES = [
  {
    slug: "martial-arts",
    name: "Единоборства",
    nameEn: "Martial arts",
    nameTh: "ศิลปะการต่อสู้",
    order: 9,
  },
  {
    slug: "sport",
    name: "Спортивные секции",
    nameEn: "Sports clubs",
    nameTh: "ชมรมกีฬา",
    order: 10,
  },
  { slug: "languages", name: "Языки", nameEn: "Languages", nameTh: "ภาษา", order: 11 },
  {
    slug: "robotics",
    name: "Роботы и код",
    nameEn: "Robotics & coding",
    nameTh: "หุ่นยนต์และโค้ดดิ้ง",
    order: 12,
  },
] as const;

const NEW_SLUGS = new Set<string>(NEW_CATEGORIES.map((category) => category.slug));

/** Ранние черновики (отбор Overture), которым категории тогда не нашлось. */
const EARLIER: Record<string, string> = {
  "rsr-pattaya-taekwondo": "martial-arts",
  "rsr-grand-taekwondo": "martial-arts",
  "pattaya-city-football-academy": "sport",
  "sharks-basketball-academy-pattaya": "sport",
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const write = process.argv.includes("--write");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log(write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)");

  const categoryIds = new Map<string, string>();
  for (const category of NEW_CATEGORIES) {
    const existing = await prisma.activityCategory.findUnique({
      where: { slug: category.slug },
      select: { id: true },
    });
    if (existing) {
      categoryIds.set(category.slug, existing.id);
      console.log(`= категория «${category.name}» уже есть`);
    } else if (write) {
      const created = await prisma.activityCategory.create({ data: category });
      categoryIds.set(category.slug, created.id);
      console.log(
        `+ категория «${category.name}» / ${category.nameEn} / ${category.nameTh}`,
      );
    } else {
      console.log(
        `+ завёл бы категорию «${category.name}» / ${category.nameEn} / ${category.nameTh}`,
      );
    }
  }

  const wanted = new Map<string, string>(Object.entries(EARLIER));
  for (const draft of [...HARVEST_2026_10_PROGRAMS, ...HARVEST_2026_10_PROGRAMS_B]) {
    if (draft.categorySlug && NEW_SLUGS.has(draft.categorySlug)) {
      wanted.set(draft.slug, draft.categorySlug);
    }
  }

  let linked = 0;
  let skipped = 0;
  for (const [programSlug, categorySlug] of wanted) {
    const program = await prisma.placeProgram.findUnique({
      where: { slug: programSlug },
      select: { id: true, name: true, _count: { select: { categories: true } } },
    });
    if (!program) {
      skipped += 1;
      console.log(`— нет занятия ${programSlug}`);
      continue;
    }
    if (program._count.categories > 0) {
      skipped += 1;
      console.log(`— «${program.name}»: категория уже выбрана, не трогаю`);
      continue;
    }
    const categoryId = categoryIds.get(categorySlug);
    if (write && categoryId) {
      await prisma.programActivityCategory.create({
        data: { programId: program.id, categoryId },
      });
    }
    linked += 1;
    console.log(`${write ? "+" : "+ поставил бы"} «${program.name}» → ${categorySlug}`);
  }

  console.log(
    `\nИтого: ${write ? "проставлено" : "будет проставлено"} ${linked}, пропущено ${skipped}.`,
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
