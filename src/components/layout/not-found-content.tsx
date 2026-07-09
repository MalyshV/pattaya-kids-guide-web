"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { langFromPath } from "@/content/dictionary";
import { cityBasePath, DEFAULT_CITY_SLUG } from "@/lib/geo/base-path";
import { useDictionary } from "@/lib/i18n/use-dictionary";

/**
 * Содержимое страницы 404 — общее для корневой (мимо всех роутов) и городской
 * (notFound() из страниц места/события) границ. Спокойный тон, без упрёка.
 */
export function NotFoundContent(): React.ReactElement {
  const dict = useDictionary();
  const pathname = usePathname();

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{dict.notFound.eyebrow}</p>
        <h1 className="hero-title">{dict.notFound.title}</h1>
        <p className="hero-description">{dict.notFound.description}</p>
        <p>
          <Link
            href={cityBasePath(langFromPath(pathname), DEFAULT_CITY_SLUG)}
            className="back-link"
          >
            {dict.notFound.cta}
          </Link>
        </p>
      </section>
    </main>
  );
}
