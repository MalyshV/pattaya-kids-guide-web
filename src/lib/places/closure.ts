import { pickLocalized } from "@/lib/i18n/localize";
import {
  computeOpenStatus,
  type OpenStatus,
  type ScheduleInput,
} from "@/lib/schedule/open-status";

/**
 * Состояние работы места (docs/CHAINS_PLAN.md, «плашка закрылось»; решение
 * 08.10). Отдельно от расписания: «временно закрыто» — ремонт без даты
 * открытия, «закрылось» — архив. Такое место остаётся в каталоге приглушённым
 * в самом конце списка (зимовщики ищут знакомые места) и на карте тусклым
 * пином, но выпадает из сценариев («Пойти сейчас», «Открыто с утра» и др.)
 * и из Telegram. Страница живёт: ссылки и ♡/✓ родителей не ломаются.
 */

export type ClosureKind = "temporarily" | "permanently";

export type Closure = {
  kind: ClosureKind;
  /** с какого дня закрыто; null = не знаем */
  since: Date | null;
  /** фраза от руки на языке страницы; null = не написана */
  note: string | null;
};

/** Поля Place, по которым считается состояние (Prisma-модель или DTO). */
export type ClosureSource = {
  operatingStatus: "OPEN" | "TEMPORARILY_CLOSED" | "CLOSED";
  /** с кэш-хита data-cache даты приходят строками */
  closedSince?: Date | string | null;
  closedNote?: string | null;
  closedNoteEn?: string | null;
  closedNoteTh?: string | null;
};

export function placeClosure(place: ClosureSource, lang: string): Closure | null {
  if (place.operatingStatus === "OPEN") {
    return null;
  }
  const note = pickLocalized(
    place.closedNote ?? null,
    place.closedNoteEn,
    place.closedNoteTh,
    lang,
  );
  const since = place.closedSince ? new Date(place.closedSince) : null;
  return {
    kind: place.operatingStatus === "CLOSED" ? "permanently" : "temporarily",
    since: since && !Number.isNaN(since.getTime()) ? since : null,
    note: note?.trim() ? note.trim() : null,
  };
}

/** Вид закрытия (без фразы и даты) — для списков и карты, где язык не нужен. */
export function closureKind(
  place: Pick<ClosureSource, "operatingStatus">,
): ClosureKind | null {
  if (place.operatingStatus === "TEMPORARILY_CLOSED") {
    return "temporarily";
  }
  if (place.operatingStatus === "CLOSED") {
    return "permanently";
  }
  return null;
}

export function closureStatus(kind: ClosureKind): OpenStatus {
  return kind === "permanently"
    ? { kind: "closedPermanently" }
    : { kind: "closedTemporarily" };
}

export function isClosureStatus(status: OpenStatus): boolean {
  return status.kind === "closedTemporarily" || status.kind === "closedPermanently";
}

/**
 * Живой статус места с учётом состояния работы: у закрытого на время или
 * насовсем расписание не считается — иначе ремонтирующаяся игровая светилась
 * бы «Открыто сейчас». Единственная точка входа для карточки, страницы,
 * каталога и посадочной.
 */
export function computePlaceStatus(
  place: Pick<ClosureSource, "operatingStatus">,
  schedules: ScheduleInput[],
  timezone: string,
  now: Date = new Date(),
): OpenStatus {
  const kind = closureKind(place);
  return kind ? closureStatus(kind) : computeOpenStatus(schedules, timezone, now);
}
