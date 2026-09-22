import { NextResponse, type NextRequest } from "next/server";
import { clientIp } from "@/lib/suggest/ip-hash";
import { findSimilar } from "@/services/suggest-similar.service";

/**
 * Живая подсказка формы «Предложить своё»: GET, а не server action — Next
 * выполняет server actions строго по одному, и подсказка задерживала бы
 * отправку формы; GET браузер отменяет, когда человек печатает дальше.
 *
 * Открытый адрес, поэтому: наружу только публичное (см. findSimilar) и мягкий
 * лимит частоты на инстанс — живой человек столько не напечатает.
 */

const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 60;
const hits = new Map<string, { count: number; until: number }>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) {
    hits.clear();
  }
  const entry = hits.get(ip);
  if (!entry || entry.until <= now) {
    hits.set(ip, { count: 1, until: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const headers = { "Cache-Control": "no-store" };
  const ip = clientIp(request.headers) ?? "unknown";
  if (tooMany(ip)) {
    return NextResponse.json({ hints: [] }, { status: 429, headers });
  }

  const params = request.nextUrl.searchParams;
  try {
    const hints = await findSimilar({
      lang: params.get("lang") ?? "",
      city: params.get("city") ?? "",
      name: params.get("name") ?? "",
      location: params.get("location") ?? "",
    });
    return NextResponse.json({ hints }, { headers });
  } catch {
    // подсказка — не главное: без неё форма работает как обычно
    return NextResponse.json({ hints: [] }, { headers });
  }
}
