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
 */

import { prisma } from "../../src/db/prisma";
import {
  getPlaceDetails,
  searchPlacesByText,
} from "../../src/lib/import/google-places-client";
import {
  mapGooglePlaceToSkeleton,
  parseGoogleMapsUrl,
  slugifyPlaceName,
  type PlaceSkeleton,
} from "../../src/lib/import/place-skeleton";

const DEFAULT_CITY_SLUG = "pattaya";
/// сколько кандидатов поиска показываем (полный список загромождает терминал)
const MAX_CANDIDATES_SHOWN = 5;

type CliArgs = {
  query: string | null;
  placeId: string | null;
  write: boolean;
  citySlug: string;
};

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    query: null,
    placeId: null,
    write: false,
    citySlug: DEFAULT_CITY_SLUG,
  };
  for (const arg of argv) {
    if (arg === "--write") {
      args.write = true;
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

async function writeSkeleton(skeleton: PlaceSkeleton, citySlug: string): Promise<void> {
  // дедуп по каноническому Google Place ID — то, ради чего он в схеме
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
    `  • описание RU/EN, категории (подсказка: ${skeleton.googleTypes.join(", ") || "—"})`,
  );
  console.log(`  • indoor/outdoor, tri-state признаки (AC/Wi-Fi/розетки/…)`);
  console.log(`  • возраст, советы «Полезно знать», цены, фото (только свои!)`);
  console.log(`  • проверить часы на месте — Google бывает устаревшим`);
  console.log(
    `  • одобрить: /admin/places → статус APPROVED (npm run gaps напомнит пробелы)`,
  );
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (!args.query && !args.placeId) {
    console.error(
      `Использование:\n` +
        `  npm run import:place -- "название или ссылка на карточку Maps"   — поиск кандидатов\n` +
        `  npm run import:place -- --id=ChIJ...                             — превью скелета\n` +
        `  npm run import:place -- --id=ChIJ... --write [--city=pattaya]    — записать черновик`,
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
      await writeSkeleton(skeleton, args.citySlug);
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

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
