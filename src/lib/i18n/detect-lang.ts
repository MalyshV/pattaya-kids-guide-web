import { isSupportedLang, type Lang } from "@/content/dictionary";
import { DEFAULT_LANG } from "@/lib/geo/base-path";

/** Имя cookie с сохранённым выбором языка (ставит переключатель в шапке). */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Предпочитаемый язык для «пустого» входа (голый домен). Приоритет:
 * 1) явный выбор пользователя (cookie) — он всегда главнее;
 * 2) язык браузера из заголовка Accept-Language — первый, что мы поддерживаем;
 * 3) русский как запасной.
 * Чистая функция (без Request) — чтобы легко покрыть тестами.
 */
export function detectPreferredLang(
  cookieValue: string | undefined,
  acceptLanguage: string | null | undefined,
): Lang {
  // 1) сохранённый выбор
  if (cookieValue && isSupportedLang(cookieValue)) {
    return cookieValue;
  }

  // 2) язык браузера: «th-TH,th;q=0.9,en;q=0.8» → [th, en] → первый поддержанный
  const ordered = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag, qPart] = part.trim().split(";");
      const q = qPart?.startsWith("q=") ? Number(qPart.slice(2)) : 1;
      // базовый сабтег: «en-GB» → «en», регистр не важен
      const base = tag.trim().slice(0, 2).toLowerCase();
      return { base, q: Number.isFinite(q) ? q : 0 };
    })
    // по убыванию веса q (стабильно для равных — сохраняем исходный порядок)
    .sort((a, b) => b.q - a.q);

  for (const { base } of ordered) {
    if (isSupportedLang(base)) {
      return base;
    }
  }

  // 3) запасной
  return DEFAULT_LANG;
}
