"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SearchBox } from "@/components/common/search-box";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import type { SearchItemDto } from "@/dto/search-item.dto";

/**
 * Лупа в шапке — только на посадочной (решение: первый экран пуст, шапка не
 * перегружена; в каталоге строка поиска и так встроена в страницу). Клик
 * раскрывает панель с обычным SearchBox под шапкой; Escape и клик мимо
 * закрывают. Индекс приходит из layout города — тот же кэш, что у каталога.
 */

type HeaderSearchProps = {
  basePath: string;
  items: SearchItemDto[];
};

export function HeaderSearch({
  basePath,
  items,
}: HeaderSearchProps): React.ReactElement | null {
  const pathname = usePathname();
  const dict = useDictionary();
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const isLanding = pathname === basePath;

  // закрытие по клику мимо панели и по Escape
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onPointerDown = (event: PointerEvent): void => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      // SearchBox пометил Escape обработанным (закрыл подсказки) — панель
      // остаётся, закроется вторым нажатием
      if (event.defaultPrevented) {
        return;
      }
      if (event.key === "Escape") {
        setIsOpen(false);
        // фокус не должен «упасть» в body — возвращаем на лупу
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  // ушли со страницы клиентской навигацией — панель не должна остаться
  // (паттерн «adjusting state when props change», без эффекта)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  if (!isLanding) {
    return null;
  }

  return (
    <div className="header-search" ref={wrapRef}>
      <button
        type="button"
        ref={toggleRef}
        className="header-search-toggle"
        aria-label={dict.search.ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="9" cy="9" r="6" />
          <line x1="13.5" y1="13.5" x2="18" y2="18" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen ? (
        <div className="header-search-panel">
          <SearchBox items={items} autoFocus />
        </div>
      ) : null}
    </div>
  );
}
