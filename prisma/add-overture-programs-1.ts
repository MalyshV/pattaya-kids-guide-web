/**
 * Черновики занятий из ручного отбора Overture (prisma/programs/overture-batch-1.ts):
 * школы и секции как «занятия без каталожного места». Создаёт PlaceProgram со
 * status PENDING (на сайт не попадает до одобрения), type COURSE, с городом,
 * адресом и точкой площадки, категорией из справочника (если есть) и служебной
 * пометкой «[черновик]» в описании — её заменяют настоящим описанием.
 * Уже существующее (по slug, или похожее название рядом) не трогает.
 * Идемпотентно. По умолчанию — проверка без записи.
 *   npx tsx --env-file=.env prisma/add-overture-programs-1.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/add-overture-programs-1.ts --write   # записать
 * После заноса файл можно удалить.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { findDuplicate, type DraftIdentity } from "../src/lib/import/draft-dedup";
import { buildDraftNote } from "../src/lib/import/program-draft";
import { OVERTURE_PROGRAMS_1 } from "./programs/overture-batch-1";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const write = process.argv.includes("--write");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
  if (!pattaya) {
    throw new Error("Город pattaya не найден — сначала общий seed");
  }

  // известные: места каталога и уже существующие занятия (с точкой)
  const places = await prisma.place.findMany({
    where: { cityId: pattaya.id },
    select: { slug: true, name: true, latitude: true, longitude: true },
  });
  const programs = await prisma.placeProgram.findMany({
    select: {
      slug: true,
      name: true,
      venueLatitude: true,
      venueLongitude: true,
      place: { select: { latitude: true, longitude: true } },
    },
  });
  const known: DraftIdentity[] = places.map((place) => ({
    ...place,
    googleMapsUrl: null,
  }));
  const knownSlugs = new Set<string>(
    programs.flatMap((program) => (program.slug ? [program.slug] : [])),
  );
  for (const program of programs) {
    const latitude = program.venueLatitude ?? program.place?.latitude;
    const longitude = program.venueLongitude ?? program.place?.longitude;
    if (latitude != null && longitude != null) {
      known.push({
        slug: program.slug ?? "",
        name: program.name,
        latitude,
        longitude,
        googleMapsUrl: null,
      });
    }
  }

  const categories = new Map<string, string>();
  for (const category of await prisma.activityCategory.findMany({
    select: { id: true, slug: true },
  })) {
    categories.set(category.slug, category.id);
  }

  let created = 0;
  let skipped = 0;
  console.log(write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)");

  for (const draft of OVERTURE_PROGRAMS_1) {
    const candidate: DraftIdentity = {
      slug: draft.slug,
      name: draft.name,
      latitude: draft.venueLatitude,
      longitude: draft.venueLongitude,
      googleMapsUrl: null,
    };
    const duplicate = knownSlugs.has(draft.slug)
      ? { reason: "slug", with: { name: draft.name } }
      : findDuplicate(candidate, known);
    if (duplicate) {
      skipped += 1;
      console.log(
        `— пропуск «${draft.name}»: уже есть «${duplicate.with.name}» (${duplicate.reason})`,
      );
      continue;
    }

    const categoryId = draft.categorySlug
      ? categories.get(draft.categorySlug)
      : undefined;
    const categoryNote =
      draft.categorySlug && !categoryId
        ? ` (категории «${draft.categorySlug}» нет в справочнике — выбрать в админке)`
        : !draft.categorySlug
          ? " (категорию выбрать в админке)"
          : "";

    if (write) {
      const program = await prisma.placeProgram.create({
        data: {
          slug: draft.slug,
          type: "COURSE",
          name: draft.name,
          description: buildDraftNote(draft),
          venueName: draft.name,
          venueAddress: draft.venueAddress,
          venueLatitude: draft.venueLatitude,
          venueLongitude: draft.venueLongitude,
          cityId: pattaya.id,
          status: "PENDING",
        },
      });
      if (categoryId) {
        await prisma.programActivityCategory.create({
          data: { programId: program.id, categoryId },
        });
      }
      console.log(`+ создан черновик «${draft.name}»${categoryNote}`);
    } else {
      console.log(`+ создал бы «${draft.name}»${categoryNote}`);
    }
    known.push(candidate);
    knownSlugs.add(draft.slug);
    created += 1;
  }

  console.log(
    `\nИтого: ${write ? "создано" : "будет создано"} ${created}, пропущено ${skipped}, всего ${OVERTURE_PROGRAMS_1.length}.`,
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
