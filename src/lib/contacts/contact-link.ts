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
    // LINE Official Account по ID (напр. «@ThePlayBarnPattaya»); @ → %40.
    // ID всё равно показывается текстом — если ссылка не откроется, гость
    // найдёт аккаунт вручную или по QR.
    return `https://line.me/R/ti/p/${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}

/** Внешний канал (открывать в новой вкладке). tel:/mailto: остаются в том же окне. */
export function isExternalContact(type: string): boolean {
  return type !== "phone" && type !== "email";
}

/** Каналы, где полезно показать само значение (номер, LINE-ID), а не только имя. */
export function showsContactValue(type: string): boolean {
  return type === "phone" || type === "line";
}
