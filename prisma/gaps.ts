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
    include: { programs: { orderBy: { order: "asc" } } },
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

    for (const program of place.programs) {
      if (program.price === null) {
        const typeLabel = PROGRAM_TYPE_LABELS[program.type] ?? program.type;
        gaps.push(`Цена: «${program.name}» (${typeLabel})`);
      }
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
