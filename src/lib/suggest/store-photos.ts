import "server-only";

import { randomBytes } from "node:crypto";
import { removeStoredImage, storeImageBuffer } from "@/lib/admin/upload";
import { processPhoto } from "@/lib/suggest/process-photo";

/**
 * Сохранение фото из формы «Предложить своё».
 *
 * Фото до одобрения видит только админка: имя файла — случайные 128 бит,
 * адрес не угадать и не перебрать, а показываем его только на странице
 * предложения в /admin. Имя пользовательского файла не берём — в нём бывает
 * имя ребёнка или человека.
 *
 * Всё или ничего: сначала разбираем все фото, потом кладём; если хоть одно не
 * легло — удаляем уже положенные, чтобы не копить в хранилище сирот.
 */

const FOLDER = "suggestions";

export class SubmissionPhotoError extends Error {}

export async function storeSubmissionPhotos(files: readonly File[]): Promise<string[]> {
  const processed = [];
  for (const file of files) {
    try {
      processed.push(await processPhoto(Buffer.from(await file.arrayBuffer())));
    } catch (error) {
      throw new SubmissionPhotoError("process", { cause: error });
    }
  }

  const stored: string[] = [];
  try {
    for (const photo of processed) {
      // размеры в имени — по ним сайт знает форму картинки (lib/images/image-shape)
      const fileName = `${randomBytes(16).toString("hex")}-${photo.width}x${photo.height}.jpg`;
      stored.push(await storeImageBuffer(FOLDER, fileName, photo.data));
    }
  } catch (error) {
    await removeSubmissionPhotos(stored);
    throw new SubmissionPhotoError("store", { cause: error });
  }
  return stored;
}

/** Убрать файлы (не легло предложение, отклонили фото). Ошибки не страшны — останется сирота. */
export async function removeSubmissionPhotos(urls: readonly string[]): Promise<void> {
  await Promise.all(urls.map((url) => removeStoredImage(url).catch(() => undefined)));
}
