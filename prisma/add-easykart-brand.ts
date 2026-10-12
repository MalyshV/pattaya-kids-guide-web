/**
 * Точечный занос: сеть Easykart (docs/CHAINS_PLAN.md) — две точки в Паттайе.
 * - заводит бренд easykart (имя + другие написания для поиска);
 * - у двух точек ставит name «Easykart Go-Karting», связь с брендом и метку точки на трёх
 *   языках: на сайте выйдет «Easykart Go-Karting · Bali Hai Pier» / «Easykart Go-Karting · Thepprasit»,
 *   у каждой появится блок «Другие Easykart Go-Karting в Паттайе».
 *   Slug не трогает — ♡/✓ родителей и ссылки в Telegram живут.
 * Меняет ТОЛЬКО эти поля: цены, советы, часы, контакты и остальное не трогает.
 * Идемпотентно.
 *
 * По умолчанию — проверка без записи (dry-run). Запись — только с --write:
 *   npx tsx --env-file=.env prisma/add-easykart-brand.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/add-easykart-brand.ts --write   # записать
 * Потом в админке «Обновить кэш». После заноса файл можно удалить.
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

const BRAND = {
  slug: "easykart",
  name: "Easykart Go-Karting",
  searchAliases: ["Easykart", "EasyKart", "Изикарт", "อีซี่คาร์ท"],
};

const POINTS = [
  {
    slug: "easykart-bali-hai-pier",
    branchLabel: "Bali Hai Pier",
    branchNote: "У пирса Bali Hai, в нескольких шагах от Walking Street",
    branchNoteEn: "By Bali Hai Pier, steps from Walking Street",
  },
  {
    slug: "easykart-thepprasit",
    branchLabel: "Thepprasit",
    branchNote: "На Thepprasit Rd, в центральной части Паттайи",
    branchNoteEn: "On Thepprasit Road in central Pattaya",
  },
] as const;

async function main(): Promise<void> {
  const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
  if (!pattaya) {
    throw new Error("Город pattaya не найден — сначала общий seed");
  }

  console.log(write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)");

  let brandId: string | null = null;
  if (write) {
    const brand = await prisma.brand.upsert({
      where: { slug: BRAND.slug },
      update: { name: BRAND.name, searchAliases: BRAND.searchAliases },
      create: BRAND,
    });
    brandId = brand.id;
  }
  console.log(`${write ? "✓" : "·"} Бренд «${BRAND.name}»`);

  for (const point of POINTS) {
    const place = await prisma.place.findUnique({
      where: { cityId_slug: { cityId: pattaya.id, slug: point.slug } },
      select: { id: true, name: true },
    });
    if (!place) {
      console.log(`⚠ ${point.slug} — не найдено, пропускаю`);
      continue;
    }
    if (write && brandId) {
      await prisma.place.update({
        where: { id: place.id },
        data: {
          name: BRAND.name,
          brandId,
          branchLabel: point.branchLabel,
          branchLabelEn: point.branchLabel,
          branchLabelTh: point.branchLabel,
          branchNote: point.branchNote,
          branchNoteEn: point.branchNoteEn,
        },
      });
    }
    console.log(
      `${write ? "✓" : "·"} «${place.name}» → «${BRAND.name} · ${point.branchLabel}» (${point.slug})`,
    );
  }

  if (!write) {
    console.log("\nНичего не записано. Для записи добавьте --write.");
  } else {
    console.log(
      "\nГотово. В админке — «Обновить кэш». Проверь блок «Другие Easykart Go-Karting в Паттайе».",
    );
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
