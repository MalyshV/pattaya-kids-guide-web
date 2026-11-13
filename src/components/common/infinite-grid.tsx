"use client";

import { LoadMore } from "@/components/common/load-more";
import { useInfiniteReveal } from "@/lib/infinite/use-infinite-reveal";

type InfiniteGridProps = {
  /** класс сетки: events-grid, activities-grid… */
  className: string;
  /** все карточки списка, уже отрисованные сервером, со своими key */
  items: React.ReactNode[];
  pageSize: number;
};

/** Сетка карточек, которая дорастает партиями при прокрутке вниз. */
export function InfiniteGrid({
  className,
  items,
  pageSize,
}: InfiniteGridProps): React.ReactElement {
  const { count, freshFrom, hasMore, nextHref, loadMore } = useInfiniteReveal(
    items.length,
    pageSize,
  );

  return (
    <>
      <section className={className}>
        {items.slice(0, count).map((item, index) => (
          // обёртка-ячейка: карточки приходят с сервера готовыми, класс
          // проявления вешаем на неё; позиция стабильна — список не
          // переставляется, только дорастает
          <div
            key={index}
            className={index >= freshFrom ? "grid-cell grid-cell-fresh" : "grid-cell"}
          >
            {item}
          </div>
        ))}
      </section>
      <LoadMore
        hasMore={hasMore}
        nextHref={nextHref}
        onLoadMore={loadMore}
        shown={count}
        total={items.length}
      />
    </>
  );
}
