/**
 * «Полезно знать» в админке: два поля — советы по-русски (по одному в строке)
 * и их английский перевод строка в строку. Здесь — чистый разбор полей и план
 * изменений; в базу его кладёт lib/admin/tips-store.
 *
 * Сохранение — не «стереть всё и создать заново»: у совета есть тайский
 * перевод, тема и дата проверки, которых в форме нет. Поэтому совет с тем же
 * русским текстом остаётся как был (меняются порядок и английский), новая
 * строка создаётся, пропавшая — удаляется. Переписали русский текст — это
 * новый совет: старый перевод к нему уже не подходит.
 */

export const TIP_LIMITS = {
  /** столько советов у одной карточки — дальше это уже не «коротко о важном» */
  maxCount: 20,
  maxLength: 600,
} as const;

export type TipLine = { text: string; textEn: string | null };

export type ExistingTip = {
  id: string;
  text: string;
  textEn: string | null;
  order: number;
};

export type TipPlan = {
  create: Array<TipLine & { order: number }>;
  update: Array<{ id: string; textEn: string | null; order: number }>;
  deleteIds: string[];
};

function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, TIP_LIMITS.maxLength);
}

/**
 * Поля формы → советы. Перевод берётся из строки с тем же номером; пустая
 * русская строка пропускается вместе со своей парой, повтор — тоже.
 */
export function parseTipLines(ru: string, en: string): TipLine[] {
  const ruLines = ru.split(/\r?\n/);
  const enLines = en.split(/\r?\n/);
  const seen = new Set<string>();
  const lines: TipLine[] = [];
  ruLines.forEach((raw, index) => {
    const text = clean(raw);
    if (!text || seen.has(text) || lines.length >= TIP_LIMITS.maxCount) {
      return;
    }
    seen.add(text);
    lines.push({ text, textEn: clean(enLines[index] ?? "") || null });
  });
  return lines;
}

export function planTips(
  existing: readonly ExistingTip[],
  lines: readonly TipLine[],
): TipPlan {
  const byText = new Map<string, ExistingTip>();
  for (const tip of existing) {
    const key = clean(tip.text);
    if (!byText.has(key)) {
      byText.set(key, tip);
    }
  }

  const plan: TipPlan = { create: [], update: [], deleteIds: [] };
  const kept = new Set<string>();
  lines.forEach((line, index) => {
    const order = index + 1;
    const same = byText.get(line.text);
    if (!same) {
      plan.create.push({ ...line, order });
      return;
    }
    kept.add(same.id);
    if (same.order !== order || (same.textEn ?? null) !== line.textEn) {
      plan.update.push({ id: same.id, textEn: line.textEn, order });
    }
  });
  plan.deleteIds = existing.filter((tip) => !kept.has(tip.id)).map((tip) => tip.id);
  return plan;
}

/** Советы из базы → значения двух полей формы (строка в строку). */
export function tipsToFields(
  tips: ReadonlyArray<{ text: string; textEn: string | null }>,
): { ru: string; en: string } {
  const en = tips.map((tip) => clean(tip.textEn ?? ""));
  return {
    ru: tips.map((tip) => clean(tip.text)).join("\n"),
    // переводов нет совсем — поле пустое, а не столбик пустых строк
    en: en.some(Boolean) ? en.join("\n") : "",
  };
}
