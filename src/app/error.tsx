"use client";

import { useEffect } from "react";
import { ErrorContent } from "@/components/layout/error-content";

/**
 * Граница ошибки для всего приложения (сбой рендера/сервера ниже корневого
 * layout). Next требует "use client" и пропсы {error, reset}. Показываем
 * спокойную страницу с кнопкой «Попробовать снова» (reset перемонтирует
 * упавший сегмент). Ошибку логируем — в проде сюда встанет мониторинг.
 */
export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorContent reset={reset} />;
}
