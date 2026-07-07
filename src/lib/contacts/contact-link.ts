/**
 * Ссылки контактов места. Чистые функции: по типу канала строим href и решаем,
 * открывать ли во внешней вкладке. type — строка (не enum), новые каналы
 * добавляются без правок схемы.
 */

/** href для контакта: телефон → tel:, почта → mailto:, LINE → line.me по ID,
 *  остальное — value как URL. */
export function contactHref(type: string, value: string): string {
  const trimmed = value.trim();

  if (type === "phone") {
    return `tel:${trimmed.replace(/[\s()-]/g, "")}`;
  }

  if (type === "email") {
    return `mailto:${trimmed}`;
  }

  if (type === "line") {
    // Готовая LINE-ссылка (lin.ee/… или line.me/…) — используем как есть. Иначе
    // это ID аккаунта (напр. «@ThePlayBarnPattaya») → строим deep link, @ → %40.
    if (isLineUrl(trimmed)) {
      return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    }
    return `https://line.me/R/ti/p/${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}

/** Готовая LINE-ссылка (короткая lin.ee или line.me), а не ID аккаунта. */
function isLineUrl(value: string): boolean {
  return (
    /^https?:\/\//.test(value) || value.includes("lin.ee") || value.includes("line.me")
  );
}

/** Внешний канал (открывать в новой вкладке). tel:/mailto: остаются в том же окне. */
export function isExternalContact(type: string): boolean {
  return type !== "phone" && type !== "email";
}

/** Каналы, где полезно показать само значение. Телефон — всегда; LINE — только
 *  когда это читаемый ID (@…), а не длинная lin.ee-ссылка (для неё хватит «LINE ↗»). */
export function showsContactValue(type: string, value: string): boolean {
  if (type === "phone") {
    return true;
  }
  if (type === "line") {
    return !isLineUrl(value);
  }
  return false;
}
