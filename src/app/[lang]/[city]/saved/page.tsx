import type { Metadata } from "next";
import { SavedList } from "@/components/memory/saved-list";
import { getDictionary, isSupportedLang } from "@/content/dictionary";
import { getSingleSearchParam } from "@/lib/params/search-params";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

// Личная страница (закладки конкретного браузера) — из поиска прячем.
// title свой: иначе все вкладки браузера называются одинаково по городу.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isSupportedLang(lang) ? lang : "ru");
  return {
    title: `${dict.memory.pageTitle} — ${dict.brand}`,
    robots: { index: false, follow: false },
  };
}

export default async function SavedPage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  // возраст — сквозной контекст: страница его не применяет, но обязана донести
  // обратно в каталог через «← К местам», чтобы выбор родителя не слетал
  const resolved = (await searchParams) ?? {};
  return <SavedList age={getSingleSearchParam(resolved.age) ?? null} />;
}
