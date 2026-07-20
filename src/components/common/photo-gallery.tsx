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
 * История: закрытие ВСЕГДА идёт через history.back() → popstate — единая
 * точка, где лайтбокс гаснет и фокус возвращается на миниатюру. Это чинит
 * потерю фокуса при Esc/фоне/«Назад» и не даёт cleanup дёргать back() при
 * навигации ВПЕРЁД (иначе уводило бы на шаг назад).
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
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  // индекс открытого фото для возврата фокуса на «свою» миниатюру после
  // закрытия любым способом (popstate — единая точка закрытия)
  const openIndexRef = useRef<number | null>(null);
  useEffect(() => {
    openIndexRef.current = openIndex;
  }, [openIndex]);

  const showAt = useCallback((index: number) => {
    setOpenIndex(index);
  }, []);

  // Запрос закрытия: откатываем свою запись истории — popstate закроет и
  // вернёт фокус. Если записи вдруг нет (edge) — закрываем напрямую.
  const requestClose = useCallback(() => {
    if (window.history.state?.lightbox) {
      window.history.back();
    } else {
      setOpenIndex(null);
    }
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

  // История открытия: одна запись на сессию просмотра (листание индекс не
  // трогает историю — эффект висит на isOpen). popstate — единственное место
  // закрытия: гасит лайтбокс и возвращает фокус на миниатюру.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    window.history.pushState({ lightbox: true }, "");

    const onPopState = (): void => {
      const index = openIndexRef.current;
      setOpenIndex(null);
      if (index !== null) {
        window.setTimeout(() => triggersRef.current[index]?.focus(), 0);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    closeButtonFocus(overlayRef.current);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        requestClose();
      } else if (event.key === "ArrowRight") {
        step(1);
      } else if (event.key === "ArrowLeft") {
        step(-1);
      } else if (event.key === "Tab") {
        // фокус-ловушка по ВСЕМ контролам оверлея (стрелки + закрытие),
        // чтобы стрелки были достижимы с клавиатуры, а фокус не убегал
        // на страницу под лайтбоксом
        trapTab(event, overlayRef.current);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, requestClose, step]);

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
              ref={overlayRef}
              className="lightbox-overlay"
              role="dialog"
              aria-modal="true"
              // позиция в подписи — чтобы скринридер сразу озвучил «N из M»
              aria-label={
                many
                  ? `${photos[openIndex].caption ?? placeName} — ${dict.common.photoCounter(openIndex + 1, photos.length)}`
                  : (photos[openIndex].caption ?? placeName)
              }
              onClick={requestClose}
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
                // live-регион: при листании (стрелки/свайп) скринридер
                // озвучивает новую позицию «N из M». При открытии её читает
                // aria-label диалога (live-регион первый рендер не объявляет).
                <p className="lightbox-counter" role="status" aria-live="polite">
                  {dict.common.photoCounter(openIndex + 1, photos.length)}
                </p>
              ) : null}

              <button
                type="button"
                className="lightbox-close"
                aria-label={dict.common.closePhoto}
                onClick={(event) => {
                  event.stopPropagation();
                  requestClose();
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

/** фокусируемые контролы оверлея в порядке обхода */
function focusables(overlay: HTMLElement | null): HTMLButtonElement[] {
  if (!overlay) {
    return [];
  }
  return Array.from(overlay.querySelectorAll<HTMLButtonElement>("button"));
}

/** при открытии ставим фокус на кнопку закрытия (стабильный якорь) */
function closeButtonFocus(overlay: HTMLElement | null): void {
  overlay?.querySelector<HTMLButtonElement>(".lightbox-close")?.focus();
}

/** зациклить Tab по контролам оверлея — стрелки достижимы, фокус не убегает */
function trapTab(event: KeyboardEvent, overlay: HTMLElement | null): void {
  const items = focusables(overlay);
  if (items.length === 0) {
    return;
  }
  event.preventDefault();
  const active = document.activeElement as HTMLButtonElement | null;
  const currentIndex = active ? items.indexOf(active) : -1;
  const delta = event.shiftKey ? -1 : 1;
  const nextIndex = (currentIndex + delta + items.length) % items.length;
  items[nextIndex]?.focus();
}
