"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  hasEntry,
  parseStoredPlan,
  removeEntry,
  serializePlan,
  toggleEntry,
  type PlanEntry,
  type PlanSnapshot,
} from "./plan";

const STORAGE_KEY = "pkg:my-plan:v1";
/// same-tab-синхронизация: кнопка «В план» и страница плана слушают это
/// событие (событие `storage` в породившую вкладку не летит)
const CHANGE_EVENT = "pkg:my-plan-change";

/// стабильная ссылка на «пусто» — и для SSR, и для сравнения снапшотов
const EMPTY: readonly PlanEntry[] = [];

// useSyncExternalStore требует реф-стабильности снапшота: пока сырое
// содержимое localStorage не менялось, отдаём тот же распарсенный массив
// (тот же приём, что в use-parent-memory)
let cachedRaw: string | null = null;
let cachedEntries: readonly PlanEntry[] = EMPTY;

function readSnapshot(): readonly PlanEntry[] {
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
    cachedEntries = parseStoredPlan(raw);
  }
  return cachedEntries;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const noopSubscribe = (): (() => void) => () => {};

function write(entries: readonly PlanEntry[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, serializePlan(entries));
    cachedRaw = null; // следующий readSnapshot перечитает свежее
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // localStorage недоступен (приватный режим / переполнен) — тихо
    // игнорируем: запись не сохранится, но сайт работает как обычно
  }
}

type PlanTarget = Pick<PlanEntry, "entity" | "city" | "slug" | "day">;

export type MyPlan = {
  entries: readonly PlanEntry[];
  /** localStorage уже прочитан: до этого план «пуст» и на сервере, и в браузере */
  hydrated: boolean;
  has: (target: PlanTarget) => boolean;
  /** поставить на день или снять с него */
  toggle: (snapshot: PlanSnapshot, day: string) => void;
  remove: (target: PlanTarget) => void;
};

export function useMyPlan(): MyPlan {
  const entries = useSyncExternalStore(subscribe, readSnapshot, () => EMPTY);
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const toggle = useCallback((snapshot: PlanSnapshot, day: string): void => {
    // читаем свежее из localStorage, а не из React-state: иначе затёрли бы
    // изменение из другого компонента
    write(toggleEntry(readSnapshot(), { ...snapshot, day, addedAt: Date.now() }));
  }, []);

  const remove = useCallback((target: PlanTarget): void => {
    write(removeEntry(readSnapshot(), target));
  }, []);

  const has = useCallback(
    (target: PlanTarget): boolean => hasEntry(entries, target),
    [entries],
  );

  return { entries, hydrated, has, toggle, remove };
}
