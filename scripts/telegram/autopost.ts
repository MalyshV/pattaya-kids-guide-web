/**
 * Ручной запуск автопостинга (тот же код, что дёргает крон Vercel).
 *
 * Запуск:
 *   npm run telegram:autopost         — найти новое и опубликовать в канал
 *   npm run telegram:autopost:dry     — показать, ЧТО ушло бы, без отправки
 *   npm run telegram:baseline         — первый запуск: пометить весь текущий
 *                                       каталог как «уже опубликовано» (без постов)
 *   npm run telegram:reset            — показать, сколько записей журнала сбросилось бы
 *                                       (ничего не удаляет)
 *   npm run telegram:reset -- --yes   — по-настоящему сбросить журнал; можно
 *                                       сузить: --type=events,places,activities
 *   npx tsx --env-file=.env scripts/telegram/autopost.ts --limit=3
 */

import { prisma } from "../../src/db/prisma";
import { parseResetTypes } from "../../src/lib/telegram/autopost-policy";
import {
  baselineExistingContent,
  resetAutopostJournal,
  runAutopost,
} from "../../src/services/telegram-autopost.service";

function parseLimit(args: string[]): number | undefined {
  const limitArg = args.find((arg) => arg.startsWith("--limit="));
  if (!limitArg) {
    return undefined;
  }
  const value = Number(limitArg.split("=")[1]);
  return Number.isInteger(value) && value > 0 ? value : undefined;
}

async function runReset(args: string[]): Promise<void> {
  const parsed = parseResetTypes(args);
  if (!parsed.ok) {
    console.error(parsed.error);
    console.error("Ничего не сделано.");
    process.exitCode = 1;
    return;
  }

  const confirmed = args.includes("--yes");
  const result = await resetAutopostJournal({ types: parsed.types, dryRun: !confirmed });
  const names = {
    EVENT: "событий",
    PLACE: "мест",
    ACTIVITY: "занятий",
  } as const;

  console.log(
    confirmed ? "Журнал автопостинга сброшен:" : "Было бы сброшено (ничего не удалено):",
  );
  for (const type of parsed.types) {
    console.log(`  ${names[type]}: ${result.journal[type]} записей журнала`);
  }
  const queuedTotal = parsed.types.reduce((sum, type) => sum + result.queued[type], 0);
  console.log(
    `После сброса в очереди на публикацию (по выбранным типам): ${queuedTotal} постов.`,
  );

  if (!confirmed) {
    console.log("Для настоящего сброса добавьте флаг --yes:");
    console.log("  npm run telegram:reset -- --yes");
    return;
  }

  console.log("");
  console.log(
    "ВАЖНО: старые посты в канале нужно удалить руками в Telegram, иначе будут дубли.",
  );
  console.log("Автопостинг пойдёт по 5 постов за прогон (крон раз в день или вручную).");
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--baseline")) {
    const result = await baselineExistingContent();
    console.log(
      `Готово: помечено как «уже опубликовано» ${result.events} событий, ${result.places} мест и ${result.activities} занятий.`,
    );
    console.log("Теперь автопостинг будет публиковать только НОВЫЙ контент.");
    return;
  }

  if (args.includes("--reset")) {
    await runReset(args);
    return;
  }

  const dryRun = args.includes("--dry-run");
  const summary = await runAutopost({ dryRun, limit: parseLimit(args) });

  if (summary.posted.length === 0) {
    console.log("Нового контента для публикации нет — всё уже в канале.");
    return;
  }

  for (const item of summary.posted) {
    const label =
      item.type === "EVENT" ? "событие" : item.type === "PLACE" ? "место" : "занятие";
    console.log(`${dryRun ? "[черновик] " : "✓ "}${label}: ${item.title}`);
    if (item.preview) {
      console.log("---");
      console.log(item.preview);
      console.log("---");
    }
  }

  console.log(
    dryRun
      ? `Всего к публикации: ${summary.posted.length}. Отправки не было (dry-run).`
      : `Опубликовано постов: ${summary.posted.length}.`,
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    // pg-пул держит процесс живым — отпускаем соединения
    await prisma.$disconnect();
  });
