"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ru } from "@/content/ru";

type SiteHeaderProps = {
  basePath: string;
};

export function SiteHeader({ basePath }: SiteHeaderProps): React.ReactElement {
  const pathname = usePathname();
  const isEvents = pathname.startsWith(`${basePath}/events`);
  const isActivities = pathname.startsWith(`${basePath}/activities`);
  const isPlaces = !isEvents && !isActivities;

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={basePath} className="site-brand">
          {ru.brand}
        </Link>

        <nav className="site-nav" aria-label={ru.nav.aria}>
          <Link
            href={basePath}
            className={`site-nav-link${isPlaces ? " site-nav-link-active" : ""}`}
          >
            {ru.nav.places}
          </Link>
          <Link
            href={`${basePath}/events`}
            className={`site-nav-link${isEvents ? " site-nav-link-active" : ""}`}
          >
            {ru.nav.events}
          </Link>
          <Link
            href={`${basePath}/activities`}
            className={`site-nav-link${isActivities ? " site-nav-link-active" : ""}`}
          >
            {ru.nav.activities}
          </Link>
        </nav>
      </div>
    </header>
  );
}
