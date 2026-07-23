import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Корень города — будущая посадочная («Что ищете прямо сейчас?», PR-2).
 * Пока её нет — временный redirect (307, не кэшируется навсегда) в каталог.
 * Query переносим целиком: старые расшаренные ссылки вида
 * `/ru/pattaya?openNow=true&age=…` продолжают открывать каталог с фильтрами.
 */
export default async function CityLandingPage({
  params,
  searchParams,
}: PageProps): Promise<never> {
  const { lang, city } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    const single = Array.isArray(value) ? value[0] : value;
    if (single != null) {
      query.set(key, single);
    }
  }

  const suffix = query.size > 0 ? `?${query.toString()}` : "";
  redirect(`/${lang}/${city}/places${suffix}`);
}
