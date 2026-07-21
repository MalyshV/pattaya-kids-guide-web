import { Sarabun } from "next/font/google";

/**
 * Шрифты в общем модуле: корневых layout два (публичный `[lang]` и админка),
 * a next/font инициализируется в module scope — оба layout берут один
 * экземпляр. Латиница/кириллица набираются системной Arial (globals.css) —
 * отдельная веб-гарнитура для них не подключается (перф-аудит 07.2026: Geist
 * был подключён, но нигде не использовался).
 */

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

/** Класс для <body>: CSS-переменные гарнитур. */
export const fontVariables = sarabun.variable;
