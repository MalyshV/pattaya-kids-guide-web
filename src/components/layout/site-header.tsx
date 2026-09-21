"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { markClientNavigation } from "@/components/common/smart-back-link";
import { HeaderSearch } from "@/components/layout/header-search";
import { MemoryMenu, SectionsMenu } from "@/components/layout/header-menus";
import { LanguageMenu } from "@/components/layout/language-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { SearchItemDto } from "@/dto/search-item.dto";

type SiteHeaderProps = {
  basePath: string;
  /** индекс для лупы-поиска (сама лупа видна только на посадочной) */
  searchItems?: SearchItemDto[];
};

// Возраст ребёнка (?age=) — сквозной контекст: шапка переносит его между
// разделами, чтобы выбор не слетал при переходе Места ↔ События ↔ Занятия.
function withAge(href: string, age: string | null): string {
  if (!age) {
    return href;
  }
  const params = new URLSearchParams({ age });
  return `${href}?${params.toString()}`;
}

/** Разделы строкой — широкий экран внутренних страниц. */
function SectionLinks({
  basePath,
  age,
}: {
  basePath: string;
  age: string | null;
}): React.ReactElement {
  const pathname = usePathname();
  const dict = useDictionary();

  // каталог и детальные места живут под /places; корень города — посадочная,
  // на ней ни один пункт не активен
  const sections = [
    { href: `${basePath}/places`, label: dict.nav.places },
    { href: `${basePath}/events`, label: dict.nav.events },
    { href: `${basePath}/activities`, label: dict.nav.activities },
    { href: `${basePath}/birthdays`, label: dict.nav.birthdays },
  ];

  return (
    <div className="site-nav site-nav-wide">
      {sections.map((section) => {
        // как в меню разделов: сам раздел — page, карточка внутри — true
        const current =
          pathname === section.href
            ? "page"
            : pathname.startsWith(`${section.href}/`)
              ? "true"
              : undefined;
        return (
          <Link
            key={section.href}
            href={withAge(section.href, age)}
            aria-current={current}
            className={`site-nav-link${current ? " site-nav-link-active" : ""}`}
          >
            {section.label}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Навигация шапки — один ориентир «Разделы сайта» на всех страницах.
 * Память родителя везде одна дверь: значок ♡✓ с меню «Сохранённое · Были
 * здесь» (решение Вероники 21.09 вместо двух ссылок на одну страницу — обе
 * функции и их счётчики видны в меню до перехода). Разделы: на посадочной
 * всегда свёрнуты в меню ▦ (первый экран встречает вопросом); на внутренних
 * страницах в разметке и строка (широкий экран), и меню ▦ (телефон, планшет) —
 * какой вид показать, решает CSS по ширине, поэтому гидрация не мигает. Тема
 * на узком экране уезжает пунктом в меню ▦ — в строке ей нет места.
 */
function HeaderNav({
  basePath,
  age,
  isLanding,
}: {
  basePath: string;
  age: string | null;
  isLanding: boolean;
}): React.ReactElement {
  const dict = useDictionary();

  return (
    <nav className="header-compact-nav" aria-label={dict.nav.aria}>
      {isLanding ? (
        <SectionsMenu basePath={basePath} age={age} />
      ) : (
        <>
          <SectionLinks basePath={basePath} age={age} />
          <div className="header-sections-compact">
            <SectionsMenu basePath={basePath} age={age} withTheme />
          </div>
        </>
      )}
      <MemoryMenu basePath={basePath} age={age} />
    </nav>
  );
}

function HeaderRight({
  basePath,
  searchItems,
}: {
  basePath: string;
  searchItems?: SearchItemDto[];
}): React.ReactElement {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const age = searchParams.get("age");
  const isLanding = pathname === basePath;

  return (
    <div className={`site-header-right${isLanding ? "" : " site-header-right-inner"}`}>
      <HeaderNav basePath={basePath} age={age} isLanding={isLanding} />
      {searchItems ? <HeaderSearch basePath={basePath} items={searchItems} /> : null}
      <ThemeToggle />
      <LanguageMenu />
    </div>
  );
}

export function SiteHeader({
  basePath,
  searchItems,
}: SiteHeaderProps): React.ReactElement {
  const pathname = usePathname();
  const isLanding = pathname === basePath;

  // Считаем клиентские переходы для SmartBackLink: только смену pathname,
  // первый рендер страницы переходом не является. Живёт в SiteHeader (а не в
  // NavLinks): на посадочной вместо NavLinks рендерятся кнопки-меню, а шапка
  // смонтирована всегда — иначе первый переход с посадочной не считался бы
  // и «← Назад» на детальной вёл бы в каталог вместо возврата.
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      markClientNavigation();
    }
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={basePath} className="site-brand">
          Pattaya Kids Guide
        </Link>

        {/* useSearchParams требует Suspense; fallback — те же ссылки без age */}
        <Suspense
          fallback={
            <div
              className={`site-header-right${isLanding ? "" : " site-header-right-inner"}`}
            >
              <HeaderNav basePath={basePath} age={null} isLanding={isLanding} />
              <ThemeToggle />
            </div>
          }
        >
          <HeaderRight basePath={basePath} searchItems={searchItems} />
        </Suspense>
      </div>
    </header>
  );
}
