import { createHmac } from "node:crypto";

/**
 * Лимит отправок формы «Предложить своё» — по отпечатку IP, а не по самому
 * IP: сырой адрес не храним (личные данные). HMAC с секретом, а не просто
 * sha256: IPv4-адресов мало, голый хэш перебирается за минуты.
 */

/** больше стольких предложений в час с одного адреса — это уже не родитель */
export const SUBMISSIONS_PER_HOUR = 5;

export function hashIp(ip: string, key: string): string {
  return createHmac("sha256", key).update(ip).digest("hex").slice(0, 32);
}

/** IP посетителя за прокси Vercel: первый адрес в x-forwarded-for. */
export function clientIp(headers: Pick<Headers, "get">): string | null {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || null;
}
