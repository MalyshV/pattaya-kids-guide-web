import type { MemoryKind } from "@/lib/memory/parent-memory";

/**
 * Вкладка страницы «Нравится · Уже были». Живёт в URL (?tab=visited), чтобы
 * пункт меню шапки открывал ровно тот список, который в нём назван.
 * «Нравится» — вкладка по умолчанию, параметра у неё нет.
 */

export const SAVED_TAB_PARAM = "tab";

export const SAVED_TABS: readonly MemoryKind[] = ["saved", "visited"];

/** Вкладка из ?tab=; всё незнакомое и пустое — «Нравится». */
export function parseSavedTab(value: string | null | undefined): MemoryKind {
  return value === "visited" ? "visited" : "saved";
}

/** Адрес страницы с вкладкой; возраст ребёнка (?age=) — сквозной, сохраняем. */
export function savedPageHref(
  basePath: string,
  options: { age?: string | null; tab?: MemoryKind } = {},
): string {
  const params = new URLSearchParams();
  if (options.age) {
    params.set("age", options.age);
  }
  if (options.tab === "visited") {
    params.set(SAVED_TAB_PARAM, "visited");
  }
  const query = params.toString();
  return query ? `${basePath}/saved?${query}` : `${basePath}/saved`;
}
