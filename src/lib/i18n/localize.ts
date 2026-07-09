/**
 * Локализация КОНТЕНТА из БД (RU/EN фаза 2). Контент хранится парами полей
 * (name + nameEn и т.п.); en-поле nullable — честный fallback на русский,
 * пока перевод не занесён (лучше русский текст, чем пустота или выдумка).
 */

/** Выбор локализованного значения: en только когда язык en И перевод есть. */
export function pickLocalized<T extends string | null>(
  ruValue: T,
  enValue: string | null | undefined,
  lang: string,
): T | string {
  if (lang === "en" && enValue) {
    return enValue;
  }
  return ruValue;
}

type NamedCity = { name: string; nameEn?: string | null };

/** Имя города по языку интерфейса («Паттайя» / "Pattaya"). */
export function localizedCityName(city: NamedCity, lang: string): string {
  return pickLocalized(city.name, city.nameEn, lang) as string;
}
