/**
 * Наполнение карточки занятия из подготовленной партии — как place-fill для
 * мест: что из заготовки можно записать, не затерев сделанное руками. Чистые
 * функции (без БД) — раннер заноса только читает состояние занятия и
 * исполняет план.
 *
 * Правило то же — «заполняем только пустое»:
 * - описание (RU/EN/TH вместе) — если его нет или там пометка «[черновик]»;
 * - английское и тайское название — каждое, только если пустое;
 * - советы, таблица групп, категории, галерея — только если их ещё нет;
 * - возраст — только если ни одной границы ещё нет;
 * - цена (с подписью) — только если её нет;
 * - обложка — только если её нет.
 * У занятия нет полей контактов: как связаться, пишем в конце описания.
 */

import { isDraftDescription } from "./place-fill";

export type ProgramFillTip = { text: string; textEn: string; textTh?: string };

/** Строка таблицы «Классы и расписание» (PlaceClass). */
export type ProgramFillClass = {
  name: string;
  nameEn?: string;
  nameTh?: string;
  ageLabel: string;
  ageLabelEn?: string;
  ageLabelTh?: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  /// true — с родителем, false — без, null — не сказано (плашку не показываем)
  parentRequired: boolean | null;
  schedule: string;
  scheduleEn?: string;
  scheduleTh?: string;
};

export type ProgramFillPhoto = { url: string; caption: string };

export type ProgramFill = {
  slug: string;
  nameEn?: string;
  nameTh?: string;
  description: string;
  descriptionEn: string;
  descriptionTh?: string;
  tips?: readonly ProgramFillTip[];
  minAgeMonths?: number;
  maxAgeMonths?: number;
  price?: number;
  priceUnit?: string;
  priceUnitEn?: string;
  priceUnitTh?: string;
  classes?: readonly ProgramFillClass[];
  categorySlugs?: readonly string[];
  /// обложка занятия (файл уже лежит в public/images/activities)
  cover?: string;
  /// галерея; провенанс один на все снимки — photoRightsNote
  photos?: readonly ProgramFillPhoto[];
  photoRightsNote?: string;
  /// чьи снимки: свои или со страниц самой школы
  photoSource?: "OWN" | "PLACE_OWNER";
};

/** Что сейчас у занятия в базе — ровно то, что нужно для решения. */
export type ProgramFillState = {
  description: string | null;
  nameEn: string | null;
  nameTh: string | null;
  tipsCount: number;
  classCount: number;
  categoryCount: number;
  photoCount: number;
  price: number | null;
  minAgeMonths: number | null;
  maxAgeMonths: number | null;
  imageUrl: string | null;
};

export type ProgramFillPlan = {
  description: boolean;
  nameEn: boolean;
  nameTh: boolean;
  tips: boolean;
  age: boolean;
  price: boolean;
  classes: boolean;
  categories: boolean;
  cover: boolean;
  photos: boolean;
  /// что в заготовке было, но не записано: у занятия это уже заполнено
  skipped: string[];
};

export function planProgramFill(
  state: ProgramFillState,
  fill: ProgramFill,
): ProgramFillPlan {
  const skipped: string[] = [];
  const decide = (wanted: boolean, empty: boolean, name: string): boolean => {
    if (wanted && !empty) {
      skipped.push(name);
    }
    return wanted && empty;
  };

  const hasAge = fill.minAgeMonths !== undefined || fill.maxAgeMonths !== undefined;
  return {
    description: decide(true, isDraftDescription(state.description), "описание"),
    nameEn: decide(fill.nameEn !== undefined, !state.nameEn, "название (en)"),
    nameTh: decide(fill.nameTh !== undefined, !state.nameTh, "название (th)"),
    tips: decide((fill.tips?.length ?? 0) > 0, state.tipsCount === 0, "советы"),
    age: decide(
      hasAge,
      state.minAgeMonths === null && state.maxAgeMonths === null,
      "возраст",
    ),
    price: decide(fill.price !== undefined, state.price === null, "цена"),
    classes: decide((fill.classes?.length ?? 0) > 0, state.classCount === 0, "группы"),
    categories: decide(
      (fill.categorySlugs?.length ?? 0) > 0,
      state.categoryCount === 0,
      "категории",
    ),
    cover: decide(fill.cover !== undefined, !state.imageUrl, "обложка"),
    photos: decide((fill.photos?.length ?? 0) > 0, state.photoCount === 0, "галерея"),
    skipped,
  };
}

