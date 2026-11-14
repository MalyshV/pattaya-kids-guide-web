/**
 * Наполнение карточки места из подготовленной партии: что из заготовки можно
 * записать, не затерев сделанное руками. Чистые функции (без БД) — раннер
 * заноса только читает состояние места и исполняет план.
 *
 * Главное правило — «заполняем только пустое»:
 * - описание пишем, если его нет или там пометка «[черновик]» из сбора;
 * - советы, часы, цены, категории — только если у места их ещё нет;
 * - признак («кондиционер», «парковка»…) ставим, только пока он «уточняется»;
 *   «в помещении» / «на улице» по умолчанию false, поэтому их только включаем;
 * - обложку ставим, только если её нет; галерею — только если в ней пусто.
 * Всё, что уже заполнено в админке, остаётся как есть и попадает в skipped —
 * раннер покажет это в отчёте. Повторный запуск ничего не меняет.
 */

import type { ContactRow } from "./contact-sync";

export const FILL_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
export type FillDay = (typeof FILL_DAYS)[number];

/** Часы по дням; дня нет в объекте — «не знаем», он не показывается. */
export type FillHours = Partial<
  Record<FillDay, { open: string; close: string } | "closed">
>;

export const FILL_FLAGS = [
  "indoor",
  "outdoor",
  "hasAirCon",
  "hasFood",
  "hasParking",
  "hasWifi",
  "hasCafeSeating",
  "hasPowerOutlets",
  "hasCoveredArea",
  "hasFans",
  "animalContact",
  "canLeaveChild",
] as const;
export type FillFlag = (typeof FILL_FLAGS)[number];
export type FillFlags = Partial<Record<FillFlag, boolean>>;

/// «в помещении» и «на улице» в базе не бывают «уточняется»: только да/нет
const DEFAULT_FALSE_FLAGS: ReadonlySet<FillFlag> = new Set(["indoor", "outdoor"]);

export type FillEntryRow = {
  label: string;
  labelEn: string;
  /// цена в колонке «Ребёнок» (null — пусто)
  child: number | null;
  /// цена в колонке «Взрослый» (null — пусто)
  adult: number | null;
};

export type FillTip = { text: string; textEn: string };

/** Обложка: путь в public и строка-провенанс (кто снял, когда). */
export type FillCover = { url: string; rightsNote: string };

/** Фото галереи: путь в public и подпись. Права — общие с обложкой (photoRightsNote). */
export type FillPhoto = { url: string; caption: string };

export type PlaceFill = {
  slug: string;
  /// описания нет в заготовке — она только дополняет карточку (например, фото)
  description?: string;
  descriptionEn?: string;
  tips?: readonly FillTip[];
  hours?: FillHours;
  flags?: FillFlags;
  /// с какого возраста можно оставить ребёнка (вместе с canLeaveChild: true)
  leaveChildFromMonths?: number;
  categorySlugs?: readonly string[];
  /// вход бесплатный (таблицы цен нет)
  free?: boolean;
  entryRows?: readonly FillEntryRow[];
  /// подпись под таблицей цен
  note?: string;
  noteEn?: string;
  contacts?: readonly ContactRow[];
  /// типы контактов, которые заменяем целиком (старые значения убираем)
  replaceTypes?: readonly string[];
  /// обложка места (файл уже лежит в public/images/places)
  cover?: FillCover;
  /// галерея; провенанс один на все снимки — photoRightsNote
  photos?: readonly FillPhoto[];
  photoRightsNote?: string;
  /// чьи снимки галереи: свои (по умолчанию) или со страниц самого места
  photoSource?: "OWN" | "PLACE_OWNER";
};

/** Что сейчас у места в базе — ровно то, что нужно для решения. */
export type PlaceFillState = {
  description: string | null;
  tipsCount: number;
  scheduleCount: number;
  entryPriceCount: number;
  pricingCount: number;
  categoryCount: number;
  flags: Record<FillFlag, boolean | null>;
  leaveChildFromMonths: number | null;
  imageUrl: string | null;
  photoCount: number;
};

