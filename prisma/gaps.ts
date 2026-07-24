import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Трекер пробелов в данных: `npm run gaps`.
 *
 * Печатает по каждому реальному месту чек-лист «что осталось узнать» —
 * непроверенные факты (null, а не false) и программы без цены. Обратная сторона
 * честного «уточняется» на сайте: то, что мы не выдаём за «нет», здесь собрано
 * в один список для сбора. Демо-места пропускаем — они не про реальные данные.
 */

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// Признаки-факты места (nullable): null = ещё не проверено = пробел.
const FACT_LABELS: Record<string, string> = {
  hasFood: "Еда",
  hasWifi: "Wi-Fi",
  canLeaveChild: "Можно оставить ребёнка",
  animalContact: "Животные",
  hasAirCon: "Кондиционер",
  hasParking: "Парковка",
  hasCafeSeating: "Есть где посидеть",
  hasPowerOutlets: "Розетки",
  hasCoveredArea: "Навесы / крытые зоны",
  hasFans: "Вентиляторы",
};

const PROGRAM_TYPE_LABELS: Record<string, string> = {
  CAMP: "Лагерь",
  MEMBERSHIP: "Абонемент",
  COURSE: "Занятия",
};

async function main(): Promise<void> {
  const places = await prisma.place.findMany({
    where: {
      status: "APPROVED",
      NOT: { name: { startsWith: "[Демо]" } },
    },
    orderBy: { name: "asc" },
    include: {
      programs: { orderBy: { order: "asc" } },
      birthdayInfo: true,
      photos: true,
    },
  });

  console.log("\n📋 Пробелы в данных — что осталось собрать");
  console.log("   (демо-места пропущены)\n");

  let totalGaps = 0;
  let placesWithGaps = 0;
  const complete: string[] = [];

  for (const place of places) {
    const gaps: string[] = [];

    for (const [field, label] of Object.entries(FACT_LABELS)) {
      if (place[field as keyof typeof place] === null) {
        gaps.push(label);
      }
    }

    if (place.googleMapsUrl === null) {
      gaps.push("Ссылка на Google Maps");
    }

    // Можно оставить ребёнка, но с какого возраста — не уточнено
    if (place.canLeaveChild === true && place.leaveChildFromMonths === null) {
      gaps.push("Возраст, с которого можно оставить ребёнка");
    }

    for (const program of place.programs) {
      if (program.price === null) {
        const typeLabel = PROGRAM_TYPE_LABELS[program.type] ?? program.type;
        gaps.push(`Цена: «${program.name}» (${typeLabel})`);
      }
    }

    // ДР подтверждён, но условия (депозит/гости/пакеты) не собраны
    if (place.birthdayInfo?.hasPackages && place.birthdayInfo.depositRequired === null) {
      gaps.push("День рождения: пакеты, цены и условия");
    }

    // Импортированное место: indoor/outdoor в модели non-null, поэтому черновик
    // получает «нет/нет» как заглушку — false здесь НЕ проверенный факт
    if (place.sourceType === "IMPORT" && !place.indoor && !place.outdoor) {
      gaps.push("В помещении / На улице — не проверены (заглушка импорта)");
    }

    // Медиа-права: у фото не зафиксировано происхождение
    const photosWithoutRights = place.photos.filter((photo) => photo.source === null);
    if (photosWithoutRights.length > 0) {
      gaps.push(
        `Происхождение ${photosWithoutRights.length} фото галереи (source/rightsNote)`,
      );
    }
    if (place.imageUrl !== null && place.imageRightsNote === null) {
      gaps.push("Права на обложку (imageRightsNote)");
    }

    if (gaps.length === 0) {
      complete.push(place.name);
      continue;
    }

    placesWithGaps += 1;
    totalGaps += gaps.length;

    console.log(`▸ ${place.name}`);
    for (const gap of gaps) {
      console.log(`   • ${gap}`);
    }
    console.log("");
  }

  // События без возраста: не попадают под фильтр «Сколько лет ребёнку?»
  // осмысленно (показываются всем — честно, но неточно). Только актуальные:
  // прошедшим возраст уже ни к чему.
  const eventsWithoutAge = await prisma.event.findMany({
    where: {
      status: "APPROVED",
      isDemo: false,
      minAgeMonths: null,
      maxAgeMonths: null,
      OR: [{ startDate: { gt: new Date() } }, { endDate: { gte: new Date() } }],
    },
    orderBy: { startDate: "asc" },
    select: { title: true, slug: true },
  });
  if (eventsWithoutAge.length > 0) {
    console.log(`▸ События без возраста (фильтр показывает их всем):`);
    for (const event of eventsWithoutAge) {
      console.log(`   • ${event.title} (${event.slug})`);
    }
    console.log("");
    totalGaps += eventsWithoutAge.length;
  }

  // Гео-пробелы для единой карты: событие без координат (своих или через
  // место) и занятие без каталожного места и без venue-координат на карту
  // не встанут — их пин просто не появится.
  const eventsWithoutGeo = await prisma.event.findMany({
    where: { status: "APPROVED", latitude: null, placeId: null },
    orderBy: { startDate: "asc" },
    select: { title: true, slug: true, locationName: true },
  });
  if (eventsWithoutGeo.length > 0) {
    console.log(`▸ События без координат (не попадут на карту):`);
    for (const event of eventsWithoutGeo) {
      console.log(
        `   • ${event.title} (${event.slug}) — площадка: ${event.locationName ?? "не указана"}`,
      );
    }
    console.log("");
    totalGaps += eventsWithoutGeo.length;
  }

  const programsWithoutGeo = await prisma.placeProgram.findMany({
    where: { placeId: null, venueLatitude: null },
    orderBy: { name: "asc" },
    select: { name: true, slug: true, venueName: true },
  });
  if (programsWithoutGeo.length > 0) {
    console.log(`▸ Занятия без координат площадки (не попадут на карту):`);
    for (const program of programsWithoutGeo) {
      console.log(
        `   • ${program.name} (${program.slug ?? "без страницы"}) — площадка: ${program.venueName ?? "не указана"}`,
      );
    }
    console.log("");
    totalGaps += programsWithoutGeo.length;
  }

  // Черновики движка данных: импортированы, но ещё не проверены человеком.
  // Они вне цикла выше (тот смотрит APPROVED) — напоминаем отдельно.
  const pendingImports = await prisma.place.findMany({
    where: { status: "PENDING", sourceType: "IMPORT" },
    orderBy: { createdAt: "asc" },
    select: { name: true, slug: true },
  });
  if (pendingImports.length > 0) {
    console.log(`⏳ Черновики импорта ждут проверки и одобрения (/admin/places):`);
    for (const draft of pendingImports) {
      console.log(`   • ${draft.name} (${draft.slug})`);
    }
    console.log("");
  }

  if (totalGaps === 0) {
    console.log("🎉 Все места заполнены — пробелов нет.\n");
  } else {
    console.log(`— Итого: ${totalGaps} пробел(ов) в ${placesWithGaps} мест(ах).`);
    if (complete.length > 0) {
      console.log(`✓ Без пробелов: ${complete.join(", ")}.`);
    }
    console.log("");
  }
}

main()
  .catch((e) => {
    console.error("❌ Gaps error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
