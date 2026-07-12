/**
 * Разбор searchParams страниц-списков (Server Components). Один и тот же код
 * дословно дублировался в трёх страницах (места/события/занятия) — держим в
 * одном месте, чтобы правка логики не разъезжалась по файлам.
 */

/** Первое значение параметра: ?a=1&a=2 или массив → первый элемент. */
export function getSingleSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Номер страницы из ?page=: целое > 0, иначе undefined (мусор/дробь/0 →
 * страница подставит дефолт 1). Мягкий разбор для SSR-страниц — в отличие от
 * pagination-params для API, здесь невалидный ввод не 400, а тихий дефолт.
 */
export function parsePositiveNumberParam(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}