export type ScheduleRow = {
  day: FillDay;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export type PlaceFillPlan = {
  description: boolean;
  tips: boolean;
  schedule: ScheduleRow[] | null;
  flags: FillFlags;
  leaveChildFromMonths: number | null;
  categories: boolean;
  free: boolean;
  entryRows: boolean;
  cover: boolean;
  photos: boolean;
  /// что в заготовке было, но не записано: у места это уже заполнено
  skipped: string[];
};

const DRAFT_MARK = "[черновик]";

/** Описания нет или в нём служебная пометка сбора — его можно заменить. */
export function isDraftDescription(value: string | null | undefined): boolean {
  const text = (value ?? "").trim();
  return text === "" || text.includes(DRAFT_MARK);
}

/** Часы заготовки → строки расписания в порядке дней недели. */
export function scheduleRows(hours: FillHours): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  for (const day of FILL_DAYS) {
    const value = hours[day];
    if (value === undefined) {
      continue;
    }
    rows.push(
      value === "closed"
        ? { day, openTime: "", closeTime: "", isClosed: true }
        : { day, openTime: value.open, closeTime: value.close, isClosed: false },
    );
  }
  return rows;
}

export function planPlaceFill(state: PlaceFillState, fill: PlaceFill): PlaceFillPlan {
  const skipped: string[] = [];

  const hasDescription = fill.description !== undefined;
  const description = hasDescription && isDraftDescription(state.description);
  if (hasDescription && !description) {
    skipped.push("описание");
  }

  const hasTips = (fill.tips?.length ?? 0) > 0;
  const tips = hasTips && state.tipsCount === 0;
  if (hasTips && !tips) {
    skipped.push("советы");
  }

  const rows = fill.hours ? scheduleRows(fill.hours) : [];
  const schedule = rows.length > 0 && state.scheduleCount === 0 ? rows : null;
  if (rows.length > 0 && !schedule) {
    skipped.push("часы");
  }

  const flags: FillFlags = {};
  for (const flag of FILL_FLAGS) {
    const wanted = fill.flags?.[flag];
    if (wanted === undefined) {
      continue;
    }
    const current = state.flags[flag];
    if (current === wanted) {
      continue;
    }
    const empty = DEFAULT_FALSE_FLAGS.has(flag) ? current !== true : current === null;
    if (empty) {
      flags[flag] = wanted;
    } else {
      skipped.push(`признак ${flag}`);
    }
  }

  let leaveChildFromMonths: number | null = null;
  if (
    fill.leaveChildFromMonths !== undefined &&
    state.leaveChildFromMonths !== fill.leaveChildFromMonths
  ) {
    if (state.leaveChildFromMonths === null) {
      leaveChildFromMonths = fill.leaveChildFromMonths;
    } else {
      skipped.push("возраст «можно оставить»");
    }
  }

  const hasCategories = (fill.categorySlugs?.length ?? 0) > 0;
  const categories = hasCategories && state.categoryCount === 0;
  if (hasCategories && !categories) {
    skipped.push("категории");
  }

  const pricesEmpty = state.entryPriceCount === 0 && state.pricingCount === 0;
  const hasRows = (fill.entryRows?.length ?? 0) > 0;
  const entryRows = hasRows && pricesEmpty;
  const free = fill.free === true && pricesEmpty;
  if ((hasRows || fill.free === true) && !pricesEmpty) {
    skipped.push("цены");
  }

  const cover = fill.cover !== undefined && !state.imageUrl;
  if (fill.cover !== undefined && !cover) {
    skipped.push("обложка");
  }

  const hasPhotos = (fill.photos?.length ?? 0) > 0;
  const photos = hasPhotos && state.photoCount === 0;
  if (hasPhotos && !photos) {
    skipped.push("галерея");
  }

  return {
    description,
    tips,
    schedule,
    flags,
    leaveChildFromMonths,
    categories,
    free,
    entryRows,
    cover,
    photos,
    skipped,
  };
}

