/**
 * «Мой план» — чистое ядро: что семья собирается сделать и в какой день.
 *
 * Черновой срез без регистрации (решение 10.11): план, как и «Нравится», живёт
 * в localStorage (см. use-plan), поэтому у записи есть снимок для показа
 * (название, где проходит) — страница плана рисуется без запроса к базе.
 * Когда появится вход, эти же записи переедут в профиль семьи.
 *
 * Здесь только чистые функции над массивом — без localStorage и Date.now().
 * Запись — это «что + в какой день»: одно и то же место можно поставить на
 * разные дни, но не дважды на один.
 */

import { isDayString } from "@/lib/plan/week";

export type PlanEntity = "place" | "activity" | "event";

export type PlanEntry = {
  entity: PlanEntity;
  /** slug города: ссылка из плана ведёт в ЕГО город */
  city: string;
  slug: string;
  /** день по Паттайе, «YYYY-MM-DD» */
  day: string;
  /** снимок для показа: данные могли устареть, ссылка ведёт на свежую страницу */
  name: string;
  /** где проходит (для события и занятия) — тихая вторая строка */
  hint: string | null;
  /** когда добавлено (мс с эпохи) — порядок внутри дня */
  addedAt: number;
};

/** Что кладём в план: запись без дня и времени добавления. */
export type PlanSnapshot = Pick<PlanEntry, "entity" | "city" | "slug" | "name" | "hint">;

/// защита от разрастания localStorage; 200 дел — заведомо с запасом
export const MAX_PLAN_ENTRIES = 200;

const ENTITIES: ReadonlySet<string> = new Set(["place", "activity", "event"]);

export function planKey(
  entry: Pick<PlanEntry, "entity" | "city" | "slug" | "day">,
): string {
  return `${entry.day}:${entry.city}:${entry.entity}:${entry.slug}`;
}

export function hasEntry(
  entries: readonly PlanEntry[],
  target: Pick<PlanEntry, "entity" | "city" | "slug" | "day">,
): boolean {
  const key = planKey(target);
  return entries.some((entry) => planKey(entry) === key);
}

/**
 * Поставить на день или снять с него: запись уже стоит на этот день — убираем,
 * иначе добавляем. Самые старые записи вытесняются при переполнении.
 */
export function toggleEntry(
  entries: readonly PlanEntry[],
  entry: PlanEntry,
): PlanEntry[] {
  const key = planKey(entry);
  const without = entries.filter((existing) => planKey(existing) !== key);
  if (without.length !== entries.length) {
    return without;
  }
  return [...without, entry]
    .sort((a, b) => b.addedAt - a.addedAt)
    .slice(0, MAX_PLAN_ENTRIES)
    .sort((a, b) => a.addedAt - b.addedAt);
}

export function removeEntry(
  entries: readonly PlanEntry[],
  target: Pick<PlanEntry, "entity" | "city" | "slug" | "day">,
): PlanEntry[] {
  const key = planKey(target);
  return entries.filter((entry) => planKey(entry) !== key);
}

/** Записи одного дня — в порядке добавления. */
export function entriesOfDay(entries: readonly PlanEntry[], day: string): PlanEntry[] {
  return entries
    .filter((entry) => entry.day === day)
    .sort((a, b) => a.addedAt - b.addedAt);
}

/** Сколько дел стоит на перечисленные дни (неделя в заголовке плана). */
export function countInDays(
  entries: readonly PlanEntry[],
  days: readonly string[],
): number {
  const wanted = new Set(days);
  return entries.filter((entry) => wanted.has(entry.day)).length;
}

function isPlanEntry(value: unknown): value is PlanEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.entity === "string" &&
    ENTITIES.has(record.entity) &&
    typeof record.city === "string" &&
    record.city.length > 0 &&
    typeof record.slug === "string" &&
    record.slug.length > 0 &&
    isDayString(record.day) &&
    typeof record.name === "string" &&
    (record.hint === null || typeof record.hint === "string") &&
    typeof record.addedAt === "number" &&
    Number.isFinite(record.addedAt)
  );
}

/** Прочитать сохранённое: битый JSON или чужие записи — пусто, а не падение. */
export function parseStoredPlan(raw: string | null): PlanEntry[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const seen = new Set<string>();
    const entries: PlanEntry[] = [];
    for (const value of parsed) {
      if (!isPlanEntry(value)) {
        continue;
      }
      const key = planKey(value);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      entries.push({
        entity: value.entity,
        city: value.city,
        slug: value.slug,
        day: value.day,
        name: value.name,
        hint: value.hint,
        addedAt: value.addedAt,
      });
    }
    return entries.slice(-MAX_PLAN_ENTRIES);
  } catch {
    return [];
  }
}

export function serializePlan(entries: readonly PlanEntry[]): string {
  return JSON.stringify(entries);
}
