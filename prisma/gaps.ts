import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import type { PlaceClass, PlaceProgram } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Трекер пробелов в данных: `npm run gaps`.
 *
 * Печатает по каждому реальному месту чек-лист «что осталось узнать» —
 * непроверенные факты (null, а не false) и программы без цены. Обратная сторона
 * честного «уточняется» на сайте: то, что мы не выдаём за «нет», здесь собрано
 * в один список для сбора. Демо-места пропускаем — они не про реальные данные.
 * Отдельной секцией — пробелы переводов: EN обязателен (без него en- и
 * th-версии молча показывают русский), TH — мягко (каскад th → en → ru,
 * см. src/lib/i18n/localize.ts).
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

// ПЕРЕВОДЫ. Контент хранится тройками полей (name + nameEn + nameTh и т.п.)
// с каскадом th → en → ru (src/lib/i18n/localize.ts). Отсюда два яруса:
//  • нет EN при заполненном ru — настоящий пробел (обе неродные версии
//    показывают русский), идёт в общий счётчик;
//  • нет TH при готовом EN — мягкий (th-версия покажет английский; бренды
//    намеренно остаются латиницей), только справочная сводка в конце.

/** Заполнено ли значение: null и пустая строка считаются пробелом. */
function isFilled(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim() !== "";
}

/** Тройка для проверки перевода: русская метка поля + значения ru/en/th. */
type TranslationTriple = [
  label: string,
  ru: string | null | undefined,
  en: string | null | undefined,
  th: string | null | undefined,
];

/**
 * Проверка троек: missingEn — метки полей без EN (жёсткие пробелы),
 * softTh — сколько полей без TH при готовом EN (мягкие, не в счётчик).
 */
function checkTranslations(triples: TranslationTriple[]): {
  missingEn: string[];
  softTh: number;
} {
  const missingEn: string[] = [];
  let softTh = 0;
  for (const [label, ru, en, th] of triples) {
    if (isFilled(ru) && !isFilled(en)) {
      missingEn.push(label);
    }
    if (isFilled(en) && !isFilled(th)) {
      softTh += 1;
    }
  }
  return { missingEn, softTh };
}

/** «совет ×3», но без «×1» — единичный пробел читается без счётчика. */
function withCount(label: string, count: number): string {
  return count > 1 ? `${label} ×${count}` : label;
}

/**
 * Пробелы переводов программы вместе с её классами. Классы сворачиваем в
 * счётчики («классы: расписание ×8») — перечислять каждый было бы простынёй.
 */
function programTranslationGaps(program: PlaceProgram & { classes: PlaceClass[] }): {
  parts: string[];
  enCount: number;
  softTh: number;
} {
  const own = checkTranslations([
    ["название", program.name, program.nameEn, program.nameTh],
    ["описание", program.description, program.descriptionEn, program.descriptionTh],
    ["подпись цены", program.priceUnit, program.priceUnitEn, program.priceUnitTh],
    ["площадка", program.venueName, program.venueNameEn, program.venueNameTh],
  ]);
  const parts = [...own.missingEn];
  let enCount = own.missingEn.length;
  let softTh = own.softTh;

  let ageGaps = 0;
  let scheduleGaps = 0;
  for (const cls of program.classes) {
    const clsChecked = checkTranslations([
      ["возраст", cls.ageLabel, cls.ageLabelEn, cls.ageLabelTh],
      ["расписание", cls.schedule, cls.scheduleEn, cls.scheduleTh],
    ]);
    ageGaps += clsChecked.missingEn.includes("возраст") ? 1 : 0;
    scheduleGaps += clsChecked.missingEn.includes("расписание") ? 1 : 0;
    softTh += clsChecked.softTh;
  }
  const classParts: string[] = [];
  if (ageGaps > 0) {
    classParts.push(withCount("возраст", ageGaps));
  }
  if (scheduleGaps > 0) {
    classParts.push(withCount("расписание", scheduleGaps));
  }
  if (classParts.length > 0) {
    parts.push(`классы: ${classParts.join(", ")}`);
  }
  enCount += ageGaps + scheduleGaps;

  return { parts, enCount, softTh };
}

