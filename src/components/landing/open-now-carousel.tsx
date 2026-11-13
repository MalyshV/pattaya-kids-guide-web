"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDictionary } from "@/lib/i18n/use-dictionary";

type OpenNowCarouselProps = {
  title: string;
  moreHref: string;
  moreLabel: string;
  /** карточки мест, уже отрисованные сервером */
  cards: { id: string; node: React.ReactNode }[];
};

type ScrollState = {
  /** лента шире экрана — есть куда листать */
  overflow: boolean;
  atStart: boolean;
  atEnd: boolean;
  /** карточка у левого края — для точек на телефоне */
  active: number;
};

const INITIAL_STATE: ScrollState = {
  overflow: false,
  atStart: true,
  atEnd: false,
  active: 0,
};

/**
 * «Открыто сейчас» на главной — лента, которую листают вбок. На десктопе три
 * карточки и выглядывающий край четвёртой, тонкие ‹ › в шапке рядом с «Все
 * места» (мышью без трекпада вбок не прокрутишь). На телефоне одна карточка
 * и край следующей, под лентой — точки; текущая — красная, как единственная
 * красная точка экрана. Листание — родной прокруткой с привязкой к карточке,
 * без своей анимации.
 */
export function OpenNowCarousel({
  title,
  moreHref,
  moreLabel,
  cards,
}: OpenNowCarouselProps): React.ReactElement {
  const dict = useDictionary();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<ScrollState>(INITIAL_STATE);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const maxScroll = track.scrollWidth - track.clientWidth;
    const first = track.firstElementChild as HTMLElement | null;
    const second = first?.nextElementSibling as HTMLElement | null;
    // шаг ленты = ширина карточки + зазор (расстояние между соседями)
    const step =
      first && second ? second.offsetLeft - first.offsetLeft : track.clientWidth;
    // у правого края активной считаем последнюю: иначе на широком экране
    // последняя точка не загорелась бы никогда
    const active =
      track.scrollLeft >= maxScroll - 2
        ? cards.length - 1
        : Math.round(track.scrollLeft / Math.max(step, 1));
    const next: ScrollState = {
      overflow: maxScroll > 2,
      atStart: track.scrollLeft <= 2,
      atEnd: track.scrollLeft >= maxScroll - 2,
      active,
    };
    setState((prev) =>
      prev.overflow === next.overflow &&
      prev.atStart === next.atStart &&
      prev.atEnd === next.atEnd &&
      prev.active === next.active
        ? prev
        : next,
    );
  }, [cards.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    measure();

    let frame = 0;
    const onScroll = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    // поворот телефона, смена ширины окна — меняется и шаг, и «есть ли куда листать»
    const resize = new ResizeObserver(measure);
    resize.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      resize.disconnect();
    };
  }, [measure]);

  const scrollByCards = (direction: 1 | -1): void => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    const second = first?.nextElementSibling as HTMLElement | null;
    if (!track || !first || !second) {
      return;
    }
    const step = second.offsetLeft - first.offsetLeft;
    // листаем столько карточек, сколько видно целиком: на десктопе — тройками
    const visible = Math.max(1, Math.floor((track.clientWidth + 1) / step));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * step * visible,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section className="landing-block open-now">
      <div className="landing-block-header">
        <h2 className="landing-block-title">{title}</h2>
        <div className="landing-block-actions">
          {state.overflow ? (
            <div className="carousel-arrows">
              <button
                type="button"
                className="carousel-arrow"
                aria-label={dict.landing.carouselPrev}
                disabled={state.atStart}
                onClick={() => scrollByCards(-1)}
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                className="carousel-arrow"
                aria-label={dict.landing.carouselNext}
                disabled={state.atEnd}
                onClick={() => scrollByCards(1)}
              >
                <ChevronIcon direction="right" />
              </button>
            </div>
          ) : null}
          <Link href={moreHref} className="landing-more-link">
            {moreLabel}
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
      </div>

      <div
        ref={trackRef}
        className={
          cards.length > 3 ? "carousel-track carousel-track-peek" : "carousel-track"
        }
      >
        {cards.map((card) => (
          <div key={card.id} className="carousel-slide">
            {card.node}
          </div>
        ))}
      </div>

      {/* точки — только на телефоне (CSS); для скринридера лента — просто список карточек */}
      {cards.length > 1 ? (
        <div className="carousel-dots" aria-hidden="true">
          {cards.map((card, index) => (
            <span
              key={card.id}
              className={
                index === state.active
                  ? "carousel-dot carousel-dot-active"
                  : "carousel-dot"
              }
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }): React.ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path
        d={direction === "left" ? "M11 3.5 5.5 9l5.5 5.5" : "M7 3.5 12.5 9 7 14.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
