/**
 * Черновики занятий из ручного отбора Overture (prisma/programs/overture-batch-1.ts):
 * школы и секции как «занятия без каталожного места», status PENDING.
 * Логика — общий prisma/programs/run-program-drafts.ts.
 *   npx tsx --env-file=.env prisma/add-overture-programs-1.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/add-overture-programs-1.ts --write   # записать
 * После заноса файл можно удалить.
 */
import { OVERTURE_PROGRAMS_1 } from "./programs/overture-batch-1";
import { runProgramDrafts } from "./programs/run-program-drafts";

runProgramDrafts(OVERTURE_PROGRAMS_1).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
