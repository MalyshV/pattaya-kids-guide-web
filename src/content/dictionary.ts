import { ru } from "@/content/ru";
import { en } from "@/content/en";
import { th } from "@/content/th";

/**
 * Словарь интерфейса. Структуру задаёт ru.ts; en и th обязаны зеркалить её
 * (тип Dictionary не даст словарям разъехаться при добавлении строк).
 */
export type Dictionary = typeof ru;

export const SUPPORTED_LANGS = ["ru", "en", "th"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export function isSupportedLang(value: string): value is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

export function getDictionary(lang: string): Dictionary {
  if (lang === "en") {
    return en;
  }
  if (lang === "th") {
    return th;
  }
  return ru;
}

/** Язык из пути страницы (`/en/pattaya/...` → "en"); не распознан → "ru". */
export function langFromPath(path: string): Lang {
  const segment = path.split("/")[1] ?? "";
  return isSupportedLang(segment) ? segment : "ru";
}

/** Локаль для дат по языку интерфейса (toLocaleDateString и т.п.).
 *  th-TH даёт годы буддийской эры (2569) — именно так даты привычны тайцам. */
export function dateLocale(lang: string): string {
  if (lang === "en") {
    return "en-GB";
  }
  if (lang === "th") {
    return "th-TH";
  }
  return "ru-RU";
}
