import { ru } from "@/content/ru";
import { en } from "@/content/en";

/**
 * Словарь интерфейса. Структуру задаёт ru.ts; en обязан зеркалить её
 * (тип Dictionary не даст словарям разъехаться при добавлении строк).
 */
export type Dictionary = typeof ru;

export const SUPPORTED_LANGS = ["ru", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export function isSupportedLang(value: string): value is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

export function getDictionary(lang: string): Dictionary {
  return lang === "en" ? en : ru;
}

/** Язык из пути страницы (`/en/pattaya/...` → "en"); не распознан → "ru". */
export function langFromPath(path: string): Lang {
  const segment = path.split("/")[1] ?? "";
  return isSupportedLang(segment) ? segment : "ru";
}

/** Локаль для дат по языку интерфейса (toLocaleDateString и т.п.). */
export function dateLocale(lang: string): string {
  return lang === "en" ? "en-GB" : "ru-RU";
}
