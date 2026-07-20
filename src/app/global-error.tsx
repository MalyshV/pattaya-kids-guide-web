"use client";

import { useEffect } from "react";

/**
 * Аварийная граница на случай сбоя в САМОМ корневом layout: Next рендерит
 * этот файл вместо всего дерева, поэтому здесь свои <html>/<body> и стили
 * инлайном (globals.css может не примениться). Крайне редкий случай —
 * держим минимальным и в тёплой палитре, без техножаргона. Язык не
 * определить надёжно (layout упал) — текст на русском, основном для гида.
 */
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

  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#f6f3ee",
          color: "#1f1c18",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <main style={{ maxWidth: "420px", textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 8px",
              color: "#c96f4a",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Ошибка
          </p>
          <h1 style={{ margin: "0 0 12px", fontSize: "28px", lineHeight: 1.15 }}>
            Что-то пошло не так
          </h1>
          <p style={{ margin: "0 0 24px", color: "#6b6358", lineHeight: 1.6 }}>
            Произошёл сбой. Попробуйте обновить страницу — обычно это помогает.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              border: "none",
              borderRadius: "14px",
              padding: "12px 20px",
              background: "#c96f4a",
              color: "#ffffff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Попробовать снова
          </button>
        </main>
      </body>
    </html>
  );
}
