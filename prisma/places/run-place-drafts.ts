/**
 * Общий занос черновиков мест: PENDING + IMPORT, с проверкой дублей.
 * Dry-run по умолчанию, запись — только с --write. Существующее не трогает.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { findDuplicate, type DraftIdentity } from "../../src/lib/import/draft-dedup";
import { buildDraftNote } from "../../src/lib/import/program-draft";
import type { DraftPlace } from "./overture-batch-1";

/** Контакты черновика в порядке показа: сайт, соцсети, телефон, LINE. */
function draftContacts(draft: DraftPlace): { type: string; value: string }[] {
  const contacts: { type: string; value: string | null | undefined }[] = [
    { type: "website", value: draft.website },
    { type: "facebook", value: draft.facebookUrl },
    { type: "instagram", value: draft.instagramUrl },
    { type: "phone", value: draft.phone },
    { type: "line", value: draft.lineUrl },
  ];
  return contacts.flatMap((c) => (c.value ? [{ type: c.type, value: c.value }] : []));
}

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
    const categories = new Map<string, string>();
    for (const category of await prisma.category.findMany({
      select: { id: true, slug: true },
    })) {
      categories.set(category.slug, category.id);
    }

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
      const categoryIds = (draft.categorySlugs ?? []).flatMap((slug) => {
        const id = categories.get(slug);
        return id ? [id] : [];
      });
      const missing = (draft.categorySlugs ?? []).filter((slug) => !categories.has(slug));
      const categoryNote =
        missing.length > 0
          ? ` (нет в справочнике: ${missing.join(", ")} — выбрать в админке)`
          : "";
      if (write) {
        // место, контакты и категории — одной транзакцией: без полузаписанных черновиков
        await prisma.$transaction(async (tx) => {
          const place = await tx.place.create({
            data: {
              slug: draft.slug,
              name: draft.name,
              address: draft.address,
              latitude: draft.latitude,
              longitude: draft.longitude,
              googleMapsUrl: draft.googleMapsUrl,
              description: draft.about ? buildDraftNote(draft) : null,
              indoor: draft.indoor ?? false,
              outdoor: draft.outdoor ?? false,
              status: "PENDING",
              sourceType: "IMPORT",
              cityId: pattaya.id,
            },
          });
          const contacts = draftContacts(draft);
          if (contacts.length > 0) {
            await tx.placeContact.createMany({
              data: contacts.map((c, index) => ({
                placeId: place.id,
                type: c.type,
                value: c.value,
                order: index + 1,
              })),
            });
          }
          if (categoryIds.length > 0) {
            await tx.placeCategory.createMany({
              data: categoryIds.map((categoryId) => ({ placeId: place.id, categoryId })),
            });
          }
        });
        console.log(`+ создан черновик «${draft.name}»${tag}${categoryNote}`);
      } else {
        console.log(`+ создал бы «${draft.name}»${tag}${categoryNote}`);
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
