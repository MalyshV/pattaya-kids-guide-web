/**
 * Категории из формы: только те, что есть в справочнике, без повторов, в
 * исходном порядке. Чужой или устаревший id (справочник поменялся, пока
 * вкладка была открыта) отбрасывается — иначе сохранение упало бы на внешнем
 * ключе и карточка не сохранилась бы целиком.
 */
export function pickCategoryIds(
  raw: readonly string[],
  known: ReadonlySet<string>,
): string[] {
  const picked: string[] = [];
  for (const id of raw) {
    if (known.has(id) && !picked.includes(id)) {
      picked.push(id);
    }
  }
  return picked;
}
