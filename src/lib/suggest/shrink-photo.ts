import { SHRINK_STEPS, SUGGEST_PHOTOS, fitWithin } from "@/lib/suggest/photos";

/**
 * Сжатие фото в браузере перед отправкой (зачем — см. lib/suggest/photos).
 *
 * Картинку открываем через <img>, а не createImageBitmap: так все браузеры
 * одинаково поворачивают снимок по EXIF (айфонное фото не ляжет на бок), и
 * Safari заодно откроет HEIC. Файл, который браузер открыть не может (HEIC в
 * Chrome, битый файл, не картинка), — ошибка: форма спокойно об этом скажет.
 */

export class PhotoReadError extends Error {}

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    if (image.naturalWidth === 0 || image.naturalHeight === 0) {
      throw new PhotoReadError("empty image");
    }
    return image;
  } catch {
    throw new PhotoReadError("cannot decode");
  } finally {
    // decode() уже прочитал файл — ссылка больше не нужна
    URL.revokeObjectURL(url);
  }
}

function toJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

export async function shrinkPhoto(file: File): Promise<Blob> {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new PhotoReadError("no canvas");
  }

  try {
    return await shrinkOnCanvas(image, canvas, context);
  } finally {
    // холст до 10 МБ — отдаём память сразу, не дожидаясь сборщика
    canvas.width = 0;
    canvas.height = 0;
  }
}

async function shrinkOnCanvas(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
): Promise<Blob> {
  for (const step of SHRINK_STEPS) {
    const size = fitWithin(image.naturalWidth, image.naturalHeight, step.dimension);
    canvas.width = size.width;
    canvas.height = size.height;
    // смена размера сбрасывает настройки контекста — ставим каждый раз;
    // «high» — без лесенок при уменьшении в 3–5 раз
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    // прозрачный PNG в JPEG иначе стал бы чёрным
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size.width, size.height);
    context.drawImage(image, 0, 0, size.width, size.height);
    const blob = await toJpeg(canvas, step.quality);
    if (blob && blob.size <= SUGGEST_PHOTOS.maxBytes) {
      return blob;
    }
  }
  throw new PhotoReadError("still too large");
}
