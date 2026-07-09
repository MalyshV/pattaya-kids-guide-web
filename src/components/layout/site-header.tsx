"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ru } from "@/content/ru";

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
  const isEvents = pathname.startsWith(`${basePath}/events`);
  const isActivities = pathname.startsWith(`${basePath}/activities`);
  const isPlaces = !isEvents && !isActivities;

  return (
    <nav className="site-nav" aria-label={ru.nav.aria}>
      <Link
        href={withAge(basePath, age)}
        className={`site-nav-link${isPlaces ? " site-nav-link-active" : ""}`}
      >
        {ru.nav.places}
      </Link>
      <Link
        href={withAge(`${basePath}/events`, age)}
        className={`site-nav-link${isEvents ? " site-nav-link-active" : ""}`}
      >
        {ru.nav.events}
      </Link>
      <Link
        href={withAge(`${basePath}/activities`, age)}
        className={`site-nav-link${isActivities ? " site-nav-link-active" : ""}`}
      >
        {ru.nav.activities}
      </Link>
    </nav>
  );
}

function NavLinksWithAge({ basePath }: { basePath: string }): React.ReactElement {
  const searchParams = useSearchParams();
  return <NavLinks basePath={basePath} age={searchParams.get("age")} />;
}

export function SiteHeader({ basePath }: SiteHeaderProps): React.ReactElement {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={basePath} className="site-brand">
          {ru.brand}
        </Link>

        {/* useSearchParams требует Suspense; fallback — те же ссылки без age */}
        <Suspense fallback={<NavLinks basePath={basePath} age={null} />}>
          <NavLinksWithAge basePath={basePath} />
        </Suspense>
      </div>
    </header>
  );
}
