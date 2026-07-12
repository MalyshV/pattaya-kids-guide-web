import Image from "next/image";

type PlaceImageProps = {
  url: string | null;
  alt: string;
  className?: string;
  /**
   * Подсказка браузеру, какой ширины вариант качать (next/image нарежет
   * и отдаст WebP под конкретный экран). Дефолт — карточка в сетке.
   */
  sizes?: string;
  /**
   * true — грузить сразу, без ленивой загрузки. Ставим только hero-обложке
   * на странице деталей (это LCP-элемент над сгибом); карточкам в сетке —
   * нет, там ленивость правильна.
   */
  priority?: boolean;
};

/**
 * Обложка места: фото (когда есть imageUrl) или спокойный плейсхолдер (когда
 * нет — видно, куда встанет фото). next/image ужимает исходники под экран:
 * оригиналы по 200–400 КБ превращаются в ~30–60 КБ — страница летает даже
 * на медленном интернете. SVG-тестовые обложки отдаём как есть.
 */
export function PlaceImage({
  url,
  alt,
  className,
  sizes = "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 370px",
  priority = false,
}: PlaceImageProps): React.ReactElement {
  const cls = `place-image${className ? ` ${className}` : ""}`;

  if (!url) {
    return (
      <div className={`${cls} place-image-empty`} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="M4 17l4.5-4.5 3 3L16 10l4 4" />
        </svg>
      </div>
    );
  }

  // svg оптимизатор не переваривает — оставляем обычный тег
  if (url.endsWith(".svg")) {
    return (
      <div className={cls}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          className="place-image-img"
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    );
  }

  return (
    <div className={cls}>
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        className="place-image-img"
        priority={priority}
      />
    </div>
  );
}