async function main(): Promise<void> {
  const places = await prisma.place.findMany({
    where: {
      status: "APPROVED",
      NOT: { name: { startsWith: "[Демо]" } },
    },
    orderBy: { name: "asc" },
    include: {
      programs: {
        orderBy: { order: "asc" },
        include: { classes: { orderBy: { order: "asc" } } },
      },
      birthdayInfo: true,
      photos: true,
      tips: { orderBy: { order: "asc" } },
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

  // Переводы: жёсткие EN-пробелы построчно (в счётчик), мягкие TH — одной
  // сводкой в конце. У Place нет nameEn/nameTh — названия мест и так бренды.
  console.log("🌐 Переводы");
  console.log("   (без EN — и en-, и th-версия молча показывают русский)\n");

  let translationGaps = 0;
  let softThGaps = 0;
  // места с EN-пробелами: не должны попасть в «✓ Без пробелов» ниже
  const placesWithTranslationGaps = new Set<string>();

  for (const place of places) {
    const items: string[] = [];
    let enCount = 0;

    const own = checkTranslations([
      ["описание", place.description, place.descriptionEn, place.descriptionTh],
      [
        "подпись к ценам входа",
        place.entryPriceNote,
        place.entryPriceNoteEn,
        place.entryPriceNoteTh,
      ],
    ]);
    items.push(...own.missingEn);
    enCount += own.missingEn.length;
    softThGaps += own.softTh;

    let tipGaps = 0;
    for (const tip of place.tips) {
      const tipChecked = checkTranslations([["совет", tip.text, tip.textEn, tip.textTh]]);
      tipGaps += tipChecked.missingEn.length;
      softThGaps += tipChecked.softTh;
    }
    if (tipGaps > 0) {
      items.push(withCount("совет", tipGaps));
      enCount += tipGaps;
    }

    for (const program of place.programs) {
      const programChecked = programTranslationGaps(program);
      softThGaps += programChecked.softTh;
      if (programChecked.parts.length > 0) {
        items.push(`программа ${program.name}: ${programChecked.parts.join(", ")}`);
        enCount += programChecked.enCount;
      }
    }

    if (place.birthdayInfo) {
      const birthdayChecked = checkTranslations([
        [
          "день рождения: заметки",
          place.birthdayInfo.notes,
          place.birthdayInfo.notesEn,
          place.birthdayInfo.notesTh,
        ],
      ]);
      items.push(...birthdayChecked.missingEn);
      enCount += birthdayChecked.missingEn.length;
      softThGaps += birthdayChecked.softTh;
    }

    if (items.length > 0) {
      console.log(`▸ ${place.name} — без EN: ${items.join("; ")}`);
      translationGaps += enCount;
      placesWithTranslationGaps.add(place.name);
    }
  }

  // События: реальные (не демо), включая прошедшие — их страницы живут дальше
  const eventsForTranslations = await prisma.event.findMany({
    where: { status: "APPROVED", isDemo: false },
    orderBy: { startDate: "asc" },
    select: {
      title: true,
      titleEn: true,
      titleTh: true,
      description: true,
      descriptionEn: true,
      descriptionTh: true,
      locationName: true,
      locationNameEn: true,
      locationNameTh: true,
    },
  });
  for (const event of eventsForTranslations) {
    const eventChecked = checkTranslations([
      ["название", event.title, event.titleEn, event.titleTh],
      ["описание", event.description, event.descriptionEn, event.descriptionTh],
      ["площадка", event.locationName, event.locationNameEn, event.locationNameTh],
    ]);
    softThGaps += eventChecked.softTh;
    if (eventChecked.missingEn.length > 0) {
      console.log(
        `▸ Событие ${event.title} — без EN: ${eventChecked.missingEn.join("; ")}`,
      );
      translationGaps += eventChecked.missingEn.length;
    }
  }

  // Занятия без каталожного места — в цикл по местам не попадают
  const standalonePrograms = await prisma.placeProgram.findMany({
    where: { placeId: null, isDemo: false },
    orderBy: { name: "asc" },
    include: { classes: { orderBy: { order: "asc" } } },
  });
  for (const program of standalonePrograms) {
    const programChecked = programTranslationGaps(program);
    softThGaps += programChecked.softTh;
    if (programChecked.parts.length > 0) {
      console.log(
        `▸ Занятие ${program.name} — без EN: ${programChecked.parts.join("; ")}`,
      );
      translationGaps += programChecked.enCount;
    }
  }

  // Справочники маленькие — проверяем целиком, выводим сжатым перечнем
  const [
    categories,
    eventCategories,
    activityCategories,
    amenities,
    ageGroups,
    languages,
    cities,
  ] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.eventCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.activityCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.amenity.findMany({ orderBy: { name: "asc" } }),
    prisma.ageGroup.findMany({ orderBy: { minAge: "asc" } }),
    prisma.language.findMany({ orderBy: { code: "asc" } }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
  ]);
  const referenceGroups: Array<
    [
      label: string,
      rows: Array<{ name: string; nameEn: string | null; nameTh: string | null }>,
    ]
  > = [
    ["категории мест", categories],
    ["категории событий", eventCategories],
    ["категории занятий", activityCategories],
    ["удобства", amenities],
    ["возрастные группы", ageGroups],
    ["языки", languages],
    ["города", cities],
  ];
  const referenceLines: string[] = [];
  for (const [label, rows] of referenceGroups) {
    const missing: string[] = [];
    for (const row of rows) {
      if (isFilled(row.name) && !isFilled(row.nameEn)) {
        missing.push(row.name);
      }
      if (isFilled(row.nameEn) && !isFilled(row.nameTh)) {
        softThGaps += 1;
      }
    }
    if (missing.length > 0) {
      referenceLines.push(`${label}: ${missing.join(", ")}`);
      translationGaps += missing.length;
    }
  }
  if (referenceLines.length > 0) {
    console.log(`▸ Справочники — без EN:`);
    for (const line of referenceLines) {
      console.log(`   • ${line}`);
    }
  }

  if (translationGaps === 0) {
    console.log("✓ Пробелов EN нет.");
  }
  totalGaps += translationGaps;

  if (softThGaps > 0) {
    console.log(
      `\nℹ Без TH при готовом EN: ${softThGaps} поле(й) — th-версия покажет английский.`,
    );
    console.log("  Для брендов это намеренно (латиница), в счётчик не идёт.");
  }
  console.log("");

  if (totalGaps === 0) {
    console.log("🎉 Все места заполнены — пробелов нет.\n");
  } else {
    console.log(`— Итого: ${totalGaps} пробел(ов) в ${placesWithGaps} мест(ах).`);
    // «без пробелов» — честно только когда закрыты и факты, и EN-переводы:
    // иначе место стояло бы одновременно в этой строке и в секции «Переводы»
    const fullyComplete = complete.filter((name) => !placesWithTranslationGaps.has(name));
    if (fullyComplete.length > 0) {
      console.log(`✓ Без пробелов: ${fullyComplete.join(", ")}.`);
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
