import Image from "next/image";
import { isPosterShape } from "@/lib/images/image-shape";

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
  /**
   * По чему выбирать вариант заглушки, когда подпись пустая (картинка —
   * украшение рядом с названием): иначе все заглушки списка одинаковые.
   */
  placeholderSeed?: string;
};

const PLACEHOLDER_VARIANTS = 4;

/** Номер акварельной заглушки (0–3) — стабильный хэш подписи. */
function placeholderVariant(seed: string): number {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + (char.codePointAt(0) ?? 0)) % 9973;
  }
  return hash % PLACEHOLDER_VARIANTS;
}

/**
 * Обложка места: фото (когда есть imageUrl) или акварельная заглушка (когда
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
  placeholderSeed,
}: PlaceImageProps): React.ReactElement {
  const cls = `place-image${className ? ` ${className}` : ""}`;

  if (!url) {
    // Нет фото — акварель в тонкой рамке: ракушка на размывке (рисунок —
    // фоном в CSS, для скринридера это украшение). Вариант выбираем по
    // подписи: у одного места заглушка всегда та же, а соседние в сетке
    // не повторяются подряд.
    return (
      <div
        className={`${cls} place-image-empty place-image-empty-${placeholderVariant(placeholderSeed ?? alt)}`}
        aria-hidden="true"
      />
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

  // Афиша (вертикальная или почти квадратная картинка) — целиком «в рамке»:
  // в широкой обложке от неё оставалась растянутая полоска. Форма известна
  // до загрузки (lib/images/image-shape), поэтому обложка не перестраивается.
  const poster = isPosterShape(url);

  return (
    <div className={`${cls}${poster ? " place-image-poster" : ""}`}>
      {poster ? (
        // размытый фон из той же картинки: маленькая копия (~64px) — крупную
        // второй раз не качаем; для скринридера это украшение
        <Image
          src={url}
          alt=""
          aria-hidden="true"
          fill
          sizes="64px"
          className="place-image-backdrop"
        />
      ) : null}
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
