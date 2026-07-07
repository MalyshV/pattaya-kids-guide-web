type PlaceImageProps = {
  url: string | null;
  alt: string;
  className?: string;
};

/**
 * Обложка места: фото (когда есть imageUrl) или спокойный плейсхолдер (когда
 * нет — видно, куда встанет фото). Обычный <img>, чтобы без настройки доменов
 * и forматов принимать любые тестовые файлы из public/images/places.
 */
export function PlaceImage({ url, alt, className }: PlaceImageProps): React.ReactElement {
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

  return (
    <div className={cls}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={alt} className="place-image-img" loading="lazy" />
    </div>
  );
}
