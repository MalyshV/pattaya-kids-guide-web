/**
 * Ядро посадочной: «Что ищете прямо сейчас?» и три живых ответа-сценария.
 *
 * Чистые функции без БД и React — покрываются тестами напрямую:
 *  - слот времени суток (утро/день/вечер/ночь) из минут местного времени;
 *  - приоритет сценариев на слот (будни/выходные различаются);
 *  - порог честности: сценарий мест попадает в ротацию, только если под ним
 *    достаточно карточек (красивый ответ с пустой выдачей — худшее обещание);
 *  - кольцевая тройка для кнопки «показать другие».
 *
 * Набор СТАБИЛЕН внутри слота (решение: предсказуемость при повторном заходе,
 * новизна — только по явному нажатию «показать другие»).
 */

export type ScenarioKey =
  | "age"
  | "workFriendly"
  | "openMorning"
  | "openNow"
  | "shelter"
  | "events"
  | "birthdays"
  | "near";

export type LandingSlot = "morning" | "day" | "evening" | "night";

/** Порог честности: меньше карточек — сценарий выбывает из ротации. */
export const MIN_SCENARIO_PLACES = 3;

/** Порог разделов (события/ДР/развивашки): раздел честен и с одной записью,
 *  но пустым обещать нечего. */
export const MIN_SECTION_ITEMS = 1;

/** Сколько ответов видно одновременно. */
export const VISIBLE_SCENARIOS = 3;

/** Слот по минутам местного времени города (nowInCity возвращает minutes). */
export function landingSlot(minutes: number): LandingSlot {
  if (minutes >= 5 * 60 && minutes < 12 * 60) {
    return "morning";
  }
  if (minutes >= 12 * 60 && minutes < 17 * 60) {
    return "day";
  }
  if (minutes >= 17 * 60 && minutes < 23 * 60) {
    return "evening";
  }
  return "night";
}

export function isWeekendDay(day: string): boolean {
  return day === "SAT" || day === "SUN";
}

/**
 * Полный пул на слот в порядке приоритета: первые три (прошедшие порог) —
 * видимая тройка, дальше листает «показать другие». Ночью «пойти сейчас»
 * в конце (всё закрыто) — сверху планирование завтрашнего утра.
 */
const WEEKDAY_PRIORITY: Record<LandingSlot, ScenarioKey[]> = {
  morning: [
    "age",
    "workFriendly",
    "openMorning",
    "openNow",
    "shelter",
    "events",
    "birthdays",
    "near",
  ],
  day: [
    "openNow",
    "shelter",
    "age",
    "workFriendly",
    "events",
    "near",
    "birthdays",
    "openMorning",
  ],
  evening: [
    "openNow",
    "events",
    "age",
    "shelter",
    "near",
    "birthdays",
    "workFriendly",
    "openMorning",
  ],
  night: [
    "openMorning",
    "age",
    "events",
    "birthdays",
    "workFriendly",
    "shelter",
    "openNow",
    "near",
  ],
};

/** Выходные: меньше «поработать», больше «всей семьёй» и праздников. */
const WEEKEND_PRIORITY: Record<LandingSlot, ScenarioKey[]> = {
  morning: [
    "openNow",
    "events",
    "age",
    "openMorning",
    "birthdays",
    "near",
    "shelter",
    "workFriendly",
  ],
  day: [
    "openNow",
    "birthdays",
    "events",
    "shelter",
    "age",
    "near",
    "workFriendly",
    "openMorning",
  ],
  evening: [
    "events",
    "openNow",
    "near",
    "age",
    "shelter",
    "birthdays",
    "workFriendly",
    "openMorning",
  ],
  night: WEEKDAY_PRIORITY.night,
};

export function scenarioPriority(slot: LandingSlot, isWeekend: boolean): ScenarioKey[] {
  return isWeekend ? WEEKEND_PRIORITY[slot] : WEEKDAY_PRIORITY[slot];
}

/**
 * Пул после порога честности. counts — сценарии мест (порог 3+ карточек),
 * sectionCounts — разделы: события/ДР/развивашки (порог 1+ — раздел честен
 * и с одной записью, но пустая афиша — то самое «красивое обещание без
 * выдачи»). Сценарий без записи в обоих словарях не режется (near —
 * сортировка над непустым каталогом).
 */
export function eligibleScenarios(
  priority: ScenarioKey[],
  counts: Partial<Record<ScenarioKey, number>>,
  sectionCounts: Partial<Record<ScenarioKey, number>> = {},
): ScenarioKey[] {
  return priority.filter((key) => {
    const count = counts[key];
    if (count !== undefined) {
      return count >= MIN_SCENARIO_PLACES;
    }
    const sectionCount = sectionCounts[key];
    return sectionCount === undefined || sectionCount >= MIN_SECTION_ITEMS;
  });
}

/**
 * 23:00–23:59: «сегодня» в расписаниях — ещё уходящий день, а ночной слот
 * смотрит в завтра. Чтобы не обещать «открыто с утра» по данным уходящего
 * дня (и не вести в каталог, который фильтрует по нему же), openMorning на
 * этот час выпадает; после полуночи день переключается и сценарий
 * возвращается уже корректным.
 */
export function dropLateNightMorning(
  pool: ScenarioKey[],
  slot: LandingSlot,
  minutes: number,
): ScenarioKey[] {
  if (slot !== "night" || minutes < 23 * 60) {
    return pool;
  }
  return pool.filter((key) => key !== "openMorning");
}

/**
 * Видимая тройка с кольцевым сдвигом: offset=0 — первые три, каждое
 * «показать другие» сдвигает на тройку дальше по кругу. Пул короче трёх —
 * показываем что есть (без повторов).
 */
export function visibleScenarios(pool: ScenarioKey[], offset: number): ScenarioKey[] {
  if (pool.length <= VISIBLE_SCENARIOS) {
    return pool;
  }
  const start = (offset * VISIBLE_SCENARIOS) % pool.length;
  const result: ScenarioKey[] = [];
  for (let i = 0; i < VISIBLE_SCENARIOS; i += 1) {
    result.push(pool[(start + i) % pool.length]);
  }
  return result;
}

type ScenarioPlaceFacts = {
  hasWifi: boolean | null;
  hasAirCon: boolean | null;
  hasCafeSeating: boolean | null;
  indoor: boolean | null;
  hasCoveredArea: boolean | null;
  hasFans: boolean | null;
};

/**
 * In-memory зеркала композитов из buildApprovedPlacesWhere (places-where.ts):
 * посадочная считает места по уже выбранному списку, без лишних запросов.
 * Меняешь композит там — поменяй здесь (оба покрыты тестами).
 */
export function isWorkFriendlyPlace(place: ScenarioPlaceFacts): boolean {
  return (
    place.hasWifi === true && place.hasAirCon === true && place.hasCafeSeating === true
  );
}

export function isShelterPlace(place: ScenarioPlaceFacts): boolean {
  const covered = place.indoor === true || place.hasCoveredArea === true;
  const cooled = place.hasAirCon === true || place.hasFans === true;
  return covered && cooled;
}

/** Возраст в годах из крутилки → корзина каталога (?age=). */
export function yearsToAgeBucket(years: number): string {
  if (years < 1) {
    return "0-1";
  }
  if (years < 3) {
    return "1-3";
  }
  if (years < 6) {
    return "3-6";
  }
  return "6-12";
}
