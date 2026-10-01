/**
 * Советы «Полезно знать» без перевода → scripts/tips/translations.json.
 * Только читает базу. Запуск: npm run tips:export
 * Дальше — заполнить в файле textEn / textTh и запустить npm run tips:apply.
 */

import { writeFileSync } from "node:fs";
import { untranslated } from "../../src/lib/admin/tip-translations";
import { TRANSLATIONS_FILE, connect } from "./db";

async function main(): Promise<void> {
  const prisma = connect();
  try {
    const select = { id: true, text: true, textEn: true, textTh: true } as const;
    const [placeTips, eventTips, programTips] = await Promise.all([
      prisma.placeTip.findMany({
        orderBy: [{ placeId: "asc" }, { order: "asc" }],
        select: { ...select, place: { select: { name: true } } },
      }),
      prisma.eventTip.findMany({
        orderBy: [{ eventId: "asc" }, { order: "asc" }],
        select: { ...select, event: { select: { title: true } } },
      }),
      prisma.programTip.findMany({
        orderBy: [{ programId: "asc" }, { order: "asc" }],
        select: { ...select, program: { select: { name: true } } },
      }),
    ]);

    const entries = [
      ...untranslated(
        "place",
        placeTips.map(({ place, ...tip }) => ({ ...tip, card: place.name })),
      ),
      ...untranslated(
        "event",
        eventTips.map(({ event, ...tip }) => ({ ...tip, card: event.title })),
      ),
      ...untranslated(
        "program",
        programTips.map(({ program, ...tip }) => ({ ...tip, card: program.name })),
      ),
    ];

    writeFileSync(TRANSLATIONS_FILE, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
    const total = placeTips.length + eventTips.length + programTips.length;
    console.log(
      `Советов всего: ${total}. Без английского или тайского: ${entries.length}.`,
    );
    console.log(
      entries.length > 0
        ? `Файл для перевода: scripts/tips/translations.json`
        : "Переводить нечего — файл пустой.",
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
