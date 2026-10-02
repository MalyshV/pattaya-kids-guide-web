import { randomBytes } from "node:crypto";
import { TELEGRAM_WEB } from "@/lib/contacts/contact-link";

/**
 * «Сообщить мне в Telegram, когда опубликуем»: привязка чата автора
 * предложения к самому предложению. Чистая логика — без базы и сети.
 *
 * Привязка идёт по ОТДЕЛЬНОМУ случайному токену, а не по id предложения: id
 * не секрет (виден в адресах админки и логах), и по нему чужой человек мог бы
 * привязать свой чат к чужому предложению. Токен знает только тот, кому его
 * показали на экране «Спасибо».
 */

/** 18 байт → 24 символа base64url; лимит параметра start у Telegram — 64 */
const TOKEN_BYTES = 18;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

export function generateAuthorToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

export function isValidAuthorToken(value: unknown): value is string {
  return typeof value === "string" && TOKEN_PATTERN.test(value);
}

/**
 * Токен из «/start <токен>» (допускается «/start@bot <токен>»). Не наша
 * команда, пустой или битый параметр → null: обычный /start остаётся как был.
 */
export function parseStartToken(text: string): string | null {
  const [command, param, ...rest] = text.trim().split(/\s+/);
  if (!command || rest.length > 0 || !param) {
    return null;
  }
  if (command.replace(/@[A-Za-z0-9_]+$/, "").toLowerCase() !== "/start") {
    return null;
  }
  return isValidAuthorToken(param) ? param : null;
}

/** Имя бота: с @ или без; Telegram допускает латиницу, цифры и «_». */
export function normalizeBotUsername(value: string | undefined): string | null {
  const name = value?.trim().replace(/^@/, "") ?? "";
  return /^[A-Za-z][A-Za-z0-9_]{3,31}$/.test(name) ? name : null;
}

/** Диплинк в бота. Только telegram.me: t.me у части тайских провайдеров не открывается. */
export function authorStartUrl(botUsername: string, token: string): string {
  return `${TELEGRAM_WEB}/${botUsername}?start=${token}`;
}

export type LinkDecision = "link" | "already" | "invalid";

/**
 * Что делать с «/start <токен>». Токен одноразовый по смыслу: когда чат уже
 * привязан, тот же чат получает «уже запомнили» (повторное нажатие «Старт»
 * безвредно), а ДРУГОЙ чат — отказ, перепривязать нельзя.
 */
export function decideLink(
  submission: { telegramChatId: string | null } | null,
  chatId: string,
): LinkDecision {
  if (!submission) {
    return "invalid";
  }
  if (!submission.telegramChatId) {
    return "link";
  }
  return submission.telegramChatId === chatId ? "already" : "invalid";
}

export type NotifyInput = {
  status: string;
  telegramChatId: string | null;
  telegramNotifiedAt: Date | null;
  /** дополнение принято действием в админке (фото в галерею / в обложку) */
  accepted?: boolean;
};

/**
 * Писать ли автору. Отклонённое и дубль — никогда; опубликованное — да;
 * принятое дополнение — да (у события и занятия статус не меняется). Один раз:
 * отметка отправки закрывает повтор.
 */
export function shouldNotifyAuthor(input: NotifyInput): boolean {
  if (!input.telegramChatId || input.telegramNotifiedAt) {
    return false;
  }
  if (input.status === "REJECTED" || input.status === "DUPLICATE") {
    return false;
  }
  return input.status === "PUBLISHED" || input.accepted === true;
}

/**
 * Диплинк для экрана «Спасибо»: нужен и токен, и бот в настройках. Имя бота
 * публично, поэтому NEXT_PUBLIC_: оно нужно и попапу в браузере. Нет бота или
 * токен битый — null, и кнопки на экране просто нет.
 */
export function authorStartUrlFromEnv(token: unknown): string | null {
  const bot = normalizeBotUsername(process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME);
  return bot && isValidAuthorToken(token) ? authorStartUrl(bot, token) : null;
}
