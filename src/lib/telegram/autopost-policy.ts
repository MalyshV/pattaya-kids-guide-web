import { TelegramApiError } from "@/lib/telegram/client";

/**
 * Отпускать ли бронь журнала, когда отправка поста в канал упала. Только явный
 * отказ Telegram (TelegramApiError = ответ ok:false) означает, что пост ТОЧНО
 * не опубликован — тогда безопасно снять бронь и повторить на следующем
 * прогоне. Таймаут (AbortSignal на 15с) и сетевой обрыв НЕОДНОЗНАЧНЫ: запрос
 * мог дойти и пост мог опубликоваться, пока наш fetch отваливался. В этом
 * случае бронь держим — ценой возможной потери одного поста, но без риска
 * второго поста в канале (инвариант проекта: дубль страшнее потери).
 *
 * Вынесено из сервиса отдельно, чтобы покрыть тестом без импорта prisma.
 */
export function shouldReleaseClaim(error: unknown): boolean {
  return error instanceof TelegramApiError;
}

/**
 * Стоит ли публиковать занятие. Регулярное занятие — всегда. Лагерь — только
 * пока он не закончился: пост «Лагерь в гиде» про июльскую смену в октябре
 * был бы шумом. Лагерь без дат публикуем (даты ещё не объявили).
 */
export function isActivityPostable(
  activity: { type: string; startDate: Date | null; endDate: Date | null },
  now: Date,
): boolean {
  if (activity.type !== "CAMP") {
    return true;
  }
  const lastDay = activity.endDate ?? activity.startDate;
  return lastDay === null || lastDay.getTime() >= now.getTime();
}

/**
 * Очередь занятий: сперва лагеря с ближайшим началом (у них срок), потом
 * остальные в порядке каталога.
 */
export function compareActivitiesForPost(
  a: { type: string; startDate: Date | null; order: number; name: string },
  b: { type: string; startDate: Date | null; order: number; name: string },
): number {
  const aStart = a.type === "CAMP" && a.startDate ? a.startDate.getTime() : null;
  const bStart = b.type === "CAMP" && b.startDate ? b.startDate.getTime() : null;
  if (aStart !== null || bStart !== null) {
    if (aStart === null) return 1;
    if (bStart === null) return -1;
    if (aStart !== bStart) return aStart - bStart;
  }
  return a.order - b.order || a.name.localeCompare(b.name, "ru");
}

export type AutopostEntityType = "EVENT" | "PLACE" | "ACTIVITY";

const RESET_TYPE_BY_NAME: Record<string, AutopostEntityType> = {
  events: "EVENT",
  places: "PLACE",
  activities: "ACTIVITY",
};

const ALL_RESET_TYPES: AutopostEntityType[] = ["EVENT", "PLACE", "ACTIVITY"];

export type ParsedResetTypes =
  | { ok: true; types: AutopostEntityType[] }
  | { ok: false; error: string };

/**
 * Разбор `--type=events,places` для сброса журнала. Без `--type` — все типы.
 * Можно повторять флаг и/или перечислять через запятую; дубли схлопываются,
 * порядок результата всегда один и тот же. Неизвестное значение — ошибка:
 * лучше остановиться, чем сбросить не то.
 */
export function parseResetTypes(args: string[]): ParsedResetTypes {
  const typeArgs = args.filter((arg) => arg === "--type" || arg.startsWith("--type="));
  if (typeArgs.length === 0) {
    return { ok: true, types: [...ALL_RESET_TYPES] };
  }

  const found = new Set<AutopostEntityType>();
  for (const arg of typeArgs) {
    const raw = arg.includes("=") ? arg.slice(arg.indexOf("=") + 1) : "";
    const names = raw.split(",").map((name) => name.trim().toLowerCase());
    if (names.every((name) => name === "")) {
      return {
        ok: false,
        error: "Флаг --type пуст. Допустимо: events, places, activities (через запятую).",
      };
    }
    for (const name of names) {
      if (name === "") {
        continue;
      }
      const type = RESET_TYPE_BY_NAME[name];
      if (!type) {
        return {
          ok: false,
          error: `Неизвестный тип «${name}» в --type. Допустимо: events, places, activities.`,
        };
      }
      found.add(type);
    }
  }

  return { ok: true, types: ALL_RESET_TYPES.filter((type) => found.has(type)) };
}
