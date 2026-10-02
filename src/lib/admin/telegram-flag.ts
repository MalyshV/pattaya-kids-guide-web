/**
 * Мягкий флаг «сообщение автору в Telegram не ушло» в существующем механизме
 * баннера админки (?done / ?error). Карточка при этом сохранена — флаг лишь
 * заменяет «успех» на предупреждение. Настоящую ошибку (?error=…) не затираем:
 * она важнее.
 */
export const TELEGRAM_FAILED_FLAG = "telegramFailed";

export function withTelegramFlag(href: string, failed: boolean): string {
  if (!failed || /[?&]error=/.test(href)) {
    return href;
  }
  const flag = `error=${TELEGRAM_FAILED_FLAG}`;
  if (/[?&]done=[^&#]*/.test(href)) {
    return href.replace(/([?&])done=[^&#]*/, `$1${flag}`);
  }
  const hash = href.indexOf("#");
  const base = hash < 0 ? href : href.slice(0, hash);
  const tail = hash < 0 ? "" : href.slice(hash);
  return `${base}${base.includes("?") ? "&" : "?"}${flag}${tail}`;
}
