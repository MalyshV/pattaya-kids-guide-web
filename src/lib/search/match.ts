/**
 * Поиск по каталогу: чистые функции без БД. Каталог маленький, поэтому весь
 * индекс приезжает на страницу, а совпадения ищутся на клиенте мгновенно —
 * без запросов к серверу и задержек.
 */

export type SearchableItem = {
  /** видимое название (уже локализованное) */
  name: string;
  /** всё, по чему ищем: имя в обеих локалях, категории, место проведения */
  searchText: string;
};

/**
 * Нижний регистр, свёртка диакритики, лишние пробелы. NFKD раскладывает
 * букву на базу + диакритический знак, знак удаляем: «Café» находится по
 * «cafe», «Ёлка» — по «елка» (симметрично для запроса и текста, поэтому
 * й→и и подобные превращения матчинг не ломают).
 */
export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/// короче двух символов не ищем: по одной букве совпадает всё подряд
export const MIN_QUERY_LENGTH = 2;

/**
 * Релевантность запроса к элементу. 0 — не совпало; больше — лучше:
 * 4 — название начинается с запроса, 3 — запрос внутри названия целиком,
 * 2 — все слова запроса есть в названии (пусть и не подряд),
 * 1 — слова встречаются только в searchText (категории, место).
 */
export function scoreMatch(item: SearchableItem, normalizedQuery: string): number {
  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    return 0;
  }

  // однобуквенные слова игнорируем: «а и» совпадало бы со всем каталогом —
  // ровно тот шум, ради которого существует MIN_QUERY_LENGTH
  const words = normalizedQuery
    .split(" ")
    .filter((word) => word.length >= MIN_QUERY_LENGTH);
  if (words.length === 0) {
    return 0;
  }

  const name = normalizeSearchText(item.name);
  const haystack = normalizeSearchText(item.searchText);

  if (!words.every((word) => haystack.includes(word))) {
    return 0;
  }

  if (name.startsWith(normalizedQuery)) {
    return 4;
  }
  if (name.includes(normalizedQuery)) {
    return 3;
  }
  if (words.every((word) => name.includes(word))) {
    return 2;
  }
  return 1;
}

/**
 * Топ совпадений: релевантные выше, при равенстве — по алфавиту названия.
 * Сортировка стабильная и не мутирует исходный массив.
 */
export function searchItems<T extends SearchableItem>(
  items: T[],
  query: string,
  limit = 8,
): T[] {
  const normalizedQuery = normalizeSearchText(query);

  return items
    .map((item) => ({ item, score: scoreMatch(item, normalizedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, limit)
    .map(({ item }) => item);
}
