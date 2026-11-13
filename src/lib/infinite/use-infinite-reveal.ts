"use client";

import { useCallback, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { hrefWithPage, revealedPages, totalPagesFor, visibleCount } from "./reveal";

type InfiniteReveal = {
  /** сколько карточек показать сейчас */
  count: number;
  /**
   * с какой карточки начинается только что раскрытая партия — они
   * проявляются мягко, а не возникают рывком. Карточки, что были на экране
   * при открытии страницы (в том числе после «назад»), не анимируются.
   */
  freshFrom: number;
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
  const count = visibleCount(pages, pageSize, total);

  // прежняя длина ленты — подстройка во время рендера (паттерн React
  // «adjusting state when props change»): выросла — новые с прежней границы;
  // укоротилась (сменили фильтр) — свежих нет
  const [seen, setSeen] = useState({ count, freshFrom: count });
  let freshFrom = seen.freshFrom;
  if (seen.count !== count) {
    freshFrom = count > seen.count ? seen.count : count;
    setSeen({ count, freshFrom });
  }

  const loadMore = useCallback(() => {
    window.history.replaceState(null, "", nextHref);
  }, [nextHref]);

  return {
    count,
    freshFrom,
    hasMore: pages < totalPages,
    nextHref,
    loadMore,
  };
}
