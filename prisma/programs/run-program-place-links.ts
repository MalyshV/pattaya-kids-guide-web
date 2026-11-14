/**
 * Общий занос привязки занятий к каталожному месту (ProgramPlaceLink):
 * занятие переезжает внутрь карточки места (блок «Занятия»), текстовая
 * площадка убирается, имя из сбора — по желанию заменяется. Статус не меняет.
 *
 * Правила — в src/lib/import/program-place-link.ts: привязанное к другому
 * месту и имя, исправленное в админке, остаются (в отчёте — «оставлено»).
 * Повторный запуск ничего не меняет. Dry-run по умолчанию, запись — только
 * с --write.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import {
  isEmptyPlaceLinkPlan,
  planProgramPlaceLink,
  validateProgramPlaceLink,
  type ProgramPlaceLink,
} from "../../src/lib/import/program-place-link";

export type ProgramPlaceLinkRunOptions = {
  /// места и занятия, которые этот же запуск создаёт черновиками: в проверке
  /// без записи их в базе ещё нет — это не ошибка
  createdInSameRun?: ReadonlySet<string>;
};

export async function runProgramPlaceLinks(
  links: readonly ProgramPlaceLink[],
  options: ProgramPlaceLinkRunOptions = {},
): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const problems = links.flatMap(validateProgramPlaceLink);
  if (problems.length > 0) {
    throw new Error(`Ошибки в заготовках:\n${problems.join("\n")}`);
  }
  const write = process.argv.includes("--write");
  const created = options.createdInSameRun ?? new Set<string>();
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
    if (!pattaya) {
      throw new Error("Город pattaya не найден — сначала общий seed");
    }
    console.log(write ? "РЕЖИМ: запись" : "РЕЖИМ: проверка без записи (dry-run)");

    let touched = 0;
    let unchanged = 0;
    let missing = 0;

    for (const link of links) {
      const program = await prisma.placeProgram.findUnique({
        where: { slug: link.slug },
        include: { place: { select: { slug: true } } },
      });
      const place = await prisma.place.findUnique({
        where: { cityId_slug: { cityId: pattaya.id, slug: link.placeSlug } },
        select: { id: true, name: true },
      });

      const comesLater =
        (!program && created.has(link.slug)) || (!place && created.has(link.placeSlug));
      if (!write && comesLater) {
        touched += 1;
        console.log(
          `· ${link.slug} → ${link.placeSlug}: создаётся этим же запуском — привяжется при записи`,
        );
        continue;
      }
      if (!program || !place) {
        missing += 1;
        console.log(
          `— нет ${program ? "места" : "занятия"} «${program ? link.placeSlug : link.slug}»: пропуск`,
        );
        continue;
      }

      const plan = planProgramPlaceLink(
        {
          name: program.name,
          placeSlug: program.place?.slug ?? null,
          hasVenue:
            program.venueName !== null ||
            program.venueAddress !== null ||
            program.venueLatitude !== null ||
            program.venueLongitude !== null,
        },
        link,
      );
      const kept =
        plan.skipped.length > 0 ? ` (оставлено: ${plan.skipped.join(", ")})` : "";
      if (isEmptyPlaceLinkPlan(plan)) {
        unchanged += 1;
        console.log(`= ${program.name}: без изменений${kept}`);
        continue;
      }

      const parts: string[] = [];
      if (plan.link) {
        parts.push(`в карточку «${place.name}»`);
      }
      if (plan.clearVenue) {
        parts.push("своя площадка убрана");
      }
      if (plan.rename && link.rename) {
        parts.push(`название → «${link.rename.to}»`);
      }
      console.log(`${write ? "✓" : "·"} ${program.name}: ${parts.join(" | ")}${kept}`);
      touched += 1;

      if (!write) {
        continue;
      }
      await prisma.placeProgram.update({
        where: { id: program.id },
        data: {
          ...(plan.link ? { place: { connect: { id: place.id } } } : {}),
          ...(plan.clearVenue
            ? {
                venueName: null,
                venueNameEn: null,
                venueNameTh: null,
                venueAddress: null,
                venueLatitude: null,
                venueLongitude: null,
              }
            : {}),
          ...(plan.rename && link.rename ? { name: link.rename.to } : {}),
        },
      });
    }

    console.log(
      `\nИтого: ${write ? "записано" : "будет записано"} ${touched}, без изменений ${unchanged}, не найдено ${missing}, всего в партии ${links.length}.`,
    );
    if (!write) {
      console.log("Ничего не записано. Для записи добавьте --write.");
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
