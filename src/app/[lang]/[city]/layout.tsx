import type { Metadata } from "next";
import { getCityBySlug } from "@/lib/geo/city";
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

export default function CityLayout({ children }: LayoutProps): React.ReactElement {
  return <>{children}</>;
}
