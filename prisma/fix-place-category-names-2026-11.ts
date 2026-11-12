/**
 * Названия двух категорий мест (12.11.2026).
 *
 * «Cafe with Kids Zone» и «Waterpark» появились в прод-базе при сборе
 * 21.10 без русских и тайских названий — и так видны в строке «Тип места» и
 * в чипах на странице места. Скрипт даёт им названия на трёх языках и место в
 * строке (после «Игровой площадки»). seed.ts и thai-content.json уже
 * исправлены.
 *
 * «Кафе с детским уголком» — обычное кафе с уголком, где дети рисуют и
 * играют, пока родители едят или пьют кофе; не полноценное детское кафе.
 *
 * Категорию, которой нет в базе, скрипт не создаёт — только сообщает о ней.
 * Повторный запуск ничего не меняет.
 *
 * По умолчанию — проверка без записи (dry-run). Запись — только с --write:
 *   npx tsx --env-file=.env prisma/fix-place-category-names-2026-11.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/fix-place-category-names-2026-11.ts --write   # записать
 * После записи — «Обновить кэш» в админке. После заноса файл можно удалить.
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

const NAMES = [
  {
    slug: "cafe-kids-zone",
    name: "Кафе с детским уголком",
    nameEn: "Café with a kids' corner",
    nameTh: "คาเฟ่ที่มีมุมเด็กเล่น",
    order: 4,
  },
  {
    slug: "waterpark",
    name: "Аквапарк",
    nameEn: "Waterpark",
    nameTh: "สวนน้ำ",
    order: 5,
  },
] as const;

async function main(): Promise<void> {
  console.log(write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)");

  for (const target of NAMES) {
    const current = await prisma.category.findUnique({
      where: { slug: target.slug },
      select: { name: true, nameEn: true, nameTh: true, order: true },
    });

    if (!current) {
      console.log(`? категории ${target.slug} нет в базе — пропускаю`);
      continue;
    }

    const same =
      current.name === target.name &&
      current.nameEn === target.nameEn &&
      current.nameTh === target.nameTh &&
      current.order === target.order;
    if (same) {
      console.log(`= ${target.slug}: уже «${target.name}»`);
      continue;
    }

    console.log(
      `~ ${target.slug}: «${current.name}» / ${current.nameEn ?? "—"} / ${current.nameTh ?? "—"} (порядок ${current.order})` +
        ` → «${target.name}» / ${target.nameEn} / ${target.nameTh} (порядок ${target.order})`,
    );
    if (write) {
      await prisma.category.update({
        where: { slug: target.slug },
        data: {
          name: target.name,
          nameEn: target.nameEn,
          nameTh: target.nameTh,
          order: target.order,
        },
      });
    }
  }

  if (!write) {
    console.log("Ничего не записано. Для записи — запустить с --write.");
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
