import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SuggestFormLoader } from "@/components/suggest/suggest-form-loader";
import { getDictionary, isSupportedLang } from "@/content/dictionary";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { localizedCityName } from "@/lib/i18n/localize";
import { getSingleSearchParam } from "@/lib/params/search-params";
import { KIND_LIST_PATH, parseSuggestKind } from "@/lib/suggest/submission";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

// Здесь же выполняется отправка формы с фото: sharp + до 5 загрузок в Blob.
// Обычно это доли секунды; потолок — с запасом над 5 фото × тайм-аут sharp
// (5 с), иначе на тарифе без Fluid функцию убило бы через 10 с посреди работы.
export const maxDuration = 60;

// служебная страница — из поиска прячем (и в sitemap её нет)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isSupportedLang(lang) ? lang : "ru");
  return {
    title: dict.suggest.metaTitle,
    robots: { index: false, follow: false },
  };
}

export default async function SuggestPage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) {
    notFound();
  }
  const dict = getDictionary(lang);
  const basePath = cityBasePath(lang, citySlug);
  const resolved = (await searchParams) ?? {};
  // тип — лишь предвыбор: в форме его видно и можно поменять
  const presetKind = parseSuggestKind(getSingleSearchParam(resolved.type)) ?? "place";

  return (
    <main className="page-shell suggest-page">
      <Link href={`${basePath}${KIND_LIST_PATH[presetKind]}`} className="back-link">
        {dict.suggest.back}
      </Link>

      <section className="hero">
        <p className="eyebrow">{localizedCityName(city, lang)}</p>
        <h1 className="hero-title">{dict.suggest.heroTitle}</h1>
        <p className="hero-description">{dict.suggest.heroDescription}</p>
      </section>

      <SuggestFormLoader city={city.slug} presetKind={presetKind} />
    </main>
  );
}
