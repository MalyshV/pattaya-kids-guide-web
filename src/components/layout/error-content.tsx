"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { langFromPath } from "@/content/dictionary";
import { cityBasePath, DEFAULT_CITY_SLUG } from "@/lib/geo/base-path";
import { useDictionary } from "@/lib/i18n/use-dictionary";

/**
 * Содержимое страницы ошибки (сбой рендера/сервера) — общий вид для error.tsx.
 * Спокойный тон без техножаргона: родитель не виноват. Кнопка «Попробовать
 * снова» перемонтирует упавший сегмент (reset), ссылка уводит в каталог.
 * Язык берём из пути (провайдера словаря нет — надёжно даже при сбое).
 */
export function ErrorContent({ reset }: { reset?: () => void }): React.ReactElement {
  const dict = useDictionary();
  const pathname = usePathname();

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{dict.errorPage.eyebrow}</p>
        <h1 className="hero-title">{dict.errorPage.title}</h1>
        <p className="hero-description">{dict.errorPage.description}</p>
        <div className="error-actions">
          {reset ? (
            <button type="button" className="primary-button" onClick={reset}>
              {dict.errorPage.retry}
            </button>
          ) : null}
          <Link
            href={cityBasePath(langFromPath(pathname), DEFAULT_CITY_SLUG)}
            className="back-link"
          >
            {dict.errorPage.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}
