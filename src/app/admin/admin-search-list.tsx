"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  countByVisibility,
  filterAdminItems,
  type AdminListItem,
  type VisibilityFilter,
} from "@/lib/admin/list-search";

const VISIBILITY_LABEL: Record<VisibilityFilter, string> = {
  all: "Все",
  live: "На сайте",
  hidden: "Скрытые",
};

type Props = {
  items: readonly AdminListItem[];
  initialQuery: string;
  initialShow: VisibilityFilter;
  placeholder: string;
};

/**
 * Список админки с поиском и фильтром «на сайте / скрытые». Фильтрует в
 * браузере при наборе; запрос и фильтр пишутся в адрес (?q=…&show=…), чтобы
 * после открытия записи кнопка «назад» вернула к тому же отбору.
 */
export function AdminSearchList({
  items,
  initialQuery,
  initialShow,
  placeholder,
}: Props): React.ReactElement {
  const [query, setQuery] = useState(initialQuery);
  const [show, setShow] = useState<VisibilityFilter>(initialShow);

  const counts = useMemo(() => countByVisibility(items), [items]);
  const visible = useMemo(
    () => filterAdminItems(items, query, show),
    [items, query, show],
  );
  const filtered = query.trim() !== "" || show !== "all";

  function syncUrl(nextQuery: string, nextShow: VisibilityFilter): void {
    const params = new URLSearchParams(window.location.search);
    if (nextQuery.trim()) {
      params.set("q", nextQuery);
    } else {
      params.delete("q");
    }
    if (nextShow === "all") {
      params.delete("show");
    } else {
      params.set("show", nextShow);
    }
    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      search ? `?${search}` : window.location.pathname,
    );
  }

  function changeQuery(next: string): void {
    setQuery(next);
    syncUrl(next, show);
  }

  function changeShow(next: VisibilityFilter): void {
    setShow(next);
    syncUrl(query, next);
  }

  return (
    <>
      <div className="admin-search" role="search">
        <input
          type="search"
          className="admin-search-input"
          value={query}
          onChange={(event) => changeQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              changeQuery("");
            }
          }}
          placeholder={placeholder}
          aria-label="Поиск по списку"
          autoComplete="off"
          spellCheck={false}
        />
        <div className="admin-search-filters" role="group" aria-label="Показывать">
          {(Object.keys(VISIBILITY_LABEL) as VisibilityFilter[]).map((filter) => (
            <button
              key={filter}
              type="button"
              className="admin-search-chip"
              aria-pressed={show === filter}
              onClick={() => changeShow(filter)}
            >
              {VISIBILITY_LABEL[filter]} · {counts[filter]}
            </button>
          ))}
        </div>
        <p className="admin-search-status" aria-live="polite">
          {filtered ? `Найдено: ${visible.length} из ${items.length}` : ""}
        </p>
      </div>

      {visible.length > 0 ? (
        <ul className="admin-list">
          {visible.map((item) => (
            <li key={item.id} className="admin-list-item">
              <Link href={item.href} className="admin-item-link">
                <span className="admin-item-name">{item.name}</span>
                <span className="admin-item-meta">{item.meta}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="admin-search-empty">
          Ничего не нашлось. Попробуйте другое слово или фильтр «Все».
        </p>
      )}
    </>
  );
}
