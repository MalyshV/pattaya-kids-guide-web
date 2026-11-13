"use client";

import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { hrefWithPage, revealedPages, totalPagesFor, visibleCount } from "./reveal";

type InfiniteReveal = {
  /** сколько карточек показать сейчас */
  count: number;
  hasMore: boolean;
  /** адрес следующей партии — запасная обычная ссылка (без JS, роботы) */
  nextHref: string;
  /** раскрыть следующую партию */
  loadMore: () => void;
};

/**
 * Длина ленты живёт в адресе (`?page=N`), а не в состоянии компонента: смена
 * фильтра (новый адрес без page) сама сбрасывает ленту на первую партию, а
 * «назад» с карточки возвращает её длину. Партию добавляем через
 * history.replaceState — Next синхронизирует его с useSearchParams и не ходит
 * на сервер, а в истории не копятся лишние шаги «назад».
 */
export function useInfiniteReveal(total: number, pageSize: number): InfiniteReveal {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = totalPagesFor(total, pageSize);
  const pages = revealedPages(searchParams.get("page"), totalPages);
  const nextHref = hrefWithPage(pathname, searchParams.toString(), pages + 1);

  const loadMore = useCallback(() => {
    window.history.replaceState(null, "", nextHref);
  }, [nextHref]);

  return {
    count: visibleCount(pages, pageSize, total),
    hasMore: pages < totalPages,
    nextHref,
    loadMore,
  };
}
