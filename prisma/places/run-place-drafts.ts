/**
 * Общий занос черновиков мест: PENDING + IMPORT, с проверкой дублей.
 * Dry-run по умолчанию, запись — только с --write. Существующее не трогает.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { findDuplicate, type DraftIdentity } from "../../src/lib/import/draft-dedup";
import type { DraftPlace } from "./overture-batch-1";

export async function runPlaceDrafts(drafts: readonly DraftPlace[]): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const write = process.argv.includes("--write");
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
    if (!pattaya) {
      throw new Error("Город pattaya не найден — сначала общий seed");
    }
    const existing = await prisma.place.findMany({
      where: { cityId: pattaya.id },
      select: {
        slug: true,
        name: true,
        latitude: true,
        longitude: true,
        googleMapsUrl: true,
      },
    });
    // сверяем и с каталогом, и с теми, что приняли в этой партии
    const known: DraftIdentity[] = existing.map((row) => ({ ...row }));

    let created = 0;
    let skipped = 0;
    console.log(write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)");

    for (const draft of drafts) {
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
      if (write) {
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
        ].filter((c): c is { type: string; value: string } => Boolean(c));
        if (contacts.length > 0) {
          await prisma.placeContact.createMany({
            data: contacts.map((c, index) => ({
              placeId: place.id,
              type: c.type,
              value: c.value,
              order: index + 1,
            })),
          });
        }
        console.log(`+ создан черновик «${draft.name}»${tag}`);
      } else {
        console.log(`+ создал бы «${draft.name}»${tag}`);
      }
      known.push(candidate);
      created += 1;
    }

    console.log(
      `\nИтого: ${write ? "создано" : "будет создано"} ${created}, пропущено ${skipped}, всего в партии ${drafts.length}.`,
    );
    if (!write) {
      console.log("Ничего не записано. Для записи добавьте --write.");
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
