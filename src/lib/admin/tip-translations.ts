/**
 * Переводы советов «Полезно знать» пачкой (чистая логика; скрипты —
 * scripts/tips). Советы вносятся в админке по-русски; перевод на английский и
 * тайский делается потом, сразу для всех накопившихся:
 *
 *   npm run tips:export   → scripts/tips/translations.json (что перевести)
 *   …в файле заполняются textEn / textTh…
 *   npm run tips:apply    → переводы ложатся в базу
 *
 * Совет ищем по id, но применяем перевод, только если русский текст в базе
 * всё ещё тот же: пока файл переводили, совет могли переписать — старый
 * перевод к новому тексту не подходит.
 */

export const TIP_OWNERS = ["place", "event", "program"] as const;
export type TipOwnerKind = (typeof TIP_OWNERS)[number];

export type TipRow = {
  id: string;
  text: string;
  textEn: string | null;
  textTh: string | null;
};

/** строка файла переводов */
export type TipTranslationEntry = {
  owner: TipOwnerKind;
  id: string;
  /** название карточки — только чтобы переводчику был понятен контекст */
  card: string;
  text: string;
  textEn: string | null;
  textTh: string | null;
};

function filled(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim() !== "";
}

/** Советы, которым не хватает английского или тайского. */
export function untranslated(
  owner: TipOwnerKind,
  rows: ReadonlyArray<TipRow & { card: string }>,
): TipTranslationEntry[] {
  return rows
    .filter((row) => filled(row.text) && (!filled(row.textEn) || !filled(row.textTh)))
    .map((row) => ({
      owner,
      id: row.id,
      card: row.card,
      text: row.text,
      textEn: filled(row.textEn) ? row.textEn : null,
      textTh: filled(row.textTh) ? row.textTh : null,
    }));
}

export type TipTranslationUpdate = {
  owner: TipOwnerKind;
  id: string;
  data: { textEn?: string; textTh?: string };
};

export type TipTranslationPlan = {
  updates: TipTranslationUpdate[];
  /** совета уже нет или его русский текст переписали — перевод не применяем */
  skipped: Array<{ entry: TipTranslationEntry; reason: "missing" | "changed" }>;
};

/**
 * Что записать в базу. Пишем только заполненные в файле переводы и только
 * там, где значение действительно меняется.
 */
export function planTranslationUpdates(
  entries: readonly TipTranslationEntry[],
  current: ReadonlyMap<string, TipRow>,
): TipTranslationPlan {
  const plan: TipTranslationPlan = { updates: [], skipped: [] };
  for (const entry of entries) {
    const row = current.get(`${entry.owner}:${entry.id}`);
    if (!row) {
      plan.skipped.push({ entry, reason: "missing" });
      continue;
    }
    if (row.text.trim() !== entry.text.trim()) {
      plan.skipped.push({ entry, reason: "changed" });
      continue;
    }
    const data: TipTranslationUpdate["data"] = {};
    if (filled(entry.textEn) && entry.textEn.trim() !== (row.textEn ?? "").trim()) {
      data.textEn = entry.textEn.trim();
    }
    if (filled(entry.textTh) && entry.textTh.trim() !== (row.textTh ?? "").trim()) {
      data.textTh = entry.textTh.trim();
    }
    if (data.textEn !== undefined || data.textTh !== undefined) {
      plan.updates.push({ owner: entry.owner, id: entry.id, data });
    }
  }
  return plan;
}

/** Файл переводов → строки; мусор и чужой формат отбрасываем. */
export function parseTranslationFile(json: unknown): TipTranslationEntry[] {
  if (!Array.isArray(json)) {
    return [];
  }
  const entries: TipTranslationEntry[] = [];
  for (const item of json) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const record = item as Record<string, unknown>;
    const owner = record.owner;
    if (
      typeof owner !== "string" ||
      !(TIP_OWNERS as readonly string[]).includes(owner) ||
      typeof record.id !== "string" ||
      typeof record.text !== "string"
    ) {
      continue;
    }
    entries.push({
      owner: owner as TipOwnerKind,
      id: record.id,
      card: typeof record.card === "string" ? record.card : "",
      text: record.text,
      textEn: typeof record.textEn === "string" ? record.textEn : null,
      textTh: typeof record.textTh === "string" ? record.textTh : null,
    });
  }
  return entries;
}
