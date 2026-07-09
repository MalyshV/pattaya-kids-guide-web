import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/common/back-to-top";
import { SiteHeader } from "@/components/layout/site-header";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { getDictionary, isSupportedLang, SUPPORTED_LANGS } from "@/content/dictionary";
import { localizedCityName } from "@/lib/i18n/localize";

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

  return {
    title: `${dict.brand} — ${localizedCityName(city, lang)}`,
    // seoDescription в БД пока русский; для en честнее generic-описание словаря
    description:
      lang === "ru"
        ? (city.seoDescription ?? dict.meta.description)
        : dict.meta.description,
    // языковые версии одной страницы (hreflang)
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LANGS.map((l) => [l, cityBasePath(l, citySlug)]),
      ),
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

  return (
    <>
      <SiteHeader basePath={cityBasePath(lang, city)} />
      {children}
      <BackToTop />
    </>
  );
}
