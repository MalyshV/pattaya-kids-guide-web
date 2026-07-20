import type { Metadata } from "next";
import { Geist, Geist_Mono, Sarabun } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { HtmlLangSync } from "@/components/layout/html-lang-sync";
import { getSiteUrl } from "@/lib/geo/city";
import { ru } from "@/content/ru";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Тайская гарнитура (у Arial тайских глифов нет). Sarabun — спокойная,
// читаемая, с традиционными «петельками». Подключена в font-family после
// Arial: благодаря unicode-range браузер скачивает её ТОЛЬКО на страницах
// с тайским текстом — RU/EN-страницы не платят ничего.
const sarabun = Sarabun({
  variable: "--font-thai",
  weight: ["400", "500", "600", "700"],
  subsets: ["thai"],
  display: "swap",
});

export const metadata: Metadata = {
  // База для абсолютных ссылок в hreflang/OG/canonical. Без неё Next 16
  // резолвил бы относительные пути от localhost/preview-URL, а не боевого
  // домена — соцсети и Google видели бы битые превью и языковые версии.
  metadataBase: new URL(getSiteUrl()),
  title: ru.meta.title,
  description: ru.meta.description,
  // Превью при пересылке ссылки в чат (главный канал роста — кнопка
  // «Поделиться»). Своё фото добавляют страницы-карточки; брендовую
  // дефолт-картинку для списков подставим позже (нужен ассет).
  openGraph: {
    type: "website",
    siteName: ru.brand,
    title: ru.meta.title,
    description: ru.meta.description,
    locale: "ru_RU",
  },
  // Только card: заголовок/описание/картинку X берёт из og:* каждой страницы —
  // так карточка места показывает название места, а не общий бренд.
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sarabun.variable}`}
        suppressHydrationWarning
      >
        {children}
        {/* <html lang> по языку страницы (корневой layout не знает params.lang) */}
        <HtmlLangSync />
        {/* Vercel Analytics: без cookies (баннер согласия не нужен);
            локально молчит, активируется на Vercel-деплое */}
        <Analytics />
      </body>
    </html>
  );
}
