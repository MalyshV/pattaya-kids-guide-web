import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { fontVariables } from "@/app/fonts";
import { themeInitScript } from "@/lib/theme/theme-script";
import { HtmlLangSync } from "@/components/layout/html-lang-sync";
import { getSiteUrl, DEFAULT_LANG } from "@/lib/geo/city";
import { getDictionary, isSupportedLang, type Lang } from "@/content/dictionary";

/**
 * Корневой layout публичного сайта. Живёт в сегменте [lang], а не в src/app,
 * ровно ради серверного <html lang>: скринридеры и краулеры получают язык
 * страницы в исходном HTML, без ожидания клиентского JS (WCAG 3.1.1).
 * У админки свой корневой layout (src/app/admin/layout.tsx).
 */

const OG_LOCALES: Record<Lang, string> = {
  ru: "ru_RU",
  en: "en_US",
  th: "th_TH",
};

/** Невалидный сегмент языка 404-ится ниже (city layout / catch-all), но
 *  <html lang> и метаданные должны быть валидными в любом случае. */
function safeLang(raw: string): Lang {
  return isSupportedLang(raw) ? raw : DEFAULT_LANG;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = safeLang(raw);
  const dict = getDictionary(lang);

  return {
    // База для абсолютных ссылок в hreflang/OG/canonical. Без неё Next 16
    // резолвил бы относительные пути от localhost/preview-URL, а не боевого
    // домена — соцсети и Google видели бы битые превью и языковые версии.
    metadataBase: new URL(getSiteUrl()),
    // template добавляет бренд-суффикс к title дочерних страниц — они задают
    // только свою часть («Skippy Land»), суффикс не дублируется и не забывается;
    // default — для страниц без своего title
    title: {
      default: dict.meta.title,
      template: `%s — ${dict.brand}`,
    },
    description: dict.meta.description,
    // Превью при пересылке ссылки в чат (главный канал роста — кнопка
    // «Поделиться»). Своё фото добавляют страницы-карточки; брендовую
    // дефолт-картинку для списков подставим позже (нужен ассет).
    openGraph: {
      type: "website",
      siteName: dict.brand,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: OG_LOCALES[lang],
    },
    // Только card: заголовок/описание/картинку X берёт из og:* каждой страницы —
    // так карточка места показывает название места, а не общий бренд.
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function LangLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const { lang: raw } = await params;

  return (
    // suppressHydrationWarning на <html>: data-theme ставит инлайн-скрипт до
    // гидрации, сервер атрибут не рендерит — это ожидаемое расхождение
    <html lang={safeLang(raw)} suppressHydrationWarning>
      <body className={fontVariables} suppressHydrationWarning>
        {/* тема — первым в body: атрибут выставляется до первой отрисовки,
            без мигания светлым у тёмных пользователей */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
        {/* страховка атрибута при клиентских переходах между локалями */}
        <HtmlLangSync />
        {/* Vercel Analytics: без cookies (баннер согласия не нужен);
            локально молчит, активируется на Vercel-деплое */}
        <Analytics />
      </body>
    </html>
  );
}
