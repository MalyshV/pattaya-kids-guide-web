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
 * небольшим запасом, далеко от дефолта sharp (268 Мп): крошечный файл может
 * обещать 20000×20000 пикселей и при разборе съесть гигабайт памяти функции.
 */
export const MAX_INPUT_PIXELS = 2048 * 2048;
const JPEG_QUALITY = 82;
/** Живой снимок пережимается за доли секунды; дольше — это не фото, а атака. */
export const PROCESS_TIMEOUT_SECONDS = 5;

export class PhotoProcessError extends Error {}

export type ProcessedPhoto = { data: Buffer; width: number; height: number };

/** Начало любого JPEG: FF D8 FF. */
function looksLikeJpeg(input: Buffer): boolean {
  return input.length > 3 && input[0] === 0xff && input[1] === 0xd8 && input[2] === 0xff;
}

export async function processPhoto(input: Buffer): Promise<ProcessedPhoto> {
  // Только JPEG: форма всегда шлёт JPEG из canvas, а остальные форматы, что
  // умеет sharp, опасны на открытой форме — например, SVG в пару КБ может
  // рисоваться минутами и держать функцию (проверено ревью 22.09)
  if (!looksLikeJpeg(input)) {
    throw new PhotoProcessError("not a jpeg");
  }
  let sharp: typeof import("sharp").default;
  try {
    // лениво, как в админке: если нативная часть sharp не поднимется,
    // упадёт одна отправка с фото, а не вся страница формы
    sharp = (await import("sharp")).default;
  } catch (error) {
    throw new PhotoProcessError("sharp unavailable", { cause: error });
  }
  try {
    const image = sharp(input, { limitInputPixels: MAX_INPUT_PIXELS });
    const meta = await image.metadata();
    if (meta.format !== "jpeg") {
      throw new Error(`format ${meta.format}`);
    }
    const { data, info } = await image
      // по EXIF-ориентации — на случай, если браузер снимок не повернул
      .rotate()
      .resize(SUGGEST_PHOTOS.maxDimension, SUGGEST_PHOTOS.maxDimension, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: JPEG_QUALITY })
      .timeout({ seconds: PROCESS_TIMEOUT_SECONDS })
      .toBuffer({ resolveWithObject: true });
    return { data, width: info.width, height: info.height };
  } catch (error) {
    throw new PhotoProcessError("not an image", { cause: error });
  }
}
