/**
 * Движок данных: импорт «скелета» места из Google Places API.
 *
 * Скелет = название/адрес/координаты/часы/телефон/сайт + Google Place ID
 * (дедуп). Запись создаётся ЧЕРНОВИКОМ (status PENDING, sourceType IMPORT) —
 * на сайт не попадает до одобрения. Уникальную ценность (описание RU/EN,
 * категории, tri-state признаки, советы, цены) заполняет человек.
 *
 * Запуск (нужен GOOGLE_PLACES_API_KEY в .env — см. docs/DATA_ENGINE.md):
 *   npm run import:place -- "Skippy Land Lotus North Pattaya"
 *   npm run import:place -- "https://www.google.com/maps/place/..."  (ссылка на карточку)
 *   npm run import:place -- --id=ChIJ...           — превью скелета по Place ID
 *   npm run import:place -- --id=ChIJ... --write   — записать черновик в базу
 *   npm run import:place -- --id=ChIJ... --write --city=pattaya
 *
 * По умолчанию — dry-run (ничего не пишет). Запись — только явным --write
 * с явным --id: «дубль страшнее потери» распространяется и на импорт.
 * Дедуп двухслойный: googlePlaceId (повторный импорт) + совпадение имени/
 * координат с ручным каталогом (у него googlePlaceId пуст); обход второго
 * слоя — осознанный --force.
 */

import {
  getPlaceDetails,
  GooglePlacesApiError,
  searchPlacesByText,
} from "../../src/lib/import/google-places-client";
import {
  mapGooglePlaceToSkeleton,
  parseGoogleMapsUrl,
  slugifyPlaceName,
  type PlaceSkeleton,
} from "../../src/lib/import/place-skeleton";
import { haversineMeters } from "../../src/lib/geo/distance";

const DEFAULT_CITY_SLUG = "pattaya";
/// сколько кандидатов поиска показываем (полный список загромождает терминал)
const MAX_CANDIDATES_SHOWN = 5;
/// ближе этого расстояния до существующего места — вероятный дубль
const DUPLICATE_RADIUS_M = 150;
/// дальше этого расстояния от центра города — предупреждение «не тот город?»
const CITY_RADIUS_M = 25_000;

// prisma подключаем лениво: dry-run и поиск работают без базы (и не требуют
// DATABASE_URL), а $disconnect в конце нужен только если база реально трогалась
type PrismaModule = typeof import("../../src/db/prisma");
let prismaModule: PrismaModule | null = null;
async function getPrisma(): Promise<PrismaModule["prisma"]> {
  if (!prismaModule) {
    prismaModule = await import("../../src/db/prisma");
  }
  return prismaModule.prisma;
}

type CliArgs = {
  query: string | null;
  placeId: string | null;
  write: boolean;
  force: boolean;
  citySlug: string;
};

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    query: null,
    placeId: null,
    write: false,
    force: false,
    citySlug: DEFAULT_CITY_SLUG,
  };
  for (const arg of argv) {
    if (arg === "--write") {
      args.write = true;
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg.startsWith("--id=")) {
      args.placeId = arg.slice("--id=".length).trim() || null;
    } else if (arg.startsWith("--city=")) {
      args.citySlug = arg.slice("--city=".length).trim() || DEFAULT_CITY_SLUG;
    } else if (!arg.startsWith("--")) {
      args.query = args.query ? `${args.query} ${arg}` : arg;
    } else {
      console.error(`Неизвестный флаг: ${arg}`);
      process.exit(1);
    }
  }
  return args;
}

function printSkeleton(skeleton: PlaceSkeleton): void {
  console.log(`\nСкелет места (только проверяемые у Google факты):`);
  console.log(`  Название:    ${skeleton.name}`);
  console.log(`  Адрес:       ${skeleton.address ?? "— (Google не отдал)"}`);
  console.log(
    `  Координаты:  ${
      skeleton.latitude !== null && skeleton.longitude !== null
        ? `${skeleton.latitude}, ${skeleton.longitude}`
        : "— (Google не отдал)"
    }`,
  );
  console.log(`  Maps-ссылка: ${skeleton.googleMapsUrl ?? "—"}`);
  if (skeleton.schedules.length > 0) {
    console.log(`  Часы:`);
    for (const s of skeleton.schedules) {
      console.log(`    ${s.day} ${s.openTime}–${s.closeTime}`);
    }
  } else {
    console.log(`  Часы:        — (Google не отдал; проверить на месте)`);
  }
  for (const contact of skeleton.contacts) {
    console.log(
      `  ${contact.type === "phone" ? "Телефон:    " : "Сайт:       "} ${contact.value}`,
    );
  }
  console.log(`  Типы Google: ${skeleton.googleTypes.join(", ") || "—"}`);
  console.log(`  Place ID:    ${skeleton.googlePlaceId}`);
}

