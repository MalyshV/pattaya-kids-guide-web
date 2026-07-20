import type { Metadata } from "next";
import { SUPPORTED_LANGS } from "@/content/dictionary";
import { cityBasePath } from "@/lib/geo/base-path";

/** Целевая длина meta description (рекомендация поисковиков ~150–160). */
const META_DESCRIPTION_MAX = 160;

/**
 * alternates для страницы-списка: self-canonical на ЧИСТЫЙ URL раздела (без
 * ?page=, ?view=map, ?age= — иначе Google индексирует их как отдельные дубли и
 * дробит вес) + hreflang на языковые версии этого же раздела. Next мёржит
 * metadata поверхностно и НЕ углубляется в alternates: layout задаёт languages
 * для корня города, поэтому на подстранице повторяем ОБЕ части здесь, иначе
 * потеряли бы hreflang. Относительные пути Next абсолютизирует от metadataBase.
 * robots (noindex-гейт ненаполненного города) лежит в отдельном ключе и
 * наследуется из layout — его это не затрагивает.
 */
export function listPageAlternates(
  lang: string,
  citySlug: string,
  subPath = "",
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: `${cityBasePath(lang, citySlug)}${subPath}`,
    languages: Object.fromEntries(
      SUPPORTED_LANGS.map((l) => [l, `${cityBasePath(l, citySlug)}${subPath}`]),
    ),
  };
}

/** OG-локаль соцсетей из языка страницы (в одном стиле с dateLocale). */
export function ogLocale(lang: string): string {
  if (lang === "en") {
    return "en_GB";
  }
  if (lang === "th") {
    return "th_TH";
  }
  return "ru_RU";
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
