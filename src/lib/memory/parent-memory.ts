/**
 * «Память родителя» — чистое ядро закладок без регистрации.
 *
 * Родитель отмечает места/занятия/события как «сохранённое» (♡, хочу сходить)
 * или «были здесь» (✓, уже посетили). Хранится в localStorage (см.
 * use-parent-memory), поэтому у каждой записи — снимок для отображения
 * (name/imageUrl), чтобы страница «Избранное» рисовалась без запроса к БД.
 *
 * Здесь только чистые функции над массивом — без localStorage и без Date.now()
 * (время передаётся снаружи ради тестируемости). Записи идентифицируются
 * тройкой (kind, entity, slug).
 */

export type MemoryKind = "saved" | "visited";
export type MemoryEntity = "place" | "activity" | "event";

export type MemoryItem = {
  entity: MemoryEntity;
  slug: string;
  kind: MemoryKind;
  /// снимок для страницы «Избранное» (данные могли устареть — ссылка ведёт
  /// на актуальную страницу, там всё свежее)
  name: string;
  imageUrl: string | null;
  /// когда добавлено (мс с эпохи) — сортировка «сначала свежее»
  savedAt: number;
};

/// защита от разрастания localStorage: держим только N последних записей.
/// 300 закладок на семью — заведомо с запасом
export const MAX_ITEMS = 300;

/** Ключ записи — тройка (kind, entity, slug); slug уникален внутри entity. */
export function itemKey(entity: MemoryEntity, slug: string, kind: MemoryKind): string {
  return `${kind}:${entity}:${slug}`;
}

function keyOf(item: MemoryItem): string {
  return itemKey(item.entity, item.slug, item.kind);
}

export function hasItem(
  items: readonly MemoryItem[],
  entity: MemoryEntity,
  slug: string,
  kind: MemoryKind,
): boolean {
  const key = itemKey(entity, slug, kind);
  return items.some((item) => keyOf(item) === key);
}

/**
 * Переключить закладку: если такой (kind, entity, slug) уже есть — убрать,
 * иначе добавить в начало (свежее сверху) с обрезкой до MAX_ITEMS.
 * Обновление снимка (name/imageUrl) для существующей записи не делаем —
 * toggle либо ставит, либо снимает; повторное сохранение освежит снимок.
 */
export function toggleItem(items: readonly MemoryItem[], item: MemoryItem): MemoryItem[] {
  const key = keyOf(item);
  const without = items.filter((existing) => keyOf(existing) !== key);
  if (without.length !== items.length) {
    return without; // была — сняли
  }
  return [item, ...without].slice(0, MAX_ITEMS); // не было — добавили свежую сверху
}

export function removeItem(
  items: readonly MemoryItem[],
  entity: MemoryEntity,
  slug: string,
  kind: MemoryKind,
): MemoryItem[] {
  const key = itemKey(entity, slug, kind);
  return items.filter((item) => keyOf(item) !== key);
}

/** Записи одного вида, свежие сверху (исходный массив не мутируется). */
export function listByKind(items: readonly MemoryItem[], kind: MemoryKind): MemoryItem[] {
  return items.filter((item) => item.kind === kind).sort((a, b) => b.savedAt - a.savedAt);
}

function isMemoryKind(value: unknown): value is MemoryKind {
  return value === "saved" || value === "visited";
}

function isMemoryEntity(value: unknown): value is MemoryEntity {
  return value === "place" || value === "activity" || value === "event";
}

/** Одна запись из недоверенного источника (localStorage) → валидная или null. */
function parseItem(raw: unknown): MemoryItem | null {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }
  const value = raw as Record<string, unknown>;
  if (
    !isMemoryEntity(value.entity) ||
    !isMemoryKind(value.kind) ||
    typeof value.slug !== "string" ||
    value.slug.length === 0 ||
    typeof value.name !== "string" ||
    typeof value.savedAt !== "number" ||
    !Number.isFinite(value.savedAt)
  ) {
    return null;
  }
  const imageUrl =
    typeof value.imageUrl === "string" && value.imageUrl.length > 0
      ? value.imageUrl
      : null;
  return {
    entity: value.entity,
    kind: value.kind,
    slug: value.slug,
    name: value.name,
    imageUrl,
    savedAt: value.savedAt,
  };
}

/**
 * Разбор сырого содержимого localStorage. Терпим к мусору и старым форматам:
 * не JSON или не массив → []; отдельные битые записи выбрасываются, дубли по
 * ключу схлопываются (первое вхождение). Ничего не бросает.
 */
export function parseStored(raw: string | null): MemoryItem[] {
  if (!raw) {
    return [];
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) {
    return [];
  }
  const seen = new Set<string>();
  const items: MemoryItem[] = [];
  for (const entry of parsed) {
    const item = parseItem(entry);
    if (!item) {
      continue;
    }
    const key = keyOf(item);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    items.push(item);
  }
  return items.slice(0, MAX_ITEMS);
}

export function serialize(items: readonly MemoryItem[]): string {
  return JSON.stringify(items);
}
