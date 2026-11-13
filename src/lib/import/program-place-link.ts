/**
 * Привязка занятия к каталожному месту: занятие, которое жило «само по себе»
 * (venueName/venueAddress — например, черновик из сбора), переезжает внутрь
 * карточки места и показывается там в блоке «Занятия». Чистые функции (без БД)
 * — раннер заноса только читает состояние занятия и исполняет план.
 *
 * Правила — как у наполнения, «не затираем сделанное руками»:
 * - привязываем, только если занятие ещё ни к какому месту не привязано;
 *   привязанное к другому месту оставляем (в отчёте — «оставлено»);
 * - текстовую площадку (venue*) убираем: у занятия либо каталожное место,
 *   либо своя площадка, не оба сразу (см. PlaceProgram в schema.prisma);
 * - переименовываем, только если в базе ещё прежнее имя из сбора: имя,
 *   исправленное в админке, остаётся.
 * Повторный запуск ничего не меняет.
 */

export type ProgramPlaceLink = {
  /// slug занятия
  slug: string;
  /// slug каталожного места в том же городе
  placeSlug: string;
  /// новое русское имя — только вместо прежнего имени из сбора
  rename?: { from: string; to: string };
};

/** Что сейчас у занятия в базе — ровно то, что нужно для решения. */
export type ProgramPlaceState = {
  name: string;
  /// slug места, к которому занятие уже привязано; null — не привязано
  placeSlug: string | null;
  /// заполнено хоть одно поле текстовой площадки (venueName, адрес, точка)
  hasVenue: boolean;
};

export type ProgramPlacePlan = {
  link: boolean;
  clearVenue: boolean;
  rename: boolean;
  /// что в заготовке было, но не записано: у занятия это уже другое
  skipped: string[];
};

export function planProgramPlaceLink(
  state: ProgramPlaceState,
  link: ProgramPlaceLink,
): ProgramPlacePlan {
  const skipped: string[] = [];

  const ours = state.placeSlug === link.placeSlug;
  const free = state.placeSlug === null;
  if (!ours && !free) {
    skipped.push(`место (уже привязано к «${state.placeSlug}»)`);
  }

  let rename = false;
  if (link.rename && state.name !== link.rename.to) {
    if (state.name === link.rename.from) {
      rename = true;
    } else {
      skipped.push("название");
    }
  }

  return {
    link: free,
    clearVenue: (ours || free) && state.hasVenue,
    rename,
    skipped,
  };
}

/** Нечего записывать: занятие уже на месте и с нужным именем. */
export function isEmptyPlaceLinkPlan(plan: ProgramPlacePlan): boolean {
  return !plan.link && !plan.clearVenue && !plan.rename;
}

/** Ошибки в самой заготовке — ловим до обращения к базе. */
export function validateProgramPlaceLink(link: ProgramPlaceLink): string[] {
  const problems: string[] = [];
  const say = (text: string): void => {
    problems.push(`${link.slug || "(без slug)"}: ${text}`);
  };
  if (link.slug.trim() === "" || link.placeSlug.trim() === "") {
    say("пустой slug занятия или места");
  }
  if (link.rename) {
    if (link.rename.from.trim() === "" || link.rename.to.trim() === "") {
      say("переименование с пустым именем");
    } else if (link.rename.from === link.rename.to) {
      say("переименование в то же имя");
    }
  }
  return problems;
}
