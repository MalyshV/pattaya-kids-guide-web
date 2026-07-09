"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SUPPORTED_LANGS } from "@/content/dictionary";
import { useDictionary, useLang } from "@/lib/i18n/use-dictionary";

type SiteHeaderProps = {
  basePath: string;
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
  const isEvents = pathname.startsWith(`${basePath}/events`);
  const isActivities = pathname.startsWith(`${basePath}/activities`);
  const isBirthdays = pathname.startsWith(`${basePath}/birthdays`);
  const isPlaces = !isEvents && !isActivities && !isBirthdays;

  return (
    <nav className="site-nav" aria-label={dict.nav.aria}>
      <Link
        href={withAge(basePath, age)}
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
    </nav>
  );
}

/** RU | EN: тот же путь с заменённым языковым сегментом, query сохраняется. */
function LangSwitch(): React.ReactElement {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLang = useLang();

  const query = searchParams.toString();

  return (
    <div className="lang-switch" aria-label="Language">
      {SUPPORTED_LANGS.map((lang) => {
        const segments = pathname.split("/");
        segments[1] = lang;
        const href = `${segments.join("/")}${query ? `?${query}` : ""}`;
        const isActive = lang === currentLang;

        return (
          <Link
            key={lang}
            href={href}
            className={`lang-switch-link${isActive ? " lang-switch-active" : ""}`}
            aria-current={isActive ? "true" : undefined}
          >
            {lang.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}

function HeaderRight({ basePath }: { basePath: string }): React.ReactElement {
  const searchParams = useSearchParams();
  return (
    <div className="site-header-right">
      <NavLinks basePath={basePath} age={searchParams.get("age")} />
      <LangSwitch />
    </div>
  );
}

export function SiteHeader({ basePath }: SiteHeaderProps): React.ReactElement {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={basePath} className="site-brand">
          Pattaya Kids Guide
        </Link>

        {/* useSearchParams требует Suspense; fallback — те же ссылки без age */}
        <Suspense
          fallback={
            <div className="site-header-right">
              <NavLinks basePath={basePath} age={null} />
            </div>
          }
        >
          <HeaderRight basePath={basePath} />
        </Suspense>
      </div>
    </header>
  );
}
