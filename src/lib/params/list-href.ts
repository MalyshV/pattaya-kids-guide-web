/**
 * Ссылка списка с параметрами фильтров: пустые значения не пишем — адрес
 * остаётся чистым. page не переносим никогда: смена фильтра честно
 * начинает список с первой страницы. hash — якорь блока, к которому вести
 * (например, строка «Тип места»).
 */
export function listHref(
  pathname: string,
  params: Record<string, string | undefined>,
  hash?: string,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page") {
      search.set(key, value);
    }
  }
  const query = search.toString();
  return `${pathname}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}
