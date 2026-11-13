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
  const { count, hasMore, nextHref, loadMore } = useInfiniteReveal(
    items.length,
    pageSize,
  );

  return (
    <>
      <section className={className}>{items.slice(0, count)}</section>
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
