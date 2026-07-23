"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MIN_QUERY_LENGTH, searchItems } from "@/lib/search/match";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import type { SearchItemDto } from "@/dto/search-item.dto";

/**
 * Строка поиска по местам и занятиям. Индекс приезжает с сервера целиком
 * (каталог маленький) — подсказки считаются на клиенте мгновенно, без
 * запросов. Выбор ведёт на страницу места/занятия.
 */

type SearchBoxProps = {
  items: SearchItemDto[];
  /** true — фокус в поле сразу после появления (лупа в шапке раскрывает
      панель: без фокуса пришлось бы кликать второй раз) */
  autoFocus?: boolean;
};

export function SearchBox({ items, autoFocus }: SearchBoxProps): React.ReactElement {
  const dict = useDictionary();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => searchItems(items, query), [items, query]);
  const showEmpty =
    isOpen && query.trim().length >= MIN_QUERY_LENGTH && results.length === 0;
  const showList = isOpen && results.length > 0;

  function close(): void {
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function go(item: SearchItemDto): void {
    close();
    setQuery("");
    router.push(item.url);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (!showList) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      // Enter без стрелки — самый частый жест: переходим на выделенный
      // результат, а если ничего не выделено — на первый (обычно он и нужен)
      const target = activeIndex >= 0 ? results[activeIndex] : results[0];
      if (target) {
        event.preventDefault();
        go(target);
      }
    }
  }

  // закрытие по уходу фокуса за пределы всего блока (input + список)
  function handleBlur(event: React.FocusEvent<HTMLDivElement>): void {
    if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
      close();
    }
  }

  return (
    <div className="search-box" ref={containerRef} onBlur={handleBlur}>
      <div className="search-input-wrap">
        <svg
          className="search-icon"
          viewBox="0 0 20 20"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="9" cy="9" r="6" />
          <line x1="13.5" y1="13.5" x2="18" y2="18" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          className="search-input"
          // управляемый autoFocus для панели из лупы; глобально не мешает —
          // на страницах со встроенной строкой проп не передаётся
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={showList}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `search-option-${activeIndex}` : undefined
          }
          aria-label={dict.search.ariaLabel}
          placeholder={dict.search.placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {showList ? (
        <ul className="search-results" id="search-results" role="listbox">
          {results.map((item, index) => (
            <li
              key={item.id}
              id={`search-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={`search-result${index === activeIndex ? " search-result-active" : ""}`}
              // onMouseDown вместо onClick: клик не должен проиграть blur'у input
              onMouseDown={(event) => {
                event.preventDefault();
                go(item);
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="search-result-row">
                <span className="search-result-name">{item.name}</span>
                <span className="search-result-type">
                  {item.type === "place"
                    ? dict.search.typePlace
                    : item.type === "activity"
                      ? dict.search.typeActivity
                      : dict.search.typeEvent}
                </span>
              </div>
              {item.hint ? <div className="search-result-hint">{item.hint}</div> : null}
            </li>
          ))}
        </ul>
      ) : null}

      {showEmpty ? (
        <div className="search-results search-empty" role="status">
          {dict.search.empty}
        </div>
      ) : null}
    </div>
  );
}
