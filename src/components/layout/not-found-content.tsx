import Link from "next/link";
import { cityBasePath, DEFAULT_CITY_SLUG, DEFAULT_LANG } from "@/lib/geo/city";
import { ru } from "@/content/ru";

/**
 * Содержимое страницы 404 — общее для корневой (мимо всех роутов) и городской
 * (notFound() из страниц места/события) границ. Спокойный тон, без упрёка.
 */
export function NotFoundContent(): React.ReactElement {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{ru.notFound.eyebrow}</p>
        <h1 className="hero-title">{ru.notFound.title}</h1>
        <p className="hero-description">{ru.notFound.description}</p>
        <p>
          <Link
            href={cityBasePath(DEFAULT_LANG, DEFAULT_CITY_SLUG)}
            className="back-link"
          >
            {ru.notFound.cta}
          </Link>
        </p>
      </section>
    </main>
  );
}
