/**
 * Пробная публикация сбора 21.10.2026 (решение 21.10): все черновики мест и
 * занятий из prisma/places/harvest-2026-10*.ts и prisma/programs/harvest-2026-10*.ts
 * становятся видны на сайте, чтобы проверить сайт под объёмом и вычитывать
 * карточки на живых страницах.
 *
 * Telegram: каждую опубликованную карточку записываем в журнал автопостинга
 * без отправки (messageId = null, как baseline) — в канал они не уходят.
 * Откат (--revert) возвращает «скрыто» и снимает эти записи журнала (только
 * без messageId — настоящие посты не трогает), после чего проверенные карточки
 * смогут уйти в канал обычным порядком.
 *
 * Трогает только записи сбора со статусом PENDING (при публикации) или
 * APPROVED (при откате); удалённые в админке пропускает. По умолчанию —
 * проверка без записи.
 *   npx tsx --env-file=.env prisma/publish-harvest-2026-10.ts                    # посмотреть
 *   npx tsx --env-file=.env prisma/publish-harvest-2026-10.ts --write            # опубликовать
 *   npx tsx --env-file=.env prisma/publish-harvest-2026-10.ts --revert           # посмотреть откат
 *   npx tsx --env-file=.env prisma/publish-harvest-2026-10.ts --revert --write   # откатить
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
const channelId = process.env.TELEGRAM_CHANNEL_ID ?? "";
if (!channelId) {
  throw new Error("TELEGRAM_CHANNEL_ID is not defined");
}

const write = process.argv.includes("--write");
const revert = process.argv.includes("--revert");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const placeSlugs = [...HARVEST_2026_10_PLACES, ...HARVEST_2026_10_PLACES_B].map(
  (draft) => draft.slug,
);
const programSlugs = [...HARVEST_2026_10_PROGRAMS, ...HARVEST_2026_10_PROGRAMS_B].map(
  (draft) => draft.slug,
);

async function main() {
  const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
  if (!pattaya) {
    throw new Error("Город pattaya не найден");
  }
  const from = revert ? "APPROVED" : "PENDING";
  const to = revert ? "PENDING" : "APPROVED";
  console.log(
    `${write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)"} — ${revert ? "откат (скрыть)" : "публикация"}`,
  );

  const places = await prisma.place.findMany({
    where: { cityId: pattaya.id, slug: { in: placeSlugs }, status: from },
    select: { id: true },
  });
  const programs = await prisma.placeProgram.findMany({
    where: { slug: { in: programSlugs }, status: from },
    select: { id: true },
  });
  const placeIds = places.map((place) => place.id);
  const programIds = programs.map((program) => program.id);

  if (write) {
    await prisma.$transaction(async (tx) => {
      await tx.place.updateMany({
        where: { id: { in: placeIds } },
        data: { status: to },
      });
      await tx.placeProgram.updateMany({
        where: { id: { in: programIds } },
        data: { status: to },
      });
      if (revert) {
        await tx.telegramPost.deleteMany({
          where: {
            messageId: null,
            OR: [
              { entityType: "PLACE", entityId: { in: placeIds } },
              { entityType: "ACTIVITY", entityId: { in: programIds } },
            ],
          },
        });
      } else {
        await tx.telegramPost.createMany({
          data: [
            ...placeIds.map((entityId) => ({
              entityType: "PLACE" as const,
              entityId,
              messageId: null,
              channelId,
            })),
            ...programIds.map((entityId) => ({
              entityType: "ACTIVITY" as const,
              entityId,
              messageId: null,
              channelId,
            })),
          ],
          skipDuplicates: true,
        });
      }
    });
  }

  console.log(
    `Мест: ${placeIds.length} из ${placeSlugs.length}, занятий: ${programIds.length} из ${programSlugs.length} — ${write ? "" : "будут "}${revert ? "скрыты" : "опубликованы"}.`,
  );
  console.log(
    revert
      ? "Журнал Telegram: записи «без отправки» по ним сняты."
      : "Журнал Telegram: записаны как «без отправки» — в канал не уйдут.",
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
