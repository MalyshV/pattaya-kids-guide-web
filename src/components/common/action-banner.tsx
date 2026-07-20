"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Универсальный модальный баннер результата действия. Сейчас применяется в
 * админке (добавил/изменил/удалил карточку), но нарочно сделан общим —
 * чтобы позже переиспользовать для действий пользователя (UGC: «событие
 * отправлено на модерацию»). Меняются текст и иконка через props, сам
 * баннер универсален.
 *
 * Закрытие: клик по оверлею, по кнопке «×» или Esc. Портал в body, блокировка
 * прокрутки и возврат фокуса — как у лайтбокса.
 */

export type ActionBannerVariant = "success" | "error";

type ActionBannerProps = {
  variant: ActionBannerVariant;
  title: string;
  message?: string;
  /** своя иконка вместо дефолтной по variant (эмодзи или узел) */
  icon?: React.ReactNode;
  closeLabel: string;
  onClose: () => void;
};

function DefaultIcon({ variant }: { variant: ActionBannerVariant }): React.ReactElement {
  // одна линия, без заливки — в тон спокойному интерфейсу
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {variant === "success" ? (
        <path d="M20 6 9 17l-5-5" />
      ) : (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5" />
          <path d="M12 16.5v.5" />
        </>
      )}
    </svg>
  );
}

export function ActionBanner({
  variant,
  title,
  message,
  icon,
  closeLabel,
  onClose,
}: ActionBannerProps): React.ReactElement {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose();
      }
      // единственный фокусируемый контрол — кнопка закрытия: держим фокус
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="action-banner-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-banner-title"
      onClick={onClose}
    >
      <div
        className={`action-banner action-banner-${variant}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          ref={closeRef}
          className="action-banner-close"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="action-banner-icon" aria-hidden={icon ? undefined : "true"}>
          {icon ?? <DefaultIcon variant={variant} />}
        </div>

        <h2 id="action-banner-title" className="action-banner-title">
          {title}
        </h2>
        {message ? <p className="action-banner-message">{message}</p> : null}
      </div>
    </div>,
    document.body,
  );
}
