/**
 * Минимальные типы Telegram Bot API — только то, что реально использует
 * интеграция (webhook-апдейты и ответы). Без внешних зависимостей.
 * Справочник полей: https://core.telegram.org/bots/api
 */

export type TelegramUser = {
  id: number;
  first_name?: string;
  username?: string;
};

export type TelegramChat = {
  id: number;
  /// private | group | supergroup | channel
  type: string;
};

export type TelegramMessage = {
  message_id: number;
  chat: TelegramChat;
  from?: TelegramUser;
  text?: string;
};

export type TelegramCallbackQuery = {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
};

/** Один входящий апдейт вебхука. Поля-варианты опциональны. */
export type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
};

export type InlineKeyboardButton = {
  text: string;
  url?: string;
  callback_data?: string;
};

export type InlineKeyboardMarkup = {
  inline_keyboard: InlineKeyboardButton[][];
};

export type SentMessage = {
  message_id: number;
};

export type WebhookInfo = {
  url: string;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
};

export type BotInfo = {
  id: number;
  first_name: string;
  username?: string;
};
