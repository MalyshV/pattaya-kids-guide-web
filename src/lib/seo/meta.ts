import type { Metadata } from "next";

/** Целевая длина meta description (рекомендация поисковиков ~150–160). */
const META_DESCRIPTION_MAX = 160;

/** OG-локаль соцсетей из языка страницы (в одном стиле с dateLocale). */
export function ogLocale(lang: string): string {
  return lang === "en" ? "en_GB" : "ru_RU";
}

/**
 * Open Graph для страницы-карточки (место/событие/занятие): под пересылку
 * ссылок в чаты — заголовок, описание, свой URL и фото сущности, если оно есть.
 * Относительные пути (url и imageUrl из public) Next абсолютизирует от
 * metadataBase; ссылки Vercel Blob уже абсолютны и остаются как есть.
 */
export function articleOpenGraph(opts: {
  title: string;
  description: string;
  siteName: string;
  path: string;
  imageUrl: string | null | undefined;
  lang: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: "article",
    siteName: opts.siteName,
    title: opts.title,
    description: opts.description,
    url: opts.path,
    locale: ogLocale(opts.lang),
    ...(opts.imageUrl ? { images: [{ url: opts.imageUrl }] } : {}),
  };
}

/**
 * Описание для <meta name="description">: берёт текст сущности, обрезает по
 * границе слова с многоточием; без текста — отдаёт запасной вариант.
 */
export function metaDescription(
  text: string | null | undefined,
  fallback: string,
): string {
  const source = text?.trim();

  if (!source) {
    return fallback;
  }

  if (source.length <= META_DESCRIPTION_MAX) {
    return source;
  }

  const cut = source.slice(0, META_DESCRIPTION_MAX);
  const lastSpace = cut.lastIndexOf(" ");

  return `${cut.slice(0, lastSpace > META_DESCRIPTION_MAX / 2 ? lastSpace : META_DESCRIPTION_MAX)}…`;
}
