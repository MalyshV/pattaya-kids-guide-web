import type { Prisma } from "@prisma/client";
import type { EventType } from "@/lib/constants/event-types";

export type EventLifecycle = "upcoming" | "ongoing" | "past";

/**
 * Живой статус события на момент запроса. Согласован с buildEventLifecycleWhere:
 * ещё не началось → upcoming; идёт (есть endDate и он в будущем) → ongoing;
 * иначе (уже закончилось или точечное в прошлом) → past.
 */
export function computeEventStatus(
  startDate: Date,
  endDate: Date | null,
  now: Date,
): EventLifecycle {
  if (startDate > now) {
    return "upcoming";
  }
  if (endDate && endDate >= now) {
    return "ongoing";
  }
  return "past";
}

/**
 * Дата ближайшей границы окна показа — для сортировки «что важнее показать
 * раньше»: идущее событие меряем по концу (когда окно закроется), остальное —
 * по началу (когда откроется). Раньше эта дата → раньше очередь (напр. автопост
 * в канал: истекающие ongoing и ближайшие upcoming идут первыми). Согласовано с
 * computeEventStatus: для ongoing endDate гарантированно не null.
 */
export function eventWindowDate(startDate: Date, endDate: Date | null, now: Date): Date {
  if (computeEventStatus(startDate, endDate, now) === "ongoing" && endDate) {
    return endDate;
  }
  return startDate;
}

/**
 * Ранг для сортировки списка событий: сначала идущие сейчас (0), затем будущие
 * (1), затем прошедшие (2). Внутри группы порядок задаётся по дате отдельно
 * (будущие — по возрастанию, прошедшие — свежие выше).
 */
export function eventSortRank(status: EventLifecycle | undefined): number {
  if (status === "ongoing") {
    return 0;
  }
  if (status === "upcoming") {
    return 1;
  }
  return 2;
}

export function buildEventLifecycleWhere(
  type: EventType | undefined,
  now: Date,
): Prisma.EventWhereInput {
  if (!type) {
    return {};
  }

  if (type === "upcoming") {
    return {
      startDate: { gt: now },
    };
  }

  if (type === "ongoing") {
    return {
      startDate: { lte: now },
      endDate: { gte: now },
    };
  }

  if (type === "past") {
    // Разовое событие хранит endDate=null (мастер-класс на один день).
    // computeEventStatus для startDate<=now и endDate=null возвращает "past",
    // но `endDate < now` в Prisma не матчит строки с NULL — без второй ветки
    // такие прошедшие события молча выпадали из вкладки и из /api/events.
    return {
      OR: [{ endDate: { lt: now } }, { endDate: null, startDate: { lte: now } }],
    };
  }

  return {};
}
