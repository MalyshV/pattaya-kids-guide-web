import { NextRequest, NextResponse } from "next/server";
import { fail, ok } from "@/lib/api-response";
import { handleError } from "@/lib/errors";
import { runAutopost } from "@/services/telegram-autopost.service";

/// до 5 постов с паузами + запросы к БД — даём запас по времени выполнения
export const maxDuration = 60;

/**
 * Автопостинг новых событий и мест в Telegram-канал.
 * Дёргается кроном Vercel (см. vercel.json) с заголовком
 * Authorization: Bearer CRON_SECRET — Vercel подставляет его сам.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  const authorization = req.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return fail("Forbidden", "FORBIDDEN", 403);
  }

  try {
    const result = await runAutopost();
    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}
