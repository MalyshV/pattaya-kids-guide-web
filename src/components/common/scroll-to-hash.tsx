"use client";

import { useEffect } from "react";

/**
 * Докручивает к якорю, когда его блок действительно появился на странице.
 *
 * У списков есть скелетон загрузки (loading.tsx): Next.js ищет #якорь ещё на
 * скелетоне, не находит и оставляет страницу наверху, а настоящий блок
 * приходит позже. Компонент кладётся рядом с якорем и при монтировании, если
 * в адресе именно его #id, прокручивает к нему (отступ под шапку — через
 * scroll-margin в globals.css).
 */
export function ScrollToHash({ id }: { id: string }): null {
  useEffect(() => {
    if (window.location.hash !== `#${id}`) {
      return;
    }
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, [id]);

  return null;
}
