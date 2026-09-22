/**
 * Ссылка переключателя «Список | Карта»: те же фильтры, без page (карта
 * показывает всё, а список честно начинается с первой страницы). Пустые
 * значения не пишем — адрес остаётся чистым.
 */

export type ListView = "list" | "map";

export function parseListView(value: string | undefined): ListView {
  return value === "map" ? "map" : "list";
}

export function viewHref(
  path: string,
  params: Record<string, string | undefined>,
  nextView: ListView,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page" && key !== "view") {
      search.set(key, value);
    }
  }
  if (nextView === "map") {
    search.set("view", "map");
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}
