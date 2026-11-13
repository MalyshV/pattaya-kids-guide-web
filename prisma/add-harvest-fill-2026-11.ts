/**
 * Наполнение карточек из сбора 21.10 — вторая партия (prisma/places/harvest-fill-2026-11.ts):
 * описание RU/EN, «Полезно знать», часы, признаки, категории, цены, контакты, фото.
 * Работает только с уже существующими местами по slug; статус не меняет.
 *
 * Заполняет только пустое (src/lib/import/place-fill.ts): описание заменяется,
 * если там пометка «[черновик]» из сбора; остальное пишется, только если у места
 * этого ещё нет. Повторный запуск ничего не меняет.
 *
 * Порядок:
 *   npx tsx --env-file=.env prisma/add-harvest-fill-2026-11.ts           # посмотреть
 *   npx tsx --env-file=.env prisma/add-harvest-fill-2026-11.ts --write   # записать
 *   npx tsx --env-file=.env prisma/apply-thai.ts                         # тайский
 * После записи — «Обновить кэш» в админке.
 */
import { runPlaceFills } from "./places/run-place-fills";
import { HARVEST_FILL_2026_11 } from "./places/harvest-fill-2026-11";

runPlaceFills(HARVEST_FILL_2026_11).catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
