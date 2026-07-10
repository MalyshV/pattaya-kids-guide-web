import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Доступ в админку: один администратор, пароль в env (ADMIN_PASSWORD),
 * после входа — HttpOnly-кука с HMAC-токеном от пароля. Токен stateless:
 * смена пароля в env мгновенно отзывает все старые куки. Никаких внешних
 * сервисов — «первое время» этого достаточно с запасом.
 */

export const ADMIN_COOKIE = "pkg_admin";

/// 30 дней: локальный ноутбук Вероники, не общий компьютер
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD не задан (или короче 8 символов) — добавьте его в .env",
    );
  }
  return password;
}

/** Токен сессии: HMAC от константы на ключе-пароле (hex, 64 символа). */
export function sessionToken(): string {
  return createHmac("sha256", getAdminPassword()).update("pkg-admin-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // timingSafeEqual требует равной длины; разная длина = заведомо не равны
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Проверка пароля с формы входа (постоянное время сравнения). */
export function verifyPassword(candidate: string): boolean {
  return safeEqual(candidate, getAdminPassword());
}

/** Кука валидна? Используется в layout и в каждом server action. */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;
  return value !== undefined && safeEqual(value, sessionToken());
}

/**
 * Страж для server actions и страниц админки: не админ — на страницу входа.
 * Defense in depth: проверка НЕ только в layout — каждый action зовёт сам.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}

/** Поставить куку после успешного входа. */
export async function grantAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

/** Выход: сносим куку. */
export async function revokeAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
