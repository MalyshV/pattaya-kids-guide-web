import { Geist, Geist_Mono, Sarabun } from "next/font/google";

/**
 * Шрифты в общем модуле: корневых layout теперь два (публичный `[lang]` и
 * админка), а next/font инициализируется в module scope — оба layout берут
 * одни и те же экземпляры, без дублирования @font-face.
 */

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Тайская гарнитура (у Arial тайских глифов нет). Sarabun — спокойная,
// читаемая, с традиционными «петельками». Подключена в font-family после
// Arial: благодаря unicode-range браузер скачивает её ТОЛЬКО на страницах
// с тайским текстом — RU/EN-страницы не платят ничего.
export const sarabun = Sarabun({
  variable: "--font-thai",
  weight: ["400", "500", "600", "700"],
  subsets: ["thai"],
  display: "swap",
});

/** Класс для <body>: CSS-переменные всех гарнитур разом. */
export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${sarabun.variable}`;
