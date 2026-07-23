import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_CITY_SLUG } from "@/lib/geo/base-path";
import { detectPreferredLang, LOCALE_COOKIE } from "@/lib/i18n/detect-lang";

/**
 * Автоопределение языка на «пустом» входе. Голый домен `/` уводим на нужную
 * языковую версию: сохранённый выбор (cookie) → язык браузера → русский.
 * Так таец с тайским браузером сразу попадает на тайскую версию, а свой
 * выбор (переключатель ставит cookie) всегда уважается.
 *
 * Работает ТОЛЬКО на `/` (см. matcher) — ссылки с языком (`/th/...`) не трогаем.
 */
export function middleware(request: NextRequest): NextResponse {
  const lang = detectPreferredLang(
    request.cookies.get(LOCALE_COOKIE)?.value,
    request.headers.get("accept-language"),
  );

  const url = request.nextUrl.clone();
  // корень города = посадочная «Что ищете прямо сейчас?»
  url.pathname = `/${lang}/${DEFAULT_CITY_SLUG}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/",
};
