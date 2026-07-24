"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useParentMemory } from "@/lib/memory/use-parent-memory";
import { listByKind } from "@/lib/memory/parent-memory";

/**
 * Компактная шапка посадочной: разделы и «память родителя» свёрнуты в две
 * кнопки-иконки с выпадающими списками — первый экран встречает вопросом,
 * а не десятью ссылками (решение Вероники 24.07). На остальных страницах
 * остаётся обычная навигация-строка.
 *
 * Закрытие — по правилу из [[safari-blur-pitfall]]: blur закрывает только
 * при реальном переходе фокуса (Tab), blur «в никуда» (клики/тапы в
 * Safari/iOS) игнорируется; клик мимо ловит pointerdown на document.
 */

function useDisclosure(): {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rootRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onBlur: (event: React.FocusEvent) => void;
} {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpen(false);
        // фокус не должен «упасть» в body вместе с размонтированным пунктом —
        // возвращаем на кнопку (паттерн close(true) из language-menu)
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onBlur = (event: React.FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next !== null && !rootRef.current?.contains(next)) {
      setOpen(false);
    }
  };

  return { open, setOpen, rootRef, buttonRef, onBlur };
}

function HeaderDropdown({
  ariaLabel,
  icon,
  children,
}: {
  ariaLabel: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}): React.ReactElement {
  const { open, setOpen, rootRef, buttonRef, onBlur } = useDisclosure();

  return (
    <div className="header-menu" ref={rootRef} onBlur={onBlur}>
      <button
        type="button"
        ref={buttonRef}
        className="header-menu-trigger"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((value) => !value)}
      >
        {icon}
      </button>
      {open ? (
        <div
          className="header-menu-dropdown"
          // выбор пункта закрывает меню (навигация клиентская — сама не закроет)
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) {
              setOpen(false);
            }
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** Сетка-разделы — в тонком line-art шапки. */
function SectionsIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4.2" y="4.2" width="6.6" height="6.6" rx="1.8" />
      <rect x="13.2" y="4.2" width="6.6" height="6.6" rx="1.8" />
      <rect x="4.2" y="13.2" width="6.6" height="6.6" rx="1.8" />
      <rect x="13.2" y="13.2" width="6.6" height="6.6" rx="1.8" />
    </svg>
  );
}

/** Сердце — вход в «память родителя». */
function HeartIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 19.8S4.4 15 4.4 9.7a4.1 4.1 0 0 1 7.6-2.2A4.1 4.1 0 0 1 19.6 9.7c0 5.3-7.6 10.1-7.6 10.1z" />
    </svg>
  );
}

/** Возраст ребёнка (?age=) — сквозной контекст, как в NavLinks. */
function withAge(href: string, age: string | null): string {
  if (!age) {
    return href;
  }
  return `${href}?${new URLSearchParams({ age }).toString()}`;
}

export function SectionsMenu({
  basePath,
  age,
}: {
  basePath: string;
  age: string | null;
}): React.ReactElement {
  const dict = useDictionary();
  const sections = [
    { href: `${basePath}/places`, label: dict.nav.places },
    { href: `${basePath}/events`, label: dict.nav.events },
    { href: `${basePath}/activities`, label: dict.nav.activities },
    { href: `${basePath}/birthdays`, label: dict.nav.birthdays },
  ];

  return (
    <HeaderDropdown ariaLabel={dict.nav.sectionsAria} icon={<SectionsIcon />}>
      {sections.map((section) => (
        <Link
          key={section.href}
          href={withAge(section.href, age)}
          className="header-menu-item"
        >
          {section.label}
        </Link>
      ))}
    </HeaderDropdown>
  );
}

export function MemoryMenu({
  basePath,
  age,
}: {
  basePath: string;
  age: string | null;
}): React.ReactElement {
  const dict = useDictionary();
  const { items, hydrated } = useParentMemory();
  const savedCount = hydrated ? listByKind(items, "saved").length : 0;
  const visitedCount = hydrated ? listByKind(items, "visited").length : 0;

  return (
    <HeaderDropdown ariaLabel={dict.memory.menuAria} icon={<HeartIcon />}>
      <Link href={withAge(`${basePath}/saved`, age)} className="header-menu-item">
        <span className="header-menu-item-mark" aria-hidden="true">
          ♡
        </span>
        {dict.memory.navSaved}
        {savedCount > 0 ? (
          <span className="header-menu-item-count">{savedCount}</span>
        ) : null}
      </Link>
      <Link
        // query — строго до #visited: withAge после хэша дал бы битый URL
        href={`${withAge(`${basePath}/saved`, age)}#visited`}
        className="header-menu-item"
      >
        <span className="header-menu-item-mark" aria-hidden="true">
          ✓
        </span>
        {dict.memory.navVisited}
        {visitedCount > 0 ? (
          <span className="header-menu-item-count">{visitedCount}</span>
        ) : null}
      </Link>
    </HeaderDropdown>
  );
}
