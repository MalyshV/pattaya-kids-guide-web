/**
 * Ссылки контактов места. Чистые функции: по типу канала строим href и решаем,
 * открывать ли во внешней вкладке. type — строка (не enum), новые каналы
 * добавляются без правок схемы.
 */

/** href для контакта: телефон → tel:, почта → mailto:, остальное — value как URL. */
export function contactHref(type: string, value: string): string {
  const trimmed = value.trim();

  if (type === "phone") {
    return `tel:${trimmed.replace(/[\s()-]/g, "")}`;
  }

  if (type === "email") {
    return `mailto:${trimmed}`;
  }

  return trimmed;
}

/** Внешний канал (открывать в новой вкладке). tel:/mailto: остаются в том же окне. */
export function isExternalContact(type: string): boolean {
  return type !== "phone" && type !== "email";
}
