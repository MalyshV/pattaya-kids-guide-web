/**
 * IG Center Pattaya — prisma/places/ig-center-2026-11.ts и
 * prisma/programs/ig-center-2026-11.ts. Один запуск делает четыре шага:
 *   1. черновик места IG Center (PENDING — на сайт не попадает до одобрения
 *      в /admin) и черновик занятия «G Robo-Tech Lab (Robot Station)»;
 *   2. наполняет место: описание RU/EN, «Полезно знать», часы, признаки,
 *      обложка и галерея;
 *   3. переносит пять занятий в карточку центра (блок «Занятия»);
 *   4. наполняет занятия: описания, советы, группы по возрасту, фото.
 * Заполняется только пустое: сделанное в админке остаётся (в отчёте —
 * «оставлено»). Повторный запуск ничего не меняет. Статусы не меняет.
 *
 * Запускать после мержа — фото должны уже лежать на сайте:
 *   npx tsx --env-file=.env prisma/add-ig-center-2026-11.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/add-ig-center-2026-11.ts --write   # записать
 * После записи — «Обновить кэш» в админке. Публиковать сначала место, потом
 * занятия: страница занятия ссылается на карточку центра.
 */
import { IG_CENTER_FILL, IG_CENTER_PLACE } from "./places/ig-center-2026-11";
import { runPlaceDrafts } from "./places/run-place-drafts";
import { runPlaceFills } from "./places/run-place-fills";
import {
  IG_CENTER_NEW_PROGRAMS,
  IG_CENTER_PROGRAM_FILLS,
  IG_CENTER_PROGRAM_LINKS,
} from "./programs/ig-center-2026-11";
import { runProgramDrafts } from "./programs/run-program-drafts";
import { runProgramFills } from "./programs/run-program-fills";
import { runProgramPlaceLinks } from "./programs/run-program-place-links";

async function main(): Promise<void> {
  const created = new Set([
    IG_CENTER_PLACE.slug,
    ...IG_CENTER_NEW_PROGRAMS.map((program) => program.slug),
  ]);
  console.log("=== Черновики: место и робототехника ===");
  await runPlaceDrafts([IG_CENTER_PLACE]);
  await runProgramDrafts(IG_CENTER_NEW_PROGRAMS);
  console.log("\n=== Наполнение места ===");
  await runPlaceFills([IG_CENTER_FILL], { createdInSameRun: created });
  console.log("\n=== Занятия — в карточку центра ===");
  await runProgramPlaceLinks(IG_CENTER_PROGRAM_LINKS, { createdInSameRun: created });
  console.log("\n=== Наполнение занятий ===");
  await runProgramFills(IG_CENTER_PROGRAM_FILLS, { createdInSameRun: created });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
