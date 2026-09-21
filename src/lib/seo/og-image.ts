import sharp from "sharp";
import { POSTER_MAX_ASPECT } from "@/lib/images/image-shape";

/**
 * Картинка превью 1200×630 — что видит родитель, когда ссылку пересылают в
 * Telegram/WhatsApp/Facebook. Собирается из фото страницы:
 *  - горизонтальное фото — кадр 1.91:1 по самому «интересному» месту
 *    (sharp attention), а не тупо по центру;
 *  - афиша (вертикальная или почти квадратная) — целиком по центру на
 *    размытом фоне той же картинки, как на сайте (иначе Facebook/X срезали бы
 *    верх и низ с названием и ценой);
 *  - JPEG ~100–150 КБ: WhatsApp надёжно показывает большую картинку только
 *    у лёгких файлов.
 */

import { OG_HEIGHT, OG_WIDTH } from "@/lib/seo/og-image-path";

export { OG_HEIGHT, OG_WIDTH, ogImagePath } from "@/lib/seo/og-image-path";

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/**
 * Откуда можно брать исходник: только наши картинки — из public/images
 * (тот же сайт) и из нашего Vercel Blob. Иначе null — адрес /og/image не
 * должен превращаться в прокси для чужих картинок.
 */
export function resolveOgSource(src: string | null, origin: string): string | null {
  if (!src) {
    return null;
  }
  if (src.startsWith("/images/") && !src.includes("..") && !src.includes("//")) {
    return `${origin}${src}`;
  }
  try {
    const url = new URL(src);
    if (url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX)) {
      return url.toString();
    }
  } catch {
    // не URL — не наша картинка
  }
  return null;
}

export async function renderOgImage(input: Buffer): Promise<Buffer> {
  // rotate() — по EXIF: айфонные фото иначе легли бы на бок
  const { data: oriented, info } = await sharp(input)
    .rotate()
    .toBuffer({ resolveWithObject: true });
  const poster = info.width / info.height < POSTER_MAX_ASPECT;

  if (!poster) {
    return sharp(oriented)
      .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
  }

  const backdrop = await sharp(oriented)
    .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover" })
    .blur(28)
    .modulate({ brightness: 1.04, saturation: 0.75 })
    .toBuffer();
  // тёплая вуаль поверх размытого фона — как opacity .6 на беже сайта
  const veil = await sharp({
    create: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      channels: 4,
      background: { r: 246, g: 243, b: 238, alpha: 0.4 },
    },
  })
    .png()
    .toBuffer();
  const poster_ = await sharp(oriented)
    .resize(OG_WIDTH, OG_HEIGHT, { fit: "inside" })
    .toBuffer();

  return sharp(backdrop)
    .composite([{ input: veil }, { input: poster_, gravity: "center" }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}
