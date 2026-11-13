/**
 * Временно скрыть с сайта карточки, которые остались с черновиком (решение 13.11).
 *
 * После наполнения 13.11 (PR #187, #189) у части мест и занятий в описании
 * всё ещё служебная пометка «[черновик]» — их не наполнили (похоже, закрыто,
 * мало сведений, решение за вами — список с причинами в docs/HARVEST_2026_10.md).
 * Скрипт переводит такие карточки в «скрыто» (PENDING): с сайта они уходят,
 * в админке остаются, и каждую можно вернуть кнопкой показа в форме.
 *
 * Берёт только видимые сейчас (APPROVED) места и занятия, у которых в русском
 * описании есть «[черновик]». Журнал Telegram не трогает.
 *
 * Откат (--revert) возвращает показ только карточкам сбора 21.10
 * (prisma/places|programs/harvest-2026-10*.ts), которые всё ещё скрыты и
 * с пометкой «[черновик]»: более ранние скрытые черновики (Overture) он не
 * публикует.
 *
 * По умолчанию — проверка без записи.
 *   npx tsx --env-file=.env prisma/hide-drafts-2026-11.ts                    # посмотреть
 *   npx tsx --env-file=.env prisma/hide-drafts-2026-11.ts --write            # скрыть
 *   npx tsx --env-file=.env prisma/hide-drafts-2026-11.ts --revert           # посмотреть откат
 *   npx tsx --env-file=.env prisma/hide-drafts-2026-11.ts --revert --write   # вернуть показ
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { HARVEST_2026_10_PLACES } from "./places/harvest-2026-10";
import { HARVEST_2026_10_PLACES_B } from "./places/harvest-2026-10-b";
import { HARVEST_2026_10_PROGRAMS } from "./programs/harvest-2026-10";
import { HARVEST_2026_10_PROGRAMS_B } from "./programs/harvest-2026-10-b";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const DRAFT_MARK = "[черновик]";
const write = process.argv.includes("--write");
const revert = process.argv.includes("--revert");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const harvestPlaceSlugs = [...HARVEST_2026_10_PLACES, ...HARVEST_2026_10_PLACES_B].map(
  (draft) => draft.slug,
);
const harvestProgramSlugs = [
  ...HARVEST_2026_10_PROGRAMS,
  ...HARVEST_2026_10_PROGRAMS_B,
].map((draft) => draft.slug);

async function main() {
  const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
  if (!pattaya) {
    throw new Error("Город pattaya не найден");
  }
  // скрыть: APPROVED → PENDING; откат: PENDING → APPROVED
  const status = revert ? "PENDING" : "APPROVED";
  const target = revert ? "APPROVED" : "PENDING";

  console.log(
    `${write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)"} — ${revert ? "откат (вернуть показ)" : "скрыть черновики"}`,
  );

  const places = await prisma.place.findMany({
    where: {
      cityId: pattaya.id,
      status,
      description: { contains: DRAFT_MARK },
      ...(revert ? { slug: { in: harvestPlaceSlugs } } : {}),
    },
    select: { id: true, slug: true, name: true },
    orderBy: { name: "asc" },
  });
  const programs = await prisma.placeProgram.findMany({
    where: {
      status,
      description: { contains: DRAFT_MARK },
      ...(revert ? { slug: { in: harvestProgramSlugs } } : {}),
    },
    select: { id: true, slug: true, name: true },
    orderBy: { name: "asc" },
  });

  console.log(`\nМеста (${places.length}):`);
  for (const place of places) {
    console.log(`  - ${place.name} (${place.slug})`);
  }
  console.log(`\nЗанятия (${programs.length}):`);
  for (const program of programs) {
    console.log(`  - ${program.name} (${program.slug})`);
  }

  if (write) {
    await prisma.$transaction([
      prisma.place.updateMany({
        where: { id: { in: places.map((place) => place.id) } },
        data: { status: target },
      }),
      prisma.placeProgram.updateMany({
        where: { id: { in: programs.map((program) => program.id) } },
        data: { status: target },
      }),
    ]);
  }

  const verb = revert ? "возвращены на сайт" : "скрыты с сайта";
  console.log(
    `\nМест: ${places.length}, занятий: ${programs.length} — ${write ? verb : `будут ${verb}`}.`,
  );
  if (!write) {
    console.log("Ничего не записано. Для записи добавьте --write.");
  } else {
    console.log(
      "На проде данные кэшируются до часа — в админке можно нажать «Обновить кэш».",
    );
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
