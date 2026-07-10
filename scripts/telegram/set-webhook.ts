/**
 * Привязка вебхука: говорим Telegram, куда присылать сообщения боту.
 * Запуск: npm run telegram:webhook
 * Нужны в .env: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, NEXT_PUBLIC_SITE_URL
 */

import { getMe, getWebhookInfo, setWebhook } from "../../src/lib/telegram/client";

async function main(): Promise<void> {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!site || !secret) {
    throw new Error(
      "В .env должны быть NEXT_PUBLIC_SITE_URL и TELEGRAM_WEBHOOK_SECRET (см. docs/TELEGRAM.md)",
    );
  }

  const me = await getMe();
  const url = `${site}/api/telegram/webhook`;

  await setWebhook({ url, secretToken: secret });
  const info = await getWebhookInfo();

  console.log(`Бот: @${me.username ?? "(без username)"}`);
  console.log(`Webhook: ${info.url}`);
  console.log(
    info.last_error_message
      ? `Последняя ошибка Telegram: ${info.last_error_message}`
      : "Ошибок нет — бот подключён к сайту.",
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
