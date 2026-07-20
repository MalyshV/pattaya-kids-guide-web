import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import "@/app/globals.css";
import { fontVariables } from "@/app/fonts";
import { isAdmin } from "@/lib/admin/auth";
import { logoutAction } from "@/app/admin/actions";
import { ActionResultBanner } from "@/app/admin/action-result-banner";

/**
 * Оболочка админки — свой КОРНЕВОЙ layout (<html>/<body> здесь): публичный
 * корень живёт в сегменте [lang] ради серверного <html lang>, а админка
 * всегда русская — lang="ru" зашит.
 * Auth-стража здесь НЕТ намеренно: /admin/login живёт внутри этого layout
 * (иначе цикл редиректов) — каждая защищённая страница и каждый server
 * action зовут requireAdmin() сами.
 * Тексты по-русски без словаря: админка личная, локализация ей не нужна.
 */

export const metadata: Metadata = {
  title: "Админка — Pattaya Kids Guide",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const authed = await isAdmin();

  return (
    <html lang="ru">
      <body className={fontVariables} suppressHydrationWarning>
        <div className="admin-shell">
          <header className="admin-header">
            <Link href="/admin/places" className="admin-brand">
              Pattaya Kids Guide · админка
            </Link>
            {authed ? (
              <nav className="admin-nav" aria-label="Разделы админки">
                <Link href="/admin/places">Места</Link>
                <Link href="/admin/events">События</Link>
                <Link href="/admin/activities">Занятия</Link>
                <Link href="/" target="_blank" rel="noopener">
                  Открыть сайт ↗
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="admin-link-button">
                    Выйти
                  </button>
                </form>
              </nav>
            ) : null}
          </header>
          <main className="admin-main">{children}</main>
          {/* баннер результата действия (успех/ошибка CRUD) — читает флаг из URL.
              Suspense обязателен: useSearchParams требует границы. */}
          <Suspense fallback={null}>
            <ActionResultBanner />
          </Suspense>
        </div>
      </body>
    </html>
  );
}
