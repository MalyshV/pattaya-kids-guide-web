/**
 * Тестовый пост в канал: проверяет токен, права бота и связь с каналом.
 * Запуск: npm run telegram:test-post
 * Нужны в .env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID
 */

import { sendMessage } from "../../src/lib/telegram/client";

async function main(): Promise<void> {
  const channel = process.env.TELEGRAM_CHANNEL_ID;

  if (!channel) {
    throw new Error(
      "В .env должен быть TELEGRAM_CHANNEL_ID (например, @pattayakidsguide)",
    );
  }

  const message = await sendMessage({
    chatId: channel,
    text: "Проверка связи: сайт подключён к каналу ✅\n\n<i>Это тестовый пост — его можно удалить.</i>",
  });

  console.log(`Готово! Пост №${message.message_id} отправлен в ${channel}.`);
  console.log("Загляни в канал — там должно появиться сообщение.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
