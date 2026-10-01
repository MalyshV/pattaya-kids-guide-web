/**
 * Переводы советов из scripts/tips/translations.json → в базу.
 * Запуск: npm run tips:apply (сначала посмотреть без записи: npm run tips:apply:dry)
 * Пишет только textEn / textTh и только там, где русский текст совета не менялся.
 */

import { existsSync, readFileSync } from "node:fs";
import {
  parseTranslationFile,
  planTranslationUpdates,
  type TipRow,
} from "../../src/lib/admin/tip-translations";
import { TRANSLATIONS_FILE, connect } from "./db";

const REASON = {
  missing: "совета уже нет",
  changed: "русский текст изменился",
} as const;

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  if (!existsSync(TRANSLATIONS_FILE)) {
    throw new Error(
      "Нет файла scripts/tips/translations.json — сначала npm run tips:export",
    );
  }
  const entries = parseTranslationFile(
    JSON.parse(readFileSync(TRANSLATIONS_FILE, "utf8")),
  );

  const prisma = connect();
  try {
    const select = { id: true, text: true, textEn: true, textTh: true } as const;
    const ids = (owner: string): string[] =>
      entries.filter((entry) => entry.owner === owner).map((entry) => entry.id);
    const [placeTips, eventTips, programTips] = await Promise.all([
      prisma.placeTip.findMany({ where: { id: { in: ids("place") } }, select }),
      prisma.eventTip.findMany({ where: { id: { in: ids("event") } }, select }),
      prisma.programTip.findMany({ where: { id: { in: ids("program") } }, select }),
    ]);
    const current = new Map<string, TipRow>([
      ...placeTips.map((tip) => [`place:${tip.id}`, tip] as const),
      ...eventTips.map((tip) => [`event:${tip.id}`, tip] as const),
      ...programTips.map((tip) => [`program:${tip.id}`, tip] as const),
    ]);

    const plan = planTranslationUpdates(entries, current);
    for (const { entry, reason } of plan.skipped) {
      console.warn(`⚠️  пропущен (${REASON[reason]}): ${entry.card} — ${entry.text}`);
    }

    if (!dryRun) {
      for (const { owner, id, data } of plan.updates) {
        if (owner === "place") {
          await prisma.placeTip.update({ where: { id }, data });
        } else if (owner === "event") {
          await prisma.eventTip.update({ where: { id }, data });
        } else {
          await prisma.programTip.update({ where: { id }, data });
        }
      }
    }

    console.log(
      `${dryRun ? "Проверка без записи. Было бы обновлено" : "Обновлено"} советов: ${plan.updates.length}` +
        (plan.skipped.length > 0 ? `, пропущено: ${plan.skipped.length}` : ""),
    );
    if (!dryRun && plan.updates.length > 0) {
      console.log("Чтобы сайт показал переводы сразу — «Обновить кэш» в админке.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
