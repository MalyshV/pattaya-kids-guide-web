"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { applyStoredTheme } from "@/lib/theme/theme-script";

/**
 * Страховка для data-theme — зеркало HtmlLangSync: при клиентском переходе
 * между локалями React пересобирает <html> и стирает атрибут, который
 * поставил инлайн-скрипт (при soft-навигации скрипты не перезапускаются) —
 * тема слетала в светлую. Возвращаем её после каждого перехода.
 */
export function ThemeSync(): null {
  const pathname = usePathname();

  useEffect(() => {
    applyStoredTheme();
  }, [pathname]);

  return null;
}
