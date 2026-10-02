import { POSTER_MAX_ASPECT } from "@/lib/images/image-shape";

/**
 * Подходит ли выбранное фото для обложки — тихая оценка в форме админки,
 * ДО сохранения. Правила взяты из того, как сайт реально показывает обложку:
 *  - сервер ужимает фото до 1600 px по длинной стороне и не увеличивает
 *    (lib/admin/upload), поэтому оцениваем кадр уже после этого ужатия;
 *  - картинки с шириной/высотой < POSTER_MAX_ASPECT (lib/images/image-shape)
 *    сайт показывает целиком «в рамке» на размытом фоне — не обрезая;
 *  - остальные идут кадром на всю обложку (16:10 в карточке, 16:7 на странице),
 *    лишнее сверху и снизу обрезается.
 * Это подсказка, а не проверка: сохранение она не блокирует.
 */

export type CoverKind = "place" | "event" | "activity";

export type CoverVerdictStatus = "good" | "narrow" | "small" | "poster" | "cropped";

export type CoverVerdict = {
  status: CoverVerdictStatus;
  /** Готовая строка для формы, начинается с размера кадра. */
  message: string;
};

/** Предел длинной стороны на сервере (= MAX_DIMENSION в lib/admin/upload). */
export const SERVER_MAX_DIMENSION = 1600;
/** Ширина горизонтального кадра, с которой он выглядит чётко (решение Вероники). */
export const COVER_GOOD_WIDTH = 1600;
/** Уже этого — кадр на широком экране заметно мыльный. */
export const COVER_MIN_WIDTH = 1000;
/** Для афиши «в рамке» важна высота: по ней она вписывается в обложку. */
export const POSTER_MIN_HEIGHT = 1000;
/**
 * Горизонтальнее 16:10 (1.6) кадр в карточке почти не режется; до этого
 * порога сверху и снизу пропадает заметная часть (на странице — до 40%).
 */
export const CROP_MAX_ASPECT = 1.5;

/** Размер кадра после серверного ужатия (до 1600 px по длинной стороне, без увеличения). */
export function sizeAfterUpload(
  width: number,
  height: number,
): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= SERVER_MAX_DIMENSION) {
    return { width, height };
  }
  const scale = SERVER_MAX_DIMENSION / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function assessCover(input: {
  width: number;
  height: number;
  kind: CoverKind;
}): CoverVerdict | null {
  if (!(input.width > 0) || !(input.height > 0)) {
    return null;
  }
  const { width, height } = sizeAfterUpload(input.width, input.height);
  const size = `${width}×${height}`;
  const aspect = width / height;

  if (aspect < POSTER_MAX_ASPECT) {
    if (height < POSTER_MIN_HEIGHT) {
      return {
        status: "small",
        message: `${size} — маленький кадр: в рамке он будет мыльным. Лучше взять исходник побольше.`,
      };
    }
    return {
      status: "poster",
      message:
        input.kind === "event"
          ? `${size} — вертикальная афиша: сайт покажет её целиком в рамке, ничего не обрежется.`
          : `${size} — вертикальный кадр: сайт покажет его целиком в рамке на размытом фоне. Горизонтальный смотрелся бы крупнее.`,
    };
  }

  if (width < COVER_MIN_WIDTH) {
    return {
      status: "small",
      message: `${size} — маленький кадр: на сайте будет мыльным. Лучше взять исходник побольше.`,
    };
  }
  if (aspect < CROP_MAX_ASPECT) {
    return {
      status: "cropped",
      message: `${size} — почти квадратный кадр: в обложке обрежутся верх и низ, важное лучше держать в середине.`,
    };
  }
  if (width < COVER_GOOD_WIDTH) {
    return {
      status: "narrow",
      message: `${size} — подходит, но узковат: на большом экране может выглядеть чуть мягко.`,
    };
  }
  return { status: "good", message: `${size} — подходит для обложки.` };
}

/** Постоянная подсказка рядом с полем обложки. */
export function coverHint(kind: CoverKind): string {
  return kind === "event"
    ? "Подходит горизонтальный кадр от 1600 px; вертикальная афиша тоже — сайт покажет её целиком. Оригинал афиши лучше скриншота."
    : "Подходит горизонтальный кадр шириной от 1600 px. Оригинал лучше скриншота из Instagram — тот на сайте выходит мыльным.";
}
