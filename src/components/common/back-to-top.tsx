"use client";

import { useEffect, useState } from "react";
import { useDictionary } from "@/lib/i18n/use-dictionary";

/**
 * «Наверх» — плавающая кнопка после прокрутки страницы (списки и длинные
 * карточки мест). Появляется тихо, скроллит плавно.
 */
export function BackToTop(): React.ReactElement | null {
  const [visible, setVisible] = useState(false);
  // Хук вызывается до раннего return — хуки нельзя вызывать условно.
  const dict = useDictionary();

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
      aria-label={dict.common.backToTop}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
}
