/**
 * Тонкий клиент Telegram Bot API поверх fetch — без внешних зависимостей.
 * Все вызовы идут от имени бота; токен читается из TELEGRAM_BOT_TOKEN.
 */

import type {
  BotInfo,
  InlineKeyboardMarkup,
  SentMessage,
  WebhookInfo,
} from "@/lib/telegram/types";

const TELEGRAM_API_BASE = "https://api.telegram.org";

export class TelegramApiError extends Error {
  code = "TELEGRAM_API_ERROR";

  constructor(
    public readonly method: string,
    public readonly errorCode: number,
    public readonly description: string,
  ) {
    super(`Telegram API ${method} failed (${errorCode}): ${description}`);
  }
}

type TelegramResponse<T> =
  | { ok: true; result: T }
  | { ok: false; error_code: number; description: string };

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not defined");
  }
  return token;
}

/// sendPhoto по URL висит, пока Telegram скачивает картинку с нашего сайта;
/// без таймаута один зависший вызов съел бы весь maxDuration крон-роута
const REQUEST_TIMEOUT_MS = 15_000;

/** Низкоуровневый вызов метода Bot API. Бросает TelegramApiError при ok=false. */
export async function callTelegram<T>(
  method: string,
  payload: Record<string, unknown> = {},
): Promise<T> {
  const response = await fetch(`${TELEGRAM_API_BASE}/bot${getBotToken()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  let data: TelegramResponse<T>;
  try {
    data = (await response.json()) as TelegramResponse<T>;
  } catch {
    throw new TelegramApiError(method, response.status, "Non-JSON response");
  }

  if (!data.ok) {
    throw new TelegramApiError(method, data.error_code, data.description);
  }

  return data.result;
}

export type SendMessageOptions = {
  chatId: string | number;
  text: string;
  keyboard?: InlineKeyboardMarkup;
  /// выключить превью ссылок (для списков, где ссылок много)
  disablePreview?: boolean;
};

export async function sendMessage(options: SendMessageOptions): Promise<SentMessage> {
  return callTelegram<SentMessage>("sendMessage", {
    chat_id: options.chatId,
    text: options.text,
    parse_mode: "HTML",
    ...(options.disablePreview ? { link_preview_options: { is_disabled: true } } : {}),
    ...(options.keyboard ? { reply_markup: options.keyboard } : {}),
  });
}

export type SendPhotoOptions = {
  chatId: string | number;
  photoUrl: string;
  caption: string;
  keyboard?: InlineKeyboardMarkup;
};

export async function sendPhoto(options: SendPhotoOptions): Promise<SentMessage> {
  return callTelegram<SentMessage>("sendPhoto", {
    chat_id: options.chatId,
    photo: options.photoUrl,
    caption: options.caption,
    parse_mode: "HTML",
    ...(options.keyboard ? { reply_markup: options.keyboard } : {}),
  });
}

/** Гасим «часики» на кнопке после нажатия. */
export async function answerCallbackQuery(callbackQueryId: string): Promise<boolean> {
  return callTelegram<boolean>("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
  });
}

export type SetWebhookOptions = {
  url: string;
  /// секрет, который Telegram будет присылать в заголовке каждого апдейта
  secretToken: string;
  allowedUpdates?: string[];
};

export async function setWebhook(options: SetWebhookOptions): Promise<boolean> {
  return callTelegram<boolean>("setWebhook", {
    url: options.url,
    secret_token: options.secretToken,
    allowed_updates: options.allowedUpdates ?? ["message", "callback_query"],
    drop_pending_updates: true,
  });
}

export async function deleteWebhook(): Promise<boolean> {
  return callTelegram<boolean>("deleteWebhook", { drop_pending_updates: true });
}

export async function getWebhookInfo(): Promise<WebhookInfo> {
  return callTelegram<WebhookInfo>("getWebhookInfo");
}

export async function getMe(): Promise<BotInfo> {
  return callTelegram<BotInfo>("getMe");
}
