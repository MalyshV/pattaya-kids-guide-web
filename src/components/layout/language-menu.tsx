"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SUPPORTED_LANGS, type Lang } from "@/content/dictionary";
import { useDictionary, useLang } from "@/lib/i18n/use-dictionary";

// Самоназвания языков (endonyms): каждый язык подписан на самом себе — так
// пользователь узнаёт свой язык независимо от текущего интерфейса. НЕ переводим.
const ENDONYMS: Record<Lang, string> = {
  ru: "Русский",
  en: "English",
  th: "ไทย",
};

/** Тонкий глобус — очевидный и спокойный знак выбора языка (в тон calm-first). */
function GlobeIcon(): React.ReactElement {
  return (
    <svg
      className="lang-menu-globe"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      {/* меридиан + параллели — узнаётся как «глобус», штрихи лёгкие */}
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3.2 9.5h17.6M3.2 14.5h17.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Выбор языка: кнопка-глобус с текущим кодом → раскрывающийся список языков.
 * Это disclosure (кнопка + список навигационных ссылок), а НЕ ARIA-menu:
 * пункты меняют URL, поэтому остаются нативными ссылками с aria-current у
 * текущего языка. Заменяет только языковой сегмент пути, query и #-хэш
 * сохраняются. Доступно с клавиатуры (стрелки листают, Esc закрывает и
 * возвращает фокус), закрывается кликом вне, уходом фокуса и после выбора.
 */
export function LanguageMenu(): React.ReactElement {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLang = useLang();
  const dict = useDictionary();

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const query = searchParams.toString();

  const hrefFor = (lang: string): string => {
    const segments = pathname.split("/");
    segments[1] = lang;
    // хэш живёт только в браузере (usePathname/useSearchParams его не содержат);
    // список раскрыт только на клиенте, поэтому window тут всегда доступен
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    return `${segments.join("/")}${query ? `?${query}` : ""}${hash}`;
  };

  const close = (returnFocus: boolean): void => {
    setOpen(false);
    if (returnFocus) {
      buttonRef.current?.focus();
    }
  };

  // клик вне и Esc закрывают меню
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
        close(true);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // при открытии фокус уходит на текущий язык — сразу листается стрелками
  useEffect(() => {
    if (open) {
      const activeIndex = SUPPORTED_LANGS.indexOf(currentLang);
      itemRefs.current[activeIndex >= 0 ? activeIndex : 0]?.focus();
    }
  }, [open, currentLang]);

  // стрелки перемещают фокус по пунктам (циклично), Home/End — к краям
  const onListKeyDown = (event: React.KeyboardEvent): void => {
    const count = SUPPORTED_LANGS.length;
    const current = itemRefs.current.findIndex((el) => el === document.activeElement);
    let next = -1;
    if (event.key === "ArrowDown") next = (current + 1) % count;
    else if (event.key === "ArrowUp") next = (current - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    if (next >= 0) {
      event.preventDefault();
      itemRefs.current[next]?.focus();
    }
  };

  // уход фокуса за пределы меню (напр. по Tab) — закрываем, чтобы не оставлять
  // раскрытый список без фокуса
  const onRootBlur = (event: React.FocusEvent): void => {
    if (!rootRef.current?.contains(event.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div className="lang-menu" ref={rootRef} onBlur={onRootBlur}>
      <button
        ref={buttonRef}
        type="button"
        className="lang-menu-trigger"
        aria-expanded={open}
        aria-label={`${dict.nav.langAria}: ${ENDONYMS[currentLang]}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(event) => {
          if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <GlobeIcon />
        <span className="lang-menu-current">{currentLang.toUpperCase()}</span>
        <span className="lang-menu-caret" aria-hidden="true" />
      </button>

      {open ? (
        <div className="lang-menu-dropdown" onKeyDown={onListKeyDown}>
          {SUPPORTED_LANGS.map((lang, index) => {
            const isActive = lang === currentLang;
            return (
              <Link
                key={lang}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                href={hrefFor(lang)}
                aria-current={isActive ? "true" : undefined}
                className={`lang-menu-item${isActive ? " lang-menu-item-active" : ""}`}
                onClick={() => close(false)}
              >
                <span className="lang-menu-item-name" lang={lang}>
                  {ENDONYMS[lang]}
                </span>
                <span className="lang-menu-item-code">{lang.toUpperCase()}</span>
                {isActive ? (
                  <span className="lang-menu-item-check" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
