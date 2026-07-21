import type { MetadataRoute } from "next";
import { SUPPORTED_LANGS } from "@/content/dictionary";
import { DEFAULT_LANG } from "@/lib/geo/base-path";

/**
 * Одна запись sitemap на логический URL: url на дефолтной локали +
 * alternates.languages на все переводы и x-default. Так Google связывает
 * языковые версии прямо из карты сайта.
 *
 * baseUrl — абсолютный домен; subPath — «/events», «/places/<slug>» или «»
 * для корня города; lastModified опускается, если даты правки нет (у занятий
 * её нет, а фейковому «сейчас» Google не доверяет).
 */
export function localizedSitemapEntry(
  baseUrl: string,
  citySlug: string,
  subPath: string,
  lastModified?: Date,
): MetadataRoute.Sitemap[number] {
  const abs = (lang: string) => `${baseUrl}/${lang}/${citySlug}${subPath}`;
  const languages: Record<string, string> = Object.fromEntries(
    SUPPORTED_LANGS.map((lang) => [lang, abs(lang)]),
  );
  languages["x-default"] = abs(DEFAULT_LANG);

  return {
    url: abs(DEFAULT_LANG),
    ...(lastModified ? { lastModified } : {}),
    alternates: { languages },
  };
}
