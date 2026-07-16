"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  hasItem,
  parseStored,
  serialize,
  toggleItem,
  type MemoryEntity,
  type MemoryItem,
  type MemoryKind,
} from "./parent-memory";

const STORAGE_KEY = "pkg:parent-memory:v1";
/// same-tab-синхронизация: кнопка на карточке, счётчик в шапке и страница
/// «Избранное» слушают это событие (событие `storage` в породившую вкладку
/// не летит, поэтому нужно своё)
const CHANGE_EVENT = "pkg:parent-memory-change";

/// стабильная ссылка на «пусто» — и для SSR, и для сравнения снапшотов
const EMPTY: readonly MemoryItem[] = [];

/// снимок сущности для закладки (что нужно нарисовать на «Избранном»)
export type MemorySnapshot = {
  entity: MemoryEntity;
  slug: string;
  name: string;
  imageUrl: string | null;
};

// useSyncExternalStore требует РЕФ-СТАБИЛЬНОСТИ снапшота: пока сырое содержимое
// localStorage не менялось, отдаём тот же распарсенный массив, иначе React
// уйдёт в бесконечный ререндер. Кэш модульный — стор один на вкладку.
let cachedRaw: string | null = null;
let cachedItems: readonly MemoryItem[] = EMPTY;

function readSnapshot(): readonly MemoryItem[] {
  if (typeof window === "undefined") {
    return EMPTY;
  }
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedItems = parseStored(raw);
  }
  return cachedItems;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/// «смонтированы ли мы на клиенте» через тот же механизм (без setState в effect):
/// на SSR и первом клиентском рендере — false, дальше — true. Нужно, чтобы
/// страница «Избранное» не мигнула «пусто» до чтения localStorage
const noopSubscribe = (): (() => void) => () => {};

function write(items: readonly MemoryItem[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, serialize(items));
    cachedRaw = null; // следующий readSnapshot перечитает свежее
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // localStorage недоступен (приватный режим / переполнен) — тихо игнорируем:
    // закладка не сохранится, но сайт работает как обычно
  }
}

export type ParentMemory = {
  items: readonly MemoryItem[];
  hydrated: boolean;
  has: (entity: MemoryEntity, slug: string, kind: MemoryKind) => boolean;
  toggle: (snapshot: MemorySnapshot, kind: MemoryKind) => void;
};

export function useParentMemory(): ParentMemory {
  const items = useSyncExternalStore(subscribe, readSnapshot, () => EMPTY);
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const toggle = useCallback((snapshot: MemorySnapshot, kind: MemoryKind): void => {
    // читаем СВЕЖЕЕ из localStorage (не из React-state) — чтобы не затереть
    // изменение из другого компонента; write разбудит useSyncExternalStore
    const next = toggleItem(readSnapshot(), { ...snapshot, kind, savedAt: Date.now() });
    write(next);
  }, []);

  const has = useCallback(
    (entity: MemoryEntity, slug: string, kind: MemoryKind): boolean =>
      hasItem(items, entity, slug, kind),
    [items],
  );

  return { items, hydrated, has, toggle };
}
