"use client";

import { usePathname } from "next/navigation";
import {
  getDictionary,
  langFromPath,
  type Dictionary,
  type Lang,
} from "@/content/dictionary";

/** Язык текущей страницы для клиентских компонентов (из сегмента URL). */
export function useLang(): Lang {
  return langFromPath(usePathname());
}

/** Словарь текущей страницы для клиентских компонентов. */
export function useDictionary(): Dictionary {
  return getDictionary(useLang());
}
