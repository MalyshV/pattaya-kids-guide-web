"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PlaceImage } from "@/components/places/place-image";
import { useDictionary } from "@/lib/i18n/use-dictionary";

/**
 * Фото с увеличением: клик открывает лайтбокс на весь экран. Закрытие —
 * клик вне фото, Esc или кнопка-шарик (нажал — шарик улетает вверх).
 * Без url ведёт себя как обычный PlaceImage-плейсхолдер, клика нет.
 */

type ZoomableImageProps = {
  url: string | null;
  alt: string;
  className?: string;
  /** прокидывается в PlaceImage: какой ширины вариант качать */
  sizes?: string;
  /** прокидывается в PlaceImage: hero-обложку грузим сразу (LCP) */
  priority?: boolean;
};

/** Воздушный шарик — минималистичная замена крестику (одна линия) */
function BalloonIcon(): React.ReactElement {
  return (
    <svg
      className="balloon-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* купол шарика */}
      <ellipse cx="12" cy="8.6" rx="5.6" ry="6.4" />
      {/* блик */}
      <path d="M9.3 6.2a3.4 3.4 0 0 1 2-1.5" />
      {/* узелок */}
      <path d="M10.9 15.6l1.1-1 1.1 1z" />
      {/* ниточка волной */}
      <path d="M12 15.9c-1.3 1.2 1.3 2.2 0 4.1" />
    </svg>
  );
}

export function ZoomableImage({
  url,
  alt,
  className,
  sizes,
  priority = false,
}: ZoomableImageProps): React.ReactElement {
  const dict = useDictionary();
  const [isOpen, setIsOpen] = useState(false);
  // «улетание» шарика перед закрытием — только при клике по нему
  const [isLeaving, setIsLeaving] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Запрос закрытия: откатываем свою запись истории — popstate закроет и
  // вернёт фокус. Если записи нет (edge) — закрываем напрямую.
  const requestClose = useCallback(() => {
    if (window.history.state?.lightbox) {
      window.history.back();
    } else {
      setIsOpen(false);
      setIsLeaving(false);
      triggerRef.current?.focus();
    }
  }, []);

  // Открытие кладёт запись в историю. popstate — единственное место закрытия
  // (гасит лайтбокс и возвращает фокус, каким бы способом ни закрыли).
  // Закрытие всегда идёт через history.back(): cleanup back() не дёргаем,
  // иначе навигация ВПЕРЁД при открытом фото уводила бы на шаг назад.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    window.history.pushState({ lightbox: true }, "");

    const onPopState = (): void => {
      setIsOpen(false);
      setIsLeaving(false);
      triggerRef.current?.focus();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isOpen]);

  // клик по шарику: даём анимации улететь, потом закрываем
  function closeWithBalloon(): void {
    if (isLeaving) {
      return;
    }
    setIsLeaving(true);
    window.setTimeout(requestClose, 280);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    closeRef.current?.focus();

    // страница под лайтбоксом не должна скроллиться
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        requestClose();
      }
      // единственный фокусируемый элемент — кнопка-шарик: Tab не уводит фокус
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
  }, [isOpen, requestClose]);

  // без фото — обычный плейсхолдер, увеличивать нечего
  if (!url) {
    return (
      <PlaceImage
        url={url}
        alt={alt}
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className="zoomable-trigger"
        aria-label={`${dict.common.zoomPhoto}: ${alt}`}
        onClick={() => setIsOpen(true)}
      >
        <PlaceImage
          url={url}
          alt={alt}
          className={className}
          sizes={sizes}
          priority={priority}
        />
      </button>

      {isOpen
        ? createPortal(
            <div
              className="lightbox-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={alt}
              onClick={requestClose}
            >
              <div className="lightbox-figure">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={alt}
                  className="lightbox-img"
                  onClick={(event) => event.stopPropagation()}
                />
                <button
                  type="button"
                  ref={closeRef}
                  className={`lightbox-close${isLeaving ? " lightbox-close-leaving" : ""}`}
                  aria-label={dict.common.closePhoto}
                  onClick={(event) => {
                    event.stopPropagation();
                    closeWithBalloon();
                  }}
                >
                  <BalloonIcon />
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
