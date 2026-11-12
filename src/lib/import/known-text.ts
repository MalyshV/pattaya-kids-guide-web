/**
 * Точечная правка текста в базе: новое значение пишем, только если сейчас
 * там один из известных прежних вариантов (из seed, перевода или прошлого
 * скрипта) или пусто. Текст, который правили в админке, не трогаем —
 * раннер покажет его в отчёте как «оставлено». Повторный запуск ничего
 * не меняет.
 */
export type KnownTextPlan =
  | { action: "set"; value: string }
  | { action: "same" }
  | { action: "kept" };

export function planKnownText(
  current: string | null | undefined,
  previous: readonly string[],
  next: string,
): KnownTextPlan {
  const value = current ?? "";
  if (value === next) {
    return { action: "same" };
  }
  if (value.trim() === "" || previous.includes(value)) {
    return { action: "set", value: next };
  }
  return { action: "kept" };
}
