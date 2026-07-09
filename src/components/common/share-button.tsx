"use client";

import { useState } from "react";
import { useDictionary } from "@/lib/i18n/use-dictionary";

type ShareButtonProps = {
  /** Заголовок для системного окна «поделиться» (название места/события/занятия). */
  title: string;
};

/**
 * «Поделиться» на страницах деталей: родители пересылают находки в чаты — это
 * главный путь сарафана. На мобильных открывает системное окно (Telegram/LINE
 * и т.д.), на десктопе без Web Share API — тихо копирует ссылку.
 */
/** Запасное копирование для окружений, где Clipboard API запрещён. */
function legacyCopy(url: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  textarea.remove();
  return ok;
}

export function ShareButton({ title }: ShareButtonProps): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const dict = useDictionary();

  function markCopied(): void {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare(): Promise<void> {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // пользователь закрыл системное окно — не ошибка, ничего не делаем
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      markCopied();
    } catch {
      if (legacyCopy(url)) {
        markCopied();
      }
    }
  }

  return (
    <button
      type="button"
      className={`share-button${copied ? " share-button-copied" : ""}`}
      onClick={handleShare}
    >
      {copied ? dict.share.copied : dict.share.cta}
    </button>
  );
}