/** Свободный slug в городе: base, base-2 … base-9. */
async function ensureUniqueSlug(cityId: string, base: string): Promise<string> {
  const prisma = await getPrisma();
  for (let attempt = 0; attempt < 9; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const taken = await prisma.place.findFirst({
      where: { cityId, slug: candidate },
      select: { id: true },
    });
    if (!taken) {
      return candidate;
    }
  }
  throw new Error(`Не нашёл свободный slug от «${base}» — займитесь вручную`);
}

/**
 * Страховка от дубля с РУЧНЫМ каталогом: googlePlaceId ловит только повторный
 * импорт, а у занесённых руками мест он NULL. Совпадение имени (без регистра)
 * или место ближе DUPLICATE_RADIUS_M — вероятный дубль.
 */
async function findLikelyDuplicate(
  cityId: string,
  skeleton: PlaceSkeleton,
): Promise<{ name: string; slug: string } | null> {
  const prisma = await getPrisma();
  const places = await prisma.place.findMany({
    where: { cityId },
    select: { name: true, slug: true, latitude: true, longitude: true },
  });
  const wantedName = skeleton.name.toLowerCase();
  for (const place of places) {
    if (place.name.toLowerCase() === wantedName) {
      return place;
    }
    if (
      skeleton.latitude !== null &&
      skeleton.longitude !== null &&
      haversineMeters(
        { latitude: skeleton.latitude, longitude: skeleton.longitude },
        { latitude: place.latitude, longitude: place.longitude },
      ) < DUPLICATE_RADIUS_M
    ) {
      return place;
    }
  }
  return null;
}