/** Нечего записывать: всё из заготовки уже есть у места. */
export function isEmptyPlan(plan: PlaceFillPlan): boolean {
  return (
    !plan.description &&
    !plan.tips &&
    plan.schedule === null &&
    Object.keys(plan.flags).length === 0 &&
    plan.leaveChildFromMonths === null &&
    !plan.categories &&
    !plan.free &&
    !plan.entryRows &&
    !plan.cover &&
    !plan.photos
  );
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
/// фото мест лежат в public/images/places — другой путь на сайте не откроется
const PLACE_IMAGE = /^\/images\/places\/[a-z0-9-]+\.(jpg|png|webp)$/;

/**
 * Ошибки в самой заготовке — их ловим до обращения к базе (и тестом по всей
 * партии): опечатка во времени или пустой совет не должны доехать до сайта.
 */
export function validatePlaceFill(fill: PlaceFill): string[] {
  const problems: string[] = [];
  const say = (text: string): void => {
    problems.push(`${fill.slug}: ${text}`);
  };

  if ((fill.description === undefined) !== (fill.descriptionEn === undefined)) {
    say("описание только на одном языке");
  }
  for (const [name, value] of [
    ["описание", fill.description],
    ["описание (en)", fill.descriptionEn],
  ] as const) {
    if (value === undefined) {
      continue;
    }
    if (value.trim() === "") {
      say(`${name} пустое`);
    } else if (value.includes(DRAFT_MARK)) {
      say(`${name} содержит пометку ${DRAFT_MARK}`);
    }
  }

  for (const tip of fill.tips ?? []) {
    if (tip.text.trim() === "" || tip.textEn.trim() === "") {
      say("совет без текста на одном из языков");
    }
  }

  for (const day of FILL_DAYS) {
    const value = fill.hours?.[day];
    if (value === undefined || value === "closed") {
      continue;
    }
    if (!TIME.test(value.open) || !TIME.test(value.close)) {
      say(`часы ${day}: время не в виде ЧЧ:ММ`);
    } else if (value.close !== "00:00" && value.open >= value.close) {
      // «до полуночи» на сайте пишется как закрытие в 00:00 (конец суток);
      // остальное «закрытие раньше открытия» в детских местах — опечатка
      say(`часы ${day}: открытие не раньше закрытия`);
    }
  }

  if (fill.free === true && (fill.entryRows?.length ?? 0) > 0) {
    say("и «вход бесплатный», и таблица цен");
  }
  for (const row of fill.entryRows ?? []) {
    if (row.label.trim() === "" || row.labelEn.trim() === "") {
      say("строка цен без подписи на одном из языков");
    }
    if (row.child === null && row.adult === null) {
      say(`строка цен «${row.label}» без цены`);
    }
    for (const amount of [row.child, row.adult]) {
      if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
        say(`строка цен «${row.label}»: цена не число`);
      }
    }
  }
  if ((fill.note === undefined) !== (fill.noteEn === undefined)) {
    say("подпись к ценам только на одном языке");
  }

  if (fill.cover !== undefined) {
    if (!PLACE_IMAGE.test(fill.cover.url)) {
      say(`обложка: путь не из /images/places — ${fill.cover.url}`);
    }
    if (fill.cover.rightsNote.trim() === "") {
      say("обложка без строки о правах");
    }
  }
  const photos = fill.photos ?? [];
  for (const photo of photos) {
    if (!PLACE_IMAGE.test(photo.url)) {
      say(`фото: путь не из /images/places — ${photo.url}`);
    }
    if (photo.caption.trim() === "") {
      say(`фото ${photo.url} без подписи`);
    }
  }
  if (new Set(photos.map((photo) => photo.url)).size !== photos.length) {
    say("одно фото в галерее дважды");
  }
  if (photos.length > 0 && (fill.photoRightsNote ?? "").trim() === "") {
    say("галерея без строки о правах");
  }

  if (fill.leaveChildFromMonths !== undefined) {
    if (!Number.isInteger(fill.leaveChildFromMonths) || fill.leaveChildFromMonths < 0) {
      say("возраст «можно оставить» — не целое число месяцев");
    }
    if (fill.flags?.canLeaveChild !== true) {
      say("возраст «можно оставить» задан, а сам признак — нет");
    }
  }

  return problems;
}