/** Нечего записывать: всё из заготовки уже есть у занятия. */
export function isEmptyProgramPlan(plan: ProgramFillPlan): boolean {
  return [
    plan.description,
    plan.nameEn,
    plan.nameTh,
    plan.tips,
    plan.age,
    plan.price,
    plan.classes,
    plan.categories,
    plan.cover,
    plan.photos,
  ].every((part) => !part);
}

const DRAFT_MARK = "[черновик]";
/// фото занятий лежат в public/images/activities — другой путь не откроется
const ACTIVITY_IMAGE = /^\/images\/activities\/[a-z0-9-]+\.(jpg|png|webp)$/;
const BLANK = (value: string | undefined): boolean =>
  value !== undefined && value.trim() === "";

/**
 * Ошибки в самой заготовке — их ловим до обращения к базе (и тестом по всей
 * партии): пустой совет или возраст «от 7 до 5 лет» не должны доехать до сайта.
 */
export function validateProgramFill(fill: ProgramFill): string[] {
  const problems: string[] = [];
  const say = (text: string): void => {
    problems.push(`${fill.slug}: ${text}`);
  };

  for (const [name, value] of [
    ["описание", fill.description],
    ["описание (en)", fill.descriptionEn],
    ["описание (th)", fill.descriptionTh],
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
  if (BLANK(fill.nameEn) || BLANK(fill.nameTh)) {
    say("пустое название");
  }

  for (const tip of fill.tips ?? []) {
    if (tip.text.trim() === "" || tip.textEn.trim() === "" || BLANK(tip.textTh)) {
      say("совет без текста на одном из языков");
    }
  }

  const ageOk = (months: number | undefined): boolean =>
    months === undefined || (Number.isInteger(months) && months >= 0 && months <= 240);
  if (!ageOk(fill.minAgeMonths) || !ageOk(fill.maxAgeMonths)) {
    say("возраст — не целое число месяцев от 0 до 240");
  } else if (
    fill.minAgeMonths !== undefined &&
    fill.maxAgeMonths !== undefined &&
    fill.minAgeMonths > fill.maxAgeMonths
  ) {
    say("возраст «от» больше, чем «до»");
  }

  if (fill.price !== undefined) {
    if (!Number.isFinite(fill.price) || fill.price <= 0) {
      say("цена — не положительное число");
    }
    if ((fill.priceUnit ?? "").trim() === "" || (fill.priceUnitEn ?? "").trim() === "") {
      say("цена без подписи («/ месяц») на одном из языков");
    }
  } else if (fill.priceUnit !== undefined || fill.priceUnitEn !== undefined) {
    say("подпись к цене без цены");
  }

  for (const cls of fill.classes ?? []) {
    if (
      cls.name.trim() === "" ||
      cls.ageLabel.trim() === "" ||
      cls.schedule.trim() === ""
    ) {
      say("строка групп без названия, возраста или расписания");
    }
    if (
      !Number.isInteger(cls.minAgeMonths) ||
      !Number.isInteger(cls.maxAgeMonths) ||
      cls.minAgeMonths < 0 ||
      cls.minAgeMonths > cls.maxAgeMonths
    ) {
      say(`группа «${cls.name}»: неверный возраст`);
    }
  }

  if (fill.cover !== undefined && !ACTIVITY_IMAGE.test(fill.cover)) {
    say(`обложка: путь не из /images/activities — ${fill.cover}`);
  }
  const photos = fill.photos ?? [];
  for (const photo of photos) {
    if (!ACTIVITY_IMAGE.test(photo.url)) {
      say(`фото: путь не из /images/activities — ${photo.url}`);
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

  return problems;
}
