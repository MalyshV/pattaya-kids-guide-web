/**
 * Локализация КОНТЕНТА из БД. Контент хранится тройками полей
 * (name + nameEn + nameTh и т.п.); En- и Th-поля nullable — честный каскадный
 * fallback, пока перевод не занесён (лучше показать соседний язык, чем пустоту
 * или выдумку). Названия-бренды (Winter Wonderland, Skippy Land) Th не
 * заполняют намеренно — падают на латинское имя.
 */

/**
 * Выбор локализованного значения по языку страницы с каскадом:
 * th → thValue ?? enValue ?? ruValue; en → enValue ?? ruValue; иначе ruValue.
 * thValue опционален (undefined там, где перевод ещё не занесён или поле не
 * тянется из БД) — тогда честно падаем на английский, затем на русский.
 */
export function pickLocalized<T extends string | null>(
  ruValue: T,
  enValue: string | null | undefined,
  thValue: string | null | undefined,
  lang: string,
): T | string {
  if (lang === "th") {
    return thValue ?? enValue ?? ruValue;
  }
  if (lang === "en") {
    return enValue ?? ruValue;
  }
  return ruValue;
}

type NamedCity = {
  name: string;
  nameEn?: string | null;
  nameTh?: string | null;
};

/** Имя города по языку интерфейса («Паттайя» / "Pattaya" / тайское). */
export function localizedCityName(city: NamedCity, lang: string): string {
  return pickLocalized(city.name, city.nameEn, city.nameTh, lang) as string;
}
