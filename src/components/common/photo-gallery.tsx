"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PlaceImage } from "@/components/places/place-image";
import { useDictionary } from "@/lib/i18n/use-dictionary";

/**
 * Галерея фото с листаемым лайтбоксом. Миниатюры открывают полноэкранный
 * просмотр, где фото можно листать: стрелки, клавиши ← →, свайп на телефоне,
 * счётчик «2 из 4». Закрытие — «Назад» браузера (лайтбокс кладёт запись в
 * историю: интуитивный жест закрывает фото, а не уводит со страницы), Esc,
 * кнопка-шарик или клик по фону.
 *
 * Одиночное фото (обложки) остаётся на ZoomableImage — там листать нечего.
 */

type GalleryPhoto = {
  id: string;
  url: string | null;
  caption: string | null;
};

/** Воздушный шарик — та же метафора закрытия, что и в ZoomableImage */
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
      <ellipse cx="12" cy="8.6" rx="5.6" ry="6.4" />
      <path d="M9.3 6.2a3.4 3.4 0 0 1 2-1.5" />
      <path d="M10.9 15.6l1.1-1 1.1 1z" />
      <path d="M12 15.9c-1.3 1.2 1.3 2.2 0 4.1" />
    </svg>
  );
}

/** порог свайпа: короче — считаем случайным дрожанием пальца */
const SWIPE_THRESHOLD = 45;

export function PhotoGallery({
  photos,
  placeName,
}: {
  photos: GalleryPhoto[];
  placeName: string;
}): React.ReactElement {
  const dict = useDictionary();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;
  const triggersRef = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  // «Назад» закрывает лайтбокс: помним, что мы сами добавили запись в историю,
  // чтобы при обычном закрытии откатить её и не оставить «фантомный» шаг
  const pushedHistoryRef = useRef(false);

  const showAt = useCallback((index: number) => {
    setOpenIndex(index);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) {
          return current;
        }
        // по кругу: с последнего вперёд — на первое, и наоборот
        return (current + delta + photos.length) % photos.length;
      });
    },
    [photos.length],
  );

  // История: открытие кладёт запись, «Назад» (popstate) закрывает лайтбокс,
  // а не страницу. Обычное закрытие (Esc/шарик/фон) откатывает эту запись
  // сами через history.back(), чтобы не копить лишние шаги.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    window.history.pushState({ lightbox: true }, "");
    pushedHistoryRef.current = true;

    const onPopState = (): void => {
      // сюда попадаем и по «Назад», и после нашего history.back() — в обоих
      // случаях запись уже снята, закрываем без повторного отката
      pushedHistoryRef.current = false;
      setOpenIndex(null);
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      // размонтирование не по «Назад» (Esc/шарик/фон) — откатываем свою запись
      if (pushedHistoryRef.current) {
        pushedHistoryRef.current = false;
        window.history.back();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowRight") {
        step(1);
      } else if (event.key === "ArrowLeft") {
        step(-1);
      } else if (event.key === "Tab") {
        // фокус держим на кнопке закрытия — единственном стабильном контроле
        event.preventDefault();
        closeRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, step]);

  // фокус возвращаем на миниатюру, с которой открыли — после закрытия
  const closeAndRestoreFocus = useCallback(
    (index: number) => {
      close();
      window.setTimeout(() => triggersRef.current[index]?.focus(), 0);
    },
    [close],
  );

  const many = photos.length > 1;

  return (
    <>
      <div className="cover-gallery">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            ref={(el) => {
              triggersRef.current[index] = el;
            }}
            className="zoomable-trigger"
            aria-label={`${dict.common.zoomPhoto}: ${photo.caption ?? placeName}`}
            onClick={() => showAt(index)}
          >
            <PlaceImage url={photo.url} alt={photo.caption ?? placeName} />
          </button>
        ))}
      </div>

      {isOpen
        ? createPortal(
            <div
              className="lightbox-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={photos[openIndex].caption ?? placeName}
              onClick={close}
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null || !many) {
                  return;
                }
                const dx = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
                if (Math.abs(dx) > SWIPE_THRESHOLD) {
                  step(dx < 0 ? 1 : -1);
                }
                touchStartX.current = null;
              }}
            >
              {many ? (
                <button
                  type="button"
                  className="lightbox-nav lightbox-nav-prev"
                  aria-label={dict.common.prevPhoto}
                  onClick={(event) => {
                    event.stopPropagation();
                    step(-1);
                  }}
                >
                  <span aria-hidden="true">‹</span>
                </button>
              ) : null}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[openIndex].url ?? ""}
                alt={photos[openIndex].caption ?? placeName}
                className="lightbox-img"
                onClick={(event) => event.stopPropagation()}
              />

              {many ? (
                <button
                  type="button"
                  className="lightbox-nav lightbox-nav-next"
                  aria-label={dict.common.nextPhoto}
                  onClick={(event) => {
                    event.stopPropagation();
                    step(1);
                  }}
                >
                  <span aria-hidden="true">›</span>
                </button>
              ) : null}

              {many ? (
                <p className="lightbox-counter" aria-live="polite">
                  {dict.common.photoCounter(openIndex + 1, photos.length)}
                </p>
              ) : null}

              <button
                type="button"
                ref={closeRef}
                className="lightbox-close"
                aria-label={dict.common.closePhoto}
                onClick={(event) => {
                  event.stopPropagation();
                  closeAndRestoreFocus(openIndex);
                }}
              >
                <BalloonIcon />
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
