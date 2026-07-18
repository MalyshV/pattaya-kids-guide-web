/**
 * Чистка сырого OCR-текста перед парсером афиши.
 *
 * OCR дизайнерских афиш даёт артефакты: строки из рамок и завитушек
 * («----», «| |»), лесенки пробелов, пачки пустых строк. Убираем только
 * заведомый мусор — строки без единой буквы и цифры; всё спорное оставляем,
 * потому что дальше текст правит человек, а парсер терпим к шуму.
 */
export function cleanOcrText(raw: string): string {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  const kept: string[] = [];

  for (const line of lines) {
    const collapsed = line.replace(/[ \t]+/g, " ").trim();
    if (collapsed === "") {
      kept.push("");
      continue;
    }
    // ни буквы, ни цифры (любого алфавита) — рамка/фон, не текст афиши
    if (!/[\p{L}\p{N}]/u.test(collapsed)) {
      continue;
    }
    kept.push(collapsed);
  }

  return kept
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+|\n+$/g, "");
}
