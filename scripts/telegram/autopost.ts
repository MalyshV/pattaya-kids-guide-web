/**
 * Ручной запуск автопостинга (тот же код, что дёргает крон Vercel).
 *
 * Запуск:
 *   npm run telegram:autopost         — найти новое и опубликовать в канал
 *   npm run telegram:autopost:dry     — показать, ЧТО ушло бы, без отправки
 *   npm run telegram:baseline         — первый запуск: пометить весь текущий
 *                                       каталог как «уже опубликовано» (без постов)
 *   npx tsx --env-file=.env scripts/telegram/autopost.ts --limit=3
 */

import { prisma } from "../../src/db/prisma";
import {
  baselineExistingContent,
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

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--baseline")) {
    const result = await baselineExistingContent();
    console.log(
      `Готово: помечено как «уже опубликовано» ${result.events} событий и ${result.places} мест.`,
    );
    console.log("Теперь автопостинг будет публиковать только НОВЫЙ контент.");
    return;
  }

  const dryRun = args.includes("--dry-run");
  const summary = await runAutopost({ dryRun, limit: parseLimit(args) });

  if (summary.posted.length === 0) {
    console.log("Нового контента для публикации нет — всё уже в канале.");
    return;
  }

  for (const item of summary.posted) {
    const label = item.type === "EVENT" ? "событие" : "место";
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
