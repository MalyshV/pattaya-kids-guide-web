import { SUGGEST_PHOTOS } from "@/lib/suggest/photos";

/**
 * Серверная обработка фото из формы «Предложить своё»: браузеру не доверяем,
 * поэтому каждое фото заново разбираем и пережимаем. Это же и проверка, что
 * прислали действительно картинку, а не что-то под видом image/jpeg.
 *
 * Метаданные не переносим (у sharp это поведение по умолчанию): EXIF с
 * GPS-меткой, моделью телефона и датой в сохранённый файл не попадает, даже
 * если браузер их не убрал.
 */

/**
 * Честная картинка из формы уже не больше 1600×1600 (2,6 Мп). Потолок с
 * запасом, но далеко от дефолта sharp (268 Мп): крошечный PNG может обещать
 * 20000×20000 пикселей и при разборе съесть гигабайт памяти функции.
 */
export const MAX_INPUT_PIXELS = 4096 * 4096;
const JPEG_QUALITY = 82;

export class PhotoProcessError extends Error {}

export type ProcessedPhoto = { data: Buffer; width: number; height: number };

export async function processPhoto(input: Buffer): Promise<ProcessedPhoto> {
  let sharp: typeof import("sharp").default;
  try {
    // лениво, как в админке: если нативная часть sharp не поднимется,
    // упадёт одна отправка с фото, а не вся страница формы
    sharp = (await import("sharp")).default;
  } catch {
    throw new PhotoProcessError("sharp unavailable");
  }
  try {
    const { data, info } = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS })
      // по EXIF-ориентации — на случай, если браузер снимок не повернул
      .rotate()
      .resize(SUGGEST_PHOTOS.maxDimension, SUGGEST_PHOTOS.maxDimension, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: JPEG_QUALITY })
      .toBuffer({ resolveWithObject: true });
    return { data, width: info.width, height: info.height };
  } catch {
    throw new PhotoProcessError("not an image");
  }
}
