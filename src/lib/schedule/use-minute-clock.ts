import { useSyncExternalStore } from "react";

/**
 * Общие «часики» страницы для живых статусов («Закроется через 25 мин»):
 * один таймер на всю страницу, тикает на границе каждой минуты и спит, пока
 * вкладка скрыта (вернулись — сразу пересчёт). Сервер в этом не участвует:
 * пересчёт — чистая арифметика в браузере, запросов нет.
 *
 * На сервере и во время гидрации отдаёт null — компонент рисует статус,
 * посчитанный сервером, и разметка совпадает; сразу после гидрации React
 * перерисует его уже по часам браузера.
 */

const MINUTE_MS = 60_000;

let currentMinute = 0;
let timer: number | null = null;
const listeners = new Set<() => void>();

function floorToMinute(ms: number): number {
  return Math.floor(ms / MINUTE_MS) * MINUTE_MS;
}

function emitIfChanged(): void {
  const next = floorToMinute(Date.now());
  if (next !== currentMinute) {
    currentMinute = next;
    listeners.forEach((listener) => listener());
  }
}

function stopTimer(): void {
  if (timer !== null) {
    window.clearTimeout(timer);
    timer = null;
  }
}

function scheduleNextTick(): void {
  stopTimer();
  if (document.hidden) {
    return;
  }
  // до начала следующей минуты (+50 мс запаса, чтобы точно её перешагнуть)
  const delay = MINUTE_MS - (Date.now() % MINUTE_MS) + 50;
  timer = window.setTimeout(() => {
    emitIfChanged();
    scheduleNextTick();
  }, delay);
}

function onVisibilityChange(): void {
  if (document.hidden) {
    stopTimer();
    return;
  }
  emitIfChanged();
  scheduleNextTick();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    currentMinute = floorToMinute(Date.now());
    document.addEventListener("visibilitychange", onVisibilityChange);
    scheduleNextTick();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      stopTimer();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    }
  };
}

function getSnapshot(): number {
  if (currentMinute === 0) {
    currentMinute = floorToMinute(Date.now());
  }
  return currentMinute;
}

function getServerSnapshot(): number | null {
  return null;
}

/** Начало текущей минуты (мс) в браузере; null — на сервере и при гидрации. */
export function useMinuteClock(): number | null {
  return useSyncExternalStore<number | null>(subscribe, getSnapshot, getServerSnapshot);
}
