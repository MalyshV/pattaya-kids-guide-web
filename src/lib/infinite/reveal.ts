/**
 * Подгрузка карточек при прокрутке. Данные списков уже целиком у страницы —
 * «подгрузить» значит показать следующую партию. `?page=N` в адресе теперь
 * значит «раскрыто N партий» (накопительно, а не «N-я страница»): назад с
 * карточки места возвращает ту же длину ленты, и браузер ставит прокрутку
 * туда, где человек остановился. Старые ссылки `?page=3` тоже не ломаются —
 * открывают первые три партии.
 */

export function totalPagesFor(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** сколько партий раскрыто: мусор и ноль в `?page` → 1, за концом → последняя */
export function revealedPages(pageParam: string | null, totalPages: number): number {
  const parsed = pageParam === null ? Number.NaN : Number(pageParam);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }
  return Math.min(parsed, totalPages);
}

/** сколько карточек показать при раскрытых `pages` партиях */
export function visibleCount(pages: number, pageSize: number, total: number): number {
  return Math.min(total, pages * pageSize);
}

/**
 * Адрес с другим числом раскрытых партий; остальные параметры (фильтры,
 * возраст, район) не трогаем. Первая партия — без `?page`: чистый адрес.
 */
export function hrefWithPage(pathname: string, search: string, page: number): string {
  const params = new URLSearchParams(search);
  if (page <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(page));
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
