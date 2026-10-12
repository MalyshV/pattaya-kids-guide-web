/**
 * Слияние контактов места: что создать и что удалить, чтобы список совпал с
 * заданным. Чистая функция (без БД) — раннер заноса только исполняет план.
 *
 * Правила:
 * - контакт того же типа и «того же» значения (без протокола, www и
 *   хвостового слэша, без регистра) уже есть — не трогаем;
 * - типы из replaceTypes заменяются целиком: старые значения этого типа,
 *   которых нет в новом списке, удаляются (так числовой Facebook сменяется
 *   именным, а чужой сайт убирается совсем);
 * - остальные типы только пополняются — чужие контакты не стираем.
 */

export type ContactRow = { type: string; value: string };
export type ExistingContact = ContactRow & { id: string };

export type ContactPlan = {
  create: ContactRow[];
  remove: ExistingContact[];
};

/** Значение для сравнения: не различаем http/https, www, слэш и регистр. */
export function normalizeContactValue(type: string, value: string): string {
  const trimmed = value.trim();
  if (type === "phone") {
    return trimmed.replace(/[\s()-]/g, "");
  }
  return trimmed
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

function key(row: ContactRow): string {
  return `${row.type}|${normalizeContactValue(row.type, row.value)}`;
}

export function planContactSync(
  existing: readonly ExistingContact[],
  desired: readonly ContactRow[],
  replaceTypes: readonly string[] = [],
): ContactPlan {
  const desiredKeys = new Set(desired.map(key));
  const existingKeys = new Set(existing.map(key));

  const remove = existing.filter(
    (row) => replaceTypes.includes(row.type) && !desiredKeys.has(key(row)),
  );

  const seen = new Set<string>();
  const create: ContactRow[] = [];
  for (const row of desired) {
    const rowKey = key(row);
    if (existingKeys.has(rowKey) || seen.has(rowKey)) {
      continue;
    }
    seen.add(rowKey);
    create.push({ type: row.type, value: row.value.trim() });
  }

  return { create, remove };
}
