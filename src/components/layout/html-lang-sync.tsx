"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { langFromPath } from "@/content/dictionary";

/**
 * Страховка для <html lang>: серверно атрибут ставит layout сегмента [lang],
 * а здесь он дублируется при клиентских переходах между локалями — React
 * не гарантирует обновление атрибутов <html> при soft-навигации.
 */
export function HtmlLangSync(): null {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = langFromPath(pathname);
  }, [pathname]);

  return null;
}
