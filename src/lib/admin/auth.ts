import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Доступ в админку: один администратор, пароль в env (ADMIN_PASSWORD),
 * после входа — HttpOnly-кука «срок.подпись»: подпись = HMAC(срок) на
 * ключе-пароле. Срок проверяется НА СЕРВЕРЕ (по находке аудита: раньше
 * токен был статичным и жил вечно, пока не сменится пароль). Смена пароля
 * по-прежнему мгновенно отзывает все сессии. Без внешних сервисов.
 */

export const ADMIN_COOKIE = "pkg_admin";

/// 30 дней: локальный ноутбук Вероники, не общий компьютер
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

/// анти-перебор входа (по находке аудита): после 5 неудач подряд — пауза.
/// Счётчик в памяти инстанса: на serverless неидеально, но резко поднимает
/// стоимость перебора; для одного администратора этого достаточно
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MS = 1000 * 60 * 15;
let failedLogins = 0;
let lockedUntil = 0;

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD не задан (или короче 8 символов) — добавьте его в .env",
    );
  }
  return password;
}

function sign(message: string): string {
  return createHmac("sha256", getAdminPassword()).update(message).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // timingSafeEqual требует равной длины; разная длина = заведомо не равны
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Значение куки: «expiresAtMs.hmac» — подпись покрывает срок действия. */
function sessionCookieValue(expiresAtMs: number): string {
  return `${expiresAtMs}.${sign(`pkg-admin-v1.${expiresAtMs}`)}`;
}

/** Проверка пароля с формы входа (постоянное время сравнения). */
export function verifyPassword(candidate: string): boolean {
  return safeEqual(candidate, getAdminPassword());
}

/** Вход временно заблокирован после серии неудач? */
export function isLoginLocked(): boolean {
  return Date.now() < lockedUntil;
}

export function registerFailedLogin(): void {
  failedLogins += 1;
  if (failedLogins >= MAX_FAILED_LOGINS) {
    lockedUntil = Date.now() + LOCKOUT_MS;
    failedLogins = 0;
  }
}

export function registerSuccessfulLogin(): void {
  failedLogins = 0;
  lockedUntil = 0;
}

/** Кука валидна и не истекла? Используется в layout и в каждом action. */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!value) {
    return false;
  }

  const dotAt = value.indexOf(".");
  if (dotAt <= 0) {
    return false;
  }

  const expiresAtMs = Number(value.slice(0, dotAt));
  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) {
    return false;
  }

  return safeEqual(value, sessionCookieValue(expiresAtMs));
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
  const expiresAtMs = Date.now() + SESSION_TTL_MS;
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, sessionCookieValue(expiresAtMs), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

/** Выход: сносим куку. */
export async function revokeAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