async function writeSkeleton(
  skeleton: PlaceSkeleton,
  citySlug: string,
  force: boolean,
): Promise<void> {
  const prisma = await getPrisma();
  // дедуп по каноническому Google Place ID — ловит повторный ИМПОРТ
  const existing = await prisma.place.findFirst({
    where: { googlePlaceId: skeleton.googlePlaceId },
    select: { slug: true, status: true },
  });
  if (existing) {
    console.log(
      `\nУже занесено: ${existing.slug} (status ${existing.status}). Дубль не создаю.`,
    );
    return;
  }

  // без адреса и координат запись в каталоге бесполезна (гео-фичи, карта) —
  // честнее отказать, чем создать пустышку
  if (!skeleton.address || skeleton.latitude === null || skeleton.longitude === null) {
    console.error(
      `\nСкелет неполный (нет адреса или координат) — занесите место вручную через seed/админку.`,
    );
    process.exitCode = 1;
    return;
  }

  const city = await prisma.city.findFirst({ where: { slug: citySlug } });
  if (!city) {
    console.error(`\nГород «${citySlug}» не найден в базе — сначала общий seed.`);
    process.exitCode = 1;
    return;
  }

  // ручной каталог не имеет googlePlaceId — дополнительная страховка от дубля
  const duplicate = await findLikelyDuplicate(city.id, skeleton);
  if (duplicate && !force) {
    console.error(
      `\nПохоже, это место уже есть в каталоге: «${duplicate.name}» (${duplicate.slug}) —\n` +
        `совпадает название или точка ближе ${DUPLICATE_RADIUS_M} м. Дубль страшнее потери,\n` +
        `поэтому не записываю. Если это ТОЧНО другое место — повторите с --force.`,
    );
    process.exitCode = 1;
    return;
  }

  // не тот город? (--city указывает каталог, но Google-место может быть где
  // угодно — например, филиал той же сети в Бангкоке)
  if (
    city.latitude !== null &&
    city.longitude !== null &&
    haversineMeters(
      { latitude: skeleton.latitude, longitude: skeleton.longitude },
      { latitude: city.latitude, longitude: city.longitude },
    ) > CITY_RADIUS_M
  ) {
    console.warn(
      `\n⚠ Координаты места дальше ${CITY_RADIUS_M / 1000} км от центра города «${citySlug}».\n` +
        `  Проверьте, что выбран не филиал в другом городе. Запись продолжаю.`,
    );
  }

  const slug = await ensureUniqueSlug(city.id, slugifyPlaceName(skeleton.name));

  const place = await prisma.place.create({
    data: {
      name: skeleton.name,
      slug,
      address: skeleton.address,
      latitude: skeleton.latitude,
      longitude: skeleton.longitude,
      googleMapsUrl: skeleton.googleMapsUrl,
      googlePlaceId: skeleton.googlePlaceId,
      sourceType: "IMPORT",
      // черновик: на сайт не попадает до одобрения человеком
      status: "PENDING",
      indoor: false,
      outdoor: false,
      cityId: city.id,
      schedules: { createMany: { data: skeleton.schedules } },
      contacts: {
        createMany: {
          data: skeleton.contacts.map((contact, index) => ({
            type: contact.type,
            value: contact.value,
            order: index + 1,
          })),
        },
      },
    },
  });

  console.log(`\n✓ Черновик создан: ${place.slug} (PENDING, sourceType IMPORT)`);
  console.log(`\nДальше руками (уникальная ценность — не из Google):`);
  console.log(
    `  • ⚠ В ПЕРВУЮ ОЧЕРЕДЬ: «В помещении / На улице» — в черновике оба стоят\n` +
      `    «нет», но это заглушка модели, а не проверенный факт`,
  );
  console.log(
    `  • описание RU/EN, категории (подсказка: ${skeleton.googleTypes.join(", ") || "—"})`,
  );
  console.log(`  • tri-state признаки (AC/Wi-Fi/розетки/…) — сейчас «уточняется»`);
  console.log(`  • возраст, советы «Полезно знать», цены, фото (только свои!)`);
  console.log(`  • проверить часы на месте — Google бывает устаревшим`);
  console.log(
    `  • одобрить: /admin/places → статус APPROVED (npm run gaps ведёт пробелы,\n` +
      `    включая непроверенные In/Outdoor у импортированных мест)`,
  );
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (!args.query && !args.placeId) {
    console.error(
      `Использование:\n` +
        `  npm run import:place -- "название или ссылка на карточку Maps"   — поиск кандидатов\n` +
        `  npm run import:place -- --id=ChIJ...                             — превью скелета\n` +
        `  npm run import:place -- --id=ChIJ... --write [--city=pattaya]    — записать черновик\n` +
        `  … --write --force   — записать, даже если похожее место уже есть в каталоге`,
    );
    process.exitCode = 1;
    return;
  }

  if (args.write && !args.placeId) {
    console.error(
      `--write требует явный --id=ChIJ… (запись только выбранного места — не «первого попавшегося»).\n` +
        `Сначала прогон без --write: он покажет кандидатов и их Place ID.`,
    );
    process.exitCode = 1;
    return;
  }

  // Прямой путь: есть Place ID → детали → скелет
  if (args.placeId) {
    const details = await getPlaceDetails(args.placeId);
    const skeleton = mapGooglePlaceToSkeleton(details);
    if (!skeleton) {
      console.error(`Google вернул место без id/названия — импортировать нечего.`);
      process.exitCode = 1;
      return;
    }
    printSkeleton(skeleton);
    if (args.write) {
      await writeSkeleton(skeleton, args.citySlug, args.force);
    } else {
      console.log(
        `\nDry-run: ничего не записано. Записать черновик:\n` +
          `  npm run import:place -- --id=${skeleton.googlePlaceId} --write`,
      );
    }
    return;
  }

  // Поисковый путь: текст или ссылка на карточку Maps → кандидаты
  const fromUrl = parseGoogleMapsUrl(args.query as string);
  const query = fromUrl?.query ?? (args.query as string);
  const bias =
    fromUrl && fromUrl.latitude !== null && fromUrl.longitude !== null
      ? { latitude: fromUrl.latitude, longitude: fromUrl.longitude }
      : undefined;

  console.log(
    `Ищу: «${query}»${bias ? ` рядом с ${bias.latitude}, ${bias.longitude}` : ""}…`,
  );
  const candidates = await searchPlacesByText(query, bias);
  if (candidates.length === 0) {
    console.log(`Ничего не нашлось. Уточните запрос (добавьте город/район).`);
    return;
  }

  console.log(
    `\nКандидаты (${Math.min(candidates.length, MAX_CANDIDATES_SHOWN)} из ${candidates.length}):`,
  );
  for (const candidate of candidates.slice(0, MAX_CANDIDATES_SHOWN)) {
    console.log(`  • ${candidate.displayName?.text ?? "—"}`);
    console.log(`    ${candidate.formattedAddress ?? "адрес неизвестен"}`);
    console.log(`    --id=${candidate.id ?? "—"}`);
  }
  console.log(
    `\nДальше: превью скелета выбранного места\n` +
      `  npm run import:place -- --id=<Place ID из списка>`,
  );
}

/** Типовые ошибки Google — по-русски: CLI пользуется не разработчик. */
function explainError(error: unknown): string {
  if (error instanceof GooglePlacesApiError) {
    if (error.status === 403) {
      return (
        `Google не принял ключ (403). Проверьте GOOGLE_PLACES_API_KEY в .env и что\n` +
        `в проекте включён именно Places API (New) — пошагово: docs/DATA_ENGINE.md.`
      );
    }
    if (error.status === 404) {
      return `Место с таким --id не нашлось (404). Проверьте, что Place ID скопирован целиком.`;
    }
    if (error.status === 429) {
      return `Google ограничил частоту запросов (429). Подождите минуту и повторите.`;
    }
    return error.message;
  }
  return error instanceof Error ? error.message : String(error);
}

main()
  .catch((error) => {
    console.error(explainError(error));
    process.exitCode = 1;
  })
  .finally(() => prismaModule?.prisma.$disconnect());
