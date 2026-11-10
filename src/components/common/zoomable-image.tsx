"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  hasLightboxHistoryEntry,
  openLightboxHistoryEntry,
  subscribeLightboxHistoryGuard,
} from "@/components/common/lightbox-history";
import { BrushCloseIcon } from "@/components/common/brush-close-icon";
import { PlaceImage } from "@/components/places/place-image";
import { useDictionary } from "@/lib/i18n/use-dictionary";

/**
 * Фото с увеличением: клик открывает лайтбокс на весь экран. Закрытие —
 * клик вне фото, Esc или кнопка-крестик.
 * Без url ведёт себя как обычный PlaceImage-плейсхолдер, клика нет.
 *
 * История: открытие кладёт запись, закрытие всегда идёт через history.back()
 * → popstate. После закрытия запись остаётся в forward-стеке без слушателя —
 * «Вперёд» приводил бы на фантом, съедающий следующий «Назад»; такие записи
 * гасит общий страж из lightbox-history (подписка mount-эффектом ниже).
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

export function ZoomableImage({
  url,
  alt,
  className,
  sizes,
  priority = false,
}: ZoomableImageProps): React.ReactElement {
  const dict = useDictionary();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // страж фантомных записей истории — один на вкладку (refcount в модуле)
  useEffect(() => subscribeLightboxHistoryGuard(), []);

  // Запрос закрытия: откатываем свою запись истории — popstate закроет и
  // вернёт фокус. Если записи нет (edge) — закрываем напрямую.
  const requestClose = useCallback(() => {
    if (hasLightboxHistoryEntry()) {
      window.history.back();
    } else {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }, []);

  // Открытие кладёт запись в историю. popstate — единственное место закрытия
  // (гасит лайтбокс и возвращает фокус, каким бы способом ни закрыли).
  // Закрытие всегда идёт через history.back(): cleanup back() не дёргаем,
  // иначе навигация ВПЕРЁД при открытом фото уводила бы на шаг назад.
  // Модуль истории заодно считает открытые лайтбоксы — пока счётчик не
  // обнулился (cleanup), страж в наш popstate не вмешивается.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const markClosed = openLightboxHistoryEntry();

    const onPopState = (): void => {
      setIsOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      markClosed();
    };
  }, [isOpen]);

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
      // единственный фокусируемый элемент — кнопка закрытия: Tab не уводит фокус
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
                  className="lightbox-close"
                  aria-label={dict.common.closePhoto}
                  onClick={(event) => {
                    event.stopPropagation();
                    requestClose();
                  }}
                >
                  <BrushCloseIcon />
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
