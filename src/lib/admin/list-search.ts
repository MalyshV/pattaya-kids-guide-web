/**
 * Поиск по спискам админки (места, занятия, события): фильтр прямо в
 * браузере, без запроса к базе — списки и так приходят целиком.
 *
 * Ищем по всем словам запроса сразу: «skoop cafe» найдёт «Skoop Beach Café».
 * Регистр, ударения и диакритика не важны («cafe» = «Café», «ё» = «е»).
 */

export type AdminListItem = {
  id: string;
  href: string;
  name: string;
  /// серая строка под названием (slug, место, отметки «скрыто», «демо»)
  meta: string;
  /// не показывается родителям (status ≠ APPROVED)
  hidden: boolean;
  /// всё, по чему ищем: название, адрес, slug, место проведения…
  searchText: string;
};

export const VISIBILITY_FILTERS = ["all", "live", "hidden"] as const;
export type VisibilityFilter = (typeof VISIBILITY_FILTERS)[number];

/** Значение из адреса страницы (?show=…) → фильтр; незнакомое — «все». */
export function parseVisibility(value: string | null | undefined): VisibilityFilter {
  return VISIBILITY_FILTERS.find((filter) => filter === value) ?? "all";
}

/** Текст для сравнения: без регистра, диакритики и лишних пробелов. */
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesQuery(searchText: string, query: string): boolean {
  const words = normalizeSearch(query).split(" ").filter(Boolean);
  if (words.length === 0) {
    return true;
  }
  const haystack = normalizeSearch(searchText);
  return words.every((word) => haystack.includes(word));
}

function matchesVisibility(item: AdminListItem, visibility: VisibilityFilter): boolean {
  if (visibility === "live") {
    return !item.hidden;
  }
  if (visibility === "hidden") {
    return item.hidden;
  }
  return true;
}

export function filterAdminItems(
  items: readonly AdminListItem[],
  query: string,
  visibility: VisibilityFilter,
): AdminListItem[] {
  return items.filter(
    (item) => matchesVisibility(item, visibility) && matchesQuery(item.searchText, query),
  );
}

/** Сколько записей в каждом фильтре — для подписей кнопок. */
export function countByVisibility(
  items: readonly AdminListItem[],
): Record<VisibilityFilter, number> {
  const hidden = items.filter((item) => item.hidden).length;
  return { all: items.length, live: items.length - hidden, hidden };
}

/** Параметр из адреса страницы: `?q=a&q=b` → первое значение, нет — пустая строка. */
export function firstParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}
