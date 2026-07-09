"use client";

import { useEffect, useState } from "react";
import { ru } from "@/content/ru";

/**
 * «Наверх» — плавающая кнопка после прокрутки страницы (списки и длинные
 * карточки мест). Появляется тихо, скроллит плавно.
 */
export function BackToTop(): React.ReactElement | null {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll(): void {
      setVisible(window.scrollY > 600);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      className="back-to-top"
      aria-label={ru.common.backToTop}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
}
