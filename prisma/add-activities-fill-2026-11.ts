/**
 * Наполнение карточек занятий из сбора 21.10.2026 (партия 13.11.2026):
 * описания RU/EN/TH, «Полезно знать», возраст, цены, группы, категории, фото.
 * Только существующие занятия по slug; заполняет только пустое — правки из
 * админки не затирает; статус не меняет. Тайский — прямо в партии
 * (prisma/programs/activities-fill-2026-11.ts), apply-thai не нужен.
 *
 * Порядок (db push не нужен — новых полей нет):
 *   1) мерж PR (Vercel задеплоит фото);
 *   2) npx tsx --env-file=.env prisma/add-activities-fill-2026-11.ts — проверка;
 *   3) то же с --write — запись;
 *   4) в админке «Обновить кэш».
 */
import { ACTIVITIES_FILL_2026_11 } from "./programs/activities-fill-2026-11";
import { runProgramFills } from "./programs/run-program-fills";

runProgramFills(ACTIVITIES_FILL_2026_11).catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
