import { NextRequest, NextResponse } from "next/server";
import { fail, ok } from "@/lib/api-response";
import { handleTelegramUpdate } from "@/services/telegram-bot.service";
import type { TelegramUpdate } from "@/lib/telegram/types";

/**
 * Вебхук Telegram: сюда Telegram присылает каждое сообщение боту.
 * Подлинность проверяем по секретному заголовку, который мы сами задали
 * при setWebhook (см. scripts/telegram/set-webhook.ts).
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const receivedSecret = req.headers.get("x-telegram-bot-api-secret-token");

  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return fail("Forbidden", "FORBIDDEN", 403);
  }

  try {
    const update = (await req.json()) as TelegramUpdate;
    await handleTelegramUpdate(update);
  } catch (error) {
    // Логируем, но отвечаем 200: на не-2xx Telegram бесконечно ретраит апдейт
    console.error("Telegram webhook error:", error);
  }

  return ok({ received: true });
}
