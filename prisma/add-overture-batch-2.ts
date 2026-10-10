/**
 * Вторая партия черновиков мест (prisma/places/overture-batch-2.ts):
 * PENDING + IMPORT, на сайт не попадают до одобрения в /admin. Дубли с
 * каталогом пропускает. Идемпотентно. По умолчанию — проверка без записи.
 *   npx tsx --env-file=.env prisma/add-overture-batch-2.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/add-overture-batch-2.ts --write   # записать
 * После заноса файл можно удалить.
 */
import { OVERTURE_BATCH_2 } from "./places/overture-batch-2";
import { runPlaceDrafts } from "./places/run-place-drafts";

runPlaceDrafts(OVERTURE_BATCH_2).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
