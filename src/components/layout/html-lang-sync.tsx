"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { langFromPath } from "@/content/dictionary";

/**
 * Держит <html lang> в соответствии с языком страницы. Корневой layout не
 * знает params.lang (html можно рендерить только там), поэтому атрибут
 * синхронизируется на клиенте по сегменту URL.
 */
export function HtmlLangSync(): null {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = langFromPath(pathname);
  }, [pathname]);

  return null;
}
