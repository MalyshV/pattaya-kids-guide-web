"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useDictionary } from "@/lib/i18n/use-dictionary";

type LoadMoreProps = {
  hasMore: boolean;
  nextHref: string;
  onLoadMore: () => void;
  /** сколько показано и сколько всего — для скринридера */
  shown: number;
  total: number;
};

/**
 * Конец ленты. Следующая партия раскрывается заранее, примерно за два
 * экрана до низа, — даже быстрым взмахом на телефоне человек не упирается
 * в край (iOS гасит инерцию прокрутки, если страница кончилась). Пока партии есть, датчик снова
 * срабатывает сам, если после раскрытия он всё ещё близко (высокий экран).
 * Видимая ссылка «Показать ещё» — запас: без JS, у роботов и если датчик
 * браузером не поддерживается; обычно до неё не доходят.
 */
export function LoadMore({
  hasMore,
  nextHref,
  onLoadMore,
  shown,
  total,
}: LoadMoreProps): React.ReactElement {
  const dict = useDictionary();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!hasMore || !node || typeof IntersectionObserver === "undefined") {
      return;
    }

    // новый наблюдатель после каждой партии сразу сообщает, видно ли датчик, —
    // так лента дорастает до экрана без дополнительной прокрутки
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore();
        }
      },
      { rootMargin: "0px 0px 1800px 0px" },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, onLoadMore]);

  return (
    <>
      {hasMore ? (
        <div ref={sentinelRef} className="load-more">
          <Link
            href={nextHref}
            scroll={false}
            className="load-more-link"
            onClick={(event) => {
              event.preventDefault();
              onLoadMore();
            }}
          >
            {dict.pagination.loadMore}
          </Link>
        </div>
      ) : null}
      <p className="sr-only" role="status">
        {dict.pagination.shownOf(shown, total)}
      </p>
    </>
  );
}
