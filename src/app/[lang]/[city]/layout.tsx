import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { ru } from "@/content/ru";

type LayoutProps = {
  params: Promise<{ lang: string; city: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  return {
    title: `${ru.brand} — ${city.name}`,
    description: city.seoDescription ?? ru.meta.description,
    // SEO-гейт: ненаполненный город не индексируется, пока не опубликован
    robots: city.isPublished ? undefined : { index: false, follow: false },
  };
}

export default async function CityLayout({
  params,
  children,
}: LayoutProps): Promise<React.ReactElement> {
  const { lang, city } = await params;

  return (
    <>
      <SiteHeader basePath={cityBasePath(lang, city)} />
      {children}
    </>
  );
}
