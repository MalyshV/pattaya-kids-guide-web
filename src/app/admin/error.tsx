"use client";

import { useEffect } from "react";
import { ErrorContent } from "@/components/layout/error-content";

/**
 * Граница ошибки админки (у неё свой корневой layout — граница [lang] сюда
 * не достаёт). Тот же спокойный экран: ErrorContent берёт язык из пути,
 * для /admin это ru.
 */
export default function AdminErrorBoundary({
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
