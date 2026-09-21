"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useParentMemory } from "@/lib/memory/use-parent-memory";
import { listByKind } from "@/lib/memory/parent-memory";
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

function NavLinks({
  basePath,
  age,
}: {
  basePath: string;
  age: string | null;
}): React.ReactElement {
  const pathname = usePathname();
  const dict = useDictionary();
  const { items, hydrated } = useParentMemory();

  const isEvents = pathname.startsWith(`${basePath}/events`);
  const isActivities = pathname.startsWith(`${basePath}/activities`);
  const isBirthdays = pathname.startsWith(`${basePath}/birthdays`);
  const isSaved = pathname.startsWith(`${basePath}/saved`);
  // каталог и детальные места живут под /places; корень города — посадочная,
  // на ней ни один пункт меню не активен
  const isPlaces = pathname.startsWith(`${basePath}/places`);
  // два счётчика: ♡ сохранённое и ✓ посещённое — обе функции видны из шапки,
  // родителю не нужно догадываться, что внутри «одной кнопки» живут две
  const savedCount = hydrated ? listByKind(items, "saved").length : 0;
  const visitedCount = hydrated ? listByKind(items, "visited").length : 0;

  return (
    <nav className="site-nav site-nav-wide" aria-label={dict.nav.aria}>
      <Link
        href={withAge(`${basePath}/places`, age)}
        className={`site-nav-link${isPlaces ? " site-nav-link-active" : ""}`}
      >
        {dict.nav.places}
      </Link>
      <Link
        href={withAge(`${basePath}/events`, age)}
        className={`site-nav-link${isEvents ? " site-nav-link-active" : ""}`}
      >
        {dict.nav.events}
      </Link>
      <Link
        href={withAge(`${basePath}/activities`, age)}
        className={`site-nav-link${isActivities ? " site-nav-link-active" : ""}`}
      >
        {dict.nav.activities}
      </Link>
      <Link
        href={withAge(`${basePath}/birthdays`, age)}
        className={`site-nav-link${isBirthdays ? " site-nav-link-active" : ""}`}
      >
        {dict.nav.birthdays}
      </Link>
      <Link
        href={withAge(`${basePath}/saved`, age)}
        className={`site-nav-link site-nav-saved${isSaved ? " site-nav-link-active" : ""}`}
      >
        <span className="site-nav-saved-icon" aria-hidden="true">
          ♡
        </span>
        {dict.memory.navSaved}
        {savedCount > 0 ? (
          <span className="site-nav-saved-count">{savedCount}</span>
        ) : null}
      </Link>
      <Link
        // query — строго до #visited: withAge после хэша дал бы битый URL
        href={`${withAge(`${basePath}/saved`, age)}#visited`}
        className={`site-nav-link site-nav-saved${isSaved ? " site-nav-link-active" : ""}`}
      >
        <span className="site-nav-saved-icon" aria-hidden="true">
          ✓
        </span>
        {dict.memory.navVisited}
        {visitedCount > 0 ? (
          <span className="site-nav-saved-count">{visitedCount}</span>
        ) : null}
      </Link>
    </nav>
  );
}

/**
 * Навигация шапки. Посадочная встречает вопросом, а не десятью ссылками:
 * разделы и память родителя всегда свёрнуты в кнопки-меню. На внутренних
 * страницах в разметке оба вида — строка (широкий экран) и те же кнопки-меню
 * (телефон, планшет: строка там ломалась на 2–4 этажа); какой виден, решает
 * CSS по ширине (.site-nav-wide / .header-compact-nav-inner), поэтому сервер и
 * клиент рисуют одно и то же и шапка не мигает при гидрации. Тема в
 * компактном виде уезжает пунктом в меню разделов — в строке ей нет места.
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

  if (isLanding) {
    // тот же nav-ориентир, что у NavLinks: скринридер находит навигацию
    // и на посадочной, просто в свёрнутом виде
    return (
      <nav className="header-compact-nav" aria-label={dict.nav.aria}>
        <SectionsMenu basePath={basePath} age={age} />
        <MemoryMenu basePath={basePath} age={age} />
      </nav>
    );
  }

  // скрытый стилями nav (display:none) выпадает и из дерева доступности —
  // ориентир «Разделы сайта» у скринридера всегда один
  return (
    <>
      <NavLinks basePath={basePath} age={age} />
      <nav
        className="header-compact-nav header-compact-nav-inner"
        aria-label={dict.nav.aria}
      >
        <SectionsMenu basePath={basePath} age={age} withTheme />
        <MemoryMenu basePath={basePath} age={age} />
      </nav>
    </>
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
