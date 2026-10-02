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
 * Пустая строка и строка из пробелов — тоже «перевода нет»: иначе вместо
 * соседнего языка человек увидел бы пустоту.
 */
export function pickLocalized<T extends string | null>(
  ruValue: T,
  enValue: string | null | undefined,
  thValue: string | null | undefined,
  lang: string,
): T | string {
  const th = hasText(thValue) ? thValue : null;
  const en = hasText(enValue) ? enValue : null;
  if (lang === "th") {
    return th ?? en ?? ruValue;
  }
  if (lang === "en") {
    return en ?? ruValue;
  }
  return ruValue;
}

function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim() !== "";
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
