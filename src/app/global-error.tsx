"use client";

import { useEffect } from "react";
import { applyStoredTheme } from "@/lib/theme/theme-script";

/**
 * Аварийная граница на случай сбоя в САМОМ корневом layout: Next рендерит
 * этот файл вместо всего дерева, поэтому здесь свои <html>/<body> и стили
 * отдельным <style> (globals.css может не примениться). Крайне редкий случай —
 * держим минимальным и в тёплой палитре, без техножаргона. Язык не
 * определить надёжно (layout упал) — текст на русском, основном для гида.
 *
 * Тема: страница обязана уважать её, иначе у тёмного пользователя сбой
 * вспыхивает белым экраном — самый неприятный момент в самый неудачный
 * миг. Токены заданы дважды: системная настройка отрабатывает сразу через
 * prefers-color-scheme, а сохранённый выбор («тёмная при светлой системе»)
 * доставляет applyStoredTheme в эффекте. Инлайн-скрипт, как в рабочих
 * layout, здесь не годится: эту границу React рендерит уже на клиенте, а
 * вставленный им <script> браузер не исполняет.
 */
const ERROR_STYLES = `
:root {
  --bg: #f6f3ee;
  --fg: #1f1c18;
  --muted: #6b6358;
  --accent-text: #a65136;
  --accent-fill: #a9563a;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #211b14;
    --fg: #ede5d8;
    --muted: #b3a897;
    --accent-text: #e89a70;
    --accent-fill: #a9563a;
    color-scheme: dark;
  }
}
html[data-theme="light"] {
  --bg: #f6f3ee;
  --fg: #1f1c18;
  --muted: #6b6358;
  --accent-text: #a65136;
  color-scheme: light;
}
html[data-theme="dark"] {
  --bg: #211b14;
  --fg: #ede5d8;
  --muted: #b3a897;
  --accent-text: #e89a70;
  color-scheme: dark;
}
body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg);
  color: var(--fg);
  font-family: Arial, Helvetica, sans-serif;
}
.error-shell { max-width: 420px; text-align: center; }
.error-eyebrow {
  margin: 0 0 8px;
  color: var(--accent-text);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.error-title { margin: 0 0 12px; font-size: 28px; line-height: 1.15; }
.error-text { margin: 0 0 24px; color: var(--muted); line-height: 1.6; }
.error-button {
  border: none;
  border-radius: 14px;
  padding: 12px 20px;
  background: var(--accent-fill);
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
}
`;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  useEffect(() => {
    console.error(error);
  }, [error]);

  useEffect(() => {
    applyStoredTheme();
  }, []);

  return (
    <html lang="ru">
      <head>
        <style dangerouslySetInnerHTML={{ __html: ERROR_STYLES }} />
      </head>
      <body>
        <main className="error-shell">
          <p className="error-eyebrow">Ошибка</p>
          <h1 className="error-title">Что-то пошло не так</h1>
          <p className="error-text">
            Произошёл сбой. Попробуйте обновить страницу — обычно это помогает.
          </p>
          <button type="button" onClick={reset} className="error-button">
            Попробовать снова
          </button>
        </main>
      </body>
    </html>
  );
}
