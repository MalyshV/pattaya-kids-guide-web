import Link from "next/link";
import { ExternalArrow } from "@/components/common/external-arrow";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ClearSuggestDraft } from "@/components/suggest/clear-suggest-draft";
import { TELEGRAM_WEB } from "@/lib/contacts/contact-link";
import { getDictionary, isSupportedLang } from "@/content/dictionary";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { getSingleSearchParam } from "@/lib/params/search-params";
import { KIND_LIST_PATH, parseSuggestKind } from "@/lib/suggest/submission";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/** канал, куда автопостинг приносит новые места и события. telegram.me, а не
    t.me: у части тайских провайдеров t.me не открывается (см. contact-link) */
const TELEGRAM_CHANNEL_URL = `${TELEGRAM_WEB}/pattayakidsguide`;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isSupportedLang(lang) ? lang : "ru");
  return {
    title: dict.suggest.thanks.metaTitle,
    robots: { index: false, follow: false },
  };
}

export default async function SuggestThanksPage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) {
    notFound();
  }
  const dict = getDictionary(lang);
  const t = dict.suggest.thanks;
  const basePath = cityBasePath(lang, citySlug);
  const kind =
    parseSuggestKind(getSingleSearchParam(((await searchParams) ?? {}).type)) ?? "place";

  return (
    <main className="page-shell">
      <ClearSuggestDraft />
      {/* role=status: после отправки скринридер сразу озвучит «Спасибо» */}
      <section className="empty-state suggest-thanks" role="status">
        <p className="suggest-thanks-mark" aria-hidden="true">
          ✓
        </p>
        <h1 className="suggest-thanks-title">{t.title}</h1>
        <p>{t.text}</p>
        <p className="suggest-thanks-telegram">
          {t.telegramText}{" "}
          <a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
            {t.telegramCta} <ExternalArrow />
            <span className="sr-only"> {dict.common.opensInNewTab}</span>
          </a>
        </p>
        <div className="suggest-thanks-actions">
          <Link href={`${basePath}/suggest?type=${kind}`} className="empty-state-cta">
            {t.again}
          </Link>
          <Link
            href={`${basePath}${KIND_LIST_PATH[kind]}`}
            className="suggest-thanks-back"
          >
            {t.back}
          </Link>
        </div>
      </section>
    </main>
  );
}
