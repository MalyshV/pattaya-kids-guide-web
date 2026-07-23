import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/common/back-to-top";
import { SiteHeader } from "@/components/layout/site-header";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { getSearchRows } from "@/services/search.service";
import { getSearchIndex } from "@/lib/search/search-index";
import { getDictionary, isSupportedLang } from "@/content/dictionary";
import { hreflangLanguages } from "@/lib/seo/meta";

type LayoutProps = {
  params: Promise<{ lang: string; city: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}): Promise<Metadata> {
  const { lang, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city || !isSupportedLang(lang)) {
    return {};
  }

  const dict = getDictionary(lang);

  // title здесь НЕ задаём: у каждой страницы под городом свой (корень города —
  // в page.tsx), а бренд-суффикс добавляет template из [lang]/layout. Слой
  // города отвечает за общие description, hreflang и noindex-гейт.
  return {
    // seoDescription в БД пока русский; для en честнее generic-описание словаря
    description:
      lang === "ru"
        ? (city.seoDescription ?? dict.meta.description)
        : dict.meta.description,
    // hreflang по умолчанию (наследуют страницы без своих alternates, напр.
    // saved); страницы каталога/детальные задают полный набор сами
    alternates: {
      languages: hreflangLanguages(citySlug),
    },
    // SEO-гейт: ненаполненный город не индексируется, пока не опубликован
    robots: city.isPublished ? undefined : { index: false, follow: false },
  };
}

export default async function CityLayout({
  params,
  children,
}: LayoutProps): Promise<React.ReactElement> {
  const { lang, city } = await params;

  // неизвестный язык — честный 404, а не русские тексты под чужим URL
  if (!isSupportedLang(lang)) {
    notFound();
  }

  // неизвестный город падает в КОРНЕВОЙ 404 отсюда: иначе отрендерилась бы
  // шапка с basePath несуществующего города — пять битых ссылок, каждая ведёт
  // в новый 404 (getCityBySlug под React cache — страница возьмёт из кэша)
  const cityEntity = await getCityBySlug(city);
  if (!cityEntity) {
    notFound();
  }

  const dict = getDictionary(lang);

  // Индекс для лупы в шапке посадочной: тот же кэшированный запрос, что
  // собирает строку поиска каталога. Осознанный размен: индекс уезжает в
  // payload каждой страницы города, хотя лупа видна только на посадочной —
  // зато после клиентского перехода на неё лупа работает мгновенно; каталог
  // крошечный (десятки записей). Вырастет — перейти на ленивую подгрузку
  // индекса при первом открытии панели.
  const searchRows = await getSearchRows(cityEntity.id);
  const basePath = cityBasePath(lang, city);
  const searchIndex = getSearchIndex(
    searchRows.places,
    searchRows.activities,
    searchRows.events,
    basePath,
    lang,
  );

  return (
    <>
      {/* skip-ссылка: первый фокус на странице уводит мимо 8+ ссылок шапки
          прямо к контенту (WCAG 2.4.1). Видна только при фокусе (globals.css) */}
      <a href="#main-content" className="skip-link">
        {dict.nav.skipToContent}
      </a>
      <SiteHeader basePath={basePath} searchItems={searchIndex} />
      {/* цель skip-ссылки: tabIndex=-1 — чтобы фокус реально сюда переехал */}
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <BackToTop />
    </>
  );
}
