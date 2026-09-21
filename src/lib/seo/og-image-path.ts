/**
 * Размер и адрес картинки превью 1200×630 — лёгкий модуль без sharp: его
 * читают мета-теги страниц; саму картинку собирает lib/seo/og-image (сервер).
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Адрес картинки превью для фото страницы (относительный — Next абсолютизирует). */
export function ogImagePath(imageUrl: string): string {
  return `/og/image?src=${encodeURIComponent(imageUrl)}`;
}
