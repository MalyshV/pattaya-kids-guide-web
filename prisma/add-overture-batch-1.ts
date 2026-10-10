/**
 * Первая партия черновиков мест (20 штук, prisma/places/overture-batch-1.ts):
 * создаёт записи со status PENDING и sourceType IMPORT — на сайт они не попадают,
 * пока их не одобрят в /admin. Занос только добавляет: уже существующие места
 * (по slug, ссылке на карточку карты или «похожее название рядом») не трогает.
 * Идемпотентно.
 *
 * По умолчанию — проверка без записи (dry-run). Запись — только с --write:
 *   npx tsx --env-file=.env prisma/add-overture-batch-1.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/add-overture-batch-1.ts --write   # записать
 * После успешного заноса файл можно удалить (черновики уже в базе).
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { findDuplicate, type DraftIdentity } from "../src/lib/import/draft-dedup";
import { OVERTURE_BATCH_1 } from "./places/overture-batch-1";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const write = process.argv.includes("--write");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
  if (!pattaya) {
    throw new Error("Город pattaya не найден — сначала общий seed");
  }

  const existingRows = await prisma.place.findMany({
    where: { cityId: pattaya.id },
    select: {
      slug: true,
      name: true,
      latitude: true,
      longitude: true,
      googleMapsUrl: true,
    },
  });
  // сверяем и с каталогом, и с теми, что только что приняли в этой партии
  const known: DraftIdentity[] = existingRows.map((row) => ({ ...row }));

  let created = 0;
  let skipped = 0;
  console.log(write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)");

  for (const draft of OVERTURE_BATCH_1) {
    const candidate: DraftIdentity = {
      slug: draft.slug,
      name: draft.name,
      latitude: draft.latitude,
      longitude: draft.longitude,
      googleMapsUrl: draft.googleMapsUrl,
    };
    const duplicate = findDuplicate(candidate, known);
    if (duplicate) {
      skipped += 1;
      console.log(
        `— пропуск «${draft.name}»: уже есть «${duplicate.with.name}» (${duplicate.reason})`,
      );
      continue;
    }

    const tag = draft.animals ? " 🐾" : "";
    if (!write) {
      console.log(`+ создал бы «${draft.name}»${tag}`);
      known.push(candidate);
      created += 1;
      continue;
    }

    const place = await prisma.place.create({
      data: {
        slug: draft.slug,
        name: draft.name,
        address: draft.address,
        latitude: draft.latitude,
        longitude: draft.longitude,
        googleMapsUrl: draft.googleMapsUrl,
        status: "PENDING",
        sourceType: "IMPORT",
        cityId: pattaya.id,
      },
    });
    const contacts = [
      draft.website && { type: "website", value: draft.website },
      draft.facebookUrl && { type: "facebook", value: draft.facebookUrl },
    ].filter((contact): contact is { type: string; value: string } => Boolean(contact));
    if (contacts.length > 0) {
      await prisma.placeContact.createMany({
        data: contacts.map((contact, index) => ({
          placeId: place.id,
          type: contact.type,
          value: contact.value,
          order: index + 1,
        })),
      });
    }
    known.push(candidate);
    created += 1;
    console.log(`+ создан черновик «${draft.name}»${tag}`);
  }

  console.log(
    `\nИтого: ${write ? "создано" : "будет создано"} ${created}, пропущено ${skipped}, всего в партии ${OVERTURE_BATCH_1.length}.`,
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
