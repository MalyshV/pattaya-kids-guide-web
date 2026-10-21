/**
 * Сбор 21.10.2026: черновики мест (prisma/places/harvest-2026-10.ts) и
 * занятий (prisma/programs/harvest-2026-10.ts). Всё PENDING — на сайт не
 * попадает до одобрения в /admin. Дубли с каталогом пропускает, существующее
 * не трогает. Идемпотентно. По умолчанию — проверка без записи.
 *   npx tsx --env-file=.env prisma/add-harvest-2026-10.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/add-harvest-2026-10.ts --write   # записать
 * После заноса файл можно удалить.
 */
import { HARVEST_2026_10_PLACES } from "./places/harvest-2026-10";
import { runPlaceDrafts } from "./places/run-place-drafts";
import { HARVEST_2026_10_PROGRAMS } from "./programs/harvest-2026-10";
import { runProgramDrafts } from "./programs/run-program-drafts";

async function main() {
  console.log("=== Места ===");
  await runPlaceDrafts(HARVEST_2026_10_PLACES);
  console.log("\n=== Занятия ===");
  await runProgramDrafts(HARVEST_2026_10_PROGRAMS);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
