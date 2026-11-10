import { Cormorant_Garamond, Manrope, Sarabun } from "next/font/google";

/**
 * Шрифты в общем модуле: корневых layout два (публичный `[lang]` и админка),
 * a next/font инициализируется в module scope — оба layout берут один
 * экземпляр. Образ «Тушь и вода» (решение 10.11): заголовки — антиква
 * Cormorant Garamond, текст и кнопки — Manrope. Обе гарнитуры самохостятся
 * через next/font (без запросов к Google с клиента) и режутся по
 * unicode-range: кириллицу качают только страницы с кириллицей.
 */

// Заголовки и «выбираемые слова» в предложении-фильтре (курсив).
export const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Основной текст, кнопки, подписи вразрядку.
export const manrope = Manrope({
  variable: "--font-sans",
  weight: ["500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Тайская гарнитура (у латинских гарнитур тайских глифов нет). Sarabun —
// спокойная, читаемая, с традиционными «петельками». Стоит в font-family
// после основных: благодаря unicode-range браузер скачивает её ТОЛЬКО на
// страницах с тайским текстом — RU/EN-страницы не платят ничего.
export const sarabun = Sarabun({
  variable: "--font-thai",
  weight: ["400", "500", "600", "700"],
  subsets: ["thai"],
  display: "swap",
});

/** Класс для <body>: CSS-переменные гарнитур. */
export const fontVariables = `${cormorant.variable} ${manrope.variable} ${sarabun.variable}`;
