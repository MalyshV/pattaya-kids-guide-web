/**
 * Партия «из личных альбомов» (11.11.2026) — prisma/places/albums-2026-11.ts
 * и prisma/programs/albums-2026-11.ts. Один запуск делает три шага:
 *   1. создаёт черновики новых мест (PENDING — на сайт не попадают до
 *      одобрения в /admin) и черновик занятия Stylus;
 *   2. наполняет новые места: описание RU/EN, «Полезно знать», часы,
 *      признаки, обложка и галерея;
 *   3. добавляет фото и описания к уже существующим карточкам.
 * Заполняется только пустое: сделанное в админке остаётся (в отчёте —
 * «оставлено»). Дубли пропускает. Повторный запуск ничего не меняет.
 *
 * Запускать после мержа — фото должны уже лежать на сайте:
 *   npx tsx --env-file=.env prisma/add-albums-2026-11.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/add-albums-2026-11.ts --write   # записать
 * После записи — «Обновить кэш» в админке. После заноса файл можно удалить.
 */
import {
  ALBUMS_2026_11_FILLS,
  ALBUMS_2026_11_NEW_FILLS,
  ALBUMS_2026_11_NEW_PLACES,
} from "./places/albums-2026-11";
import { runPlaceDrafts } from "./places/run-place-drafts";
import { runPlaceFills } from "./places/run-place-fills";
import { ALBUMS_2026_11_PROGRAMS } from "./programs/albums-2026-11";
import { runProgramDrafts } from "./programs/run-program-drafts";

async function main(): Promise<void> {
  console.log("=== Новые места (черновики) ===");
  await runPlaceDrafts(ALBUMS_2026_11_NEW_PLACES);
  console.log("\n=== Новое занятие (черновик) ===");
  await runProgramDrafts(ALBUMS_2026_11_PROGRAMS);
  console.log("\n=== Наполнение и фото ===");
  await runPlaceFills([...ALBUMS_2026_11_NEW_FILLS, ...ALBUMS_2026_11_FILLS], {
    createdInSameRun: new Set(ALBUMS_2026_11_NEW_PLACES.map((place) => place.slug)),
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
