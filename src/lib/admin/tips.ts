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
 *
 * Исключение — исправленная опечатка: поменяли пару букв, а цифры остались
 * прежними, — это тот же совет, перевод и дата проверки остаются. Цифры
 * важны: «50 бат» → «60 бат» — одна буква, но перевод уже врёт.
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
  /** text — только когда в русском тексте исправили опечатку */
  update: Array<{ id: string; text?: string; textEn: string | null; order: number }>;
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

/** Расстояние Левенштейна: сколько букв вставить, убрать или заменить. */
function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length];
}

function digitsOf(value: string): string {
  return value.replace(/\D+/g, " ").trim();
}

/** сколько букв можно поменять, чтобы это ещё считалось опечаткой */
function typoBudget(length: number): number {
  return Math.min(6, Math.max(2, Math.floor(length / 20)));
}

/**
 * Та же строка с исправленной опечаткой? Несколько букв разницы и ровно те же
 * цифры (цены, часы, возраст — смысл, а не опечатка).
 */
export function isTypoFix(before: string, after: string): boolean {
  if (before === after || digitsOf(before) !== digitsOf(after)) {
    return false;
  }
  const longest = Math.max(before.length, after.length);
  if (Math.abs(before.length - after.length) > typoBudget(longest)) {
    return false;
  }
  return editDistance(before, after) <= typoBudget(longest);
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
  // сначала точные совпадения — чтобы «почти такой же» совет не увёл чужой
  const unmatched: Array<{ line: TipLine; order: number }> = [];
  lines.forEach((line, index) => {
    const order = index + 1;
    const same = byText.get(line.text);
    if (!same || kept.has(same.id)) {
      unmatched.push({ line, order });
      return;
    }
    kept.add(same.id);
    if (same.order !== order || (same.textEn ?? null) !== line.textEn) {
      plan.update.push({ id: same.id, textEn: line.textEn, order });
    }
  });
  // затем — исправленные опечатки: тот же совет, перевод и дата проверки целы
  for (const { line, order } of unmatched) {
    const fixed = existing.find(
      (tip) => !kept.has(tip.id) && isTypoFix(clean(tip.text), line.text),
    );
    if (fixed) {
      kept.add(fixed.id);
      plan.update.push({ id: fixed.id, text: line.text, textEn: line.textEn, order });
    } else {
      plan.create.push({ ...line, order });
    }
  }
  plan.create.sort((a, b) => a.order - b.order);
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
