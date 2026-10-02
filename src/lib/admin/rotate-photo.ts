import "server-only";

import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { isSiteImagePath, rotatedFileName } from "@/lib/admin/photo-path";
import { UploadError, removeStoredImage, storeImageBuffer } from "@/lib/admin/upload";

/**
 * Поворот уже сохранённого фото на 90° (кнопки ↺ и ↻ в админке): снимок лёг
 * на бок — нажали, и он встал как надо. Обе стороны — потому что у людей и
 * программ нет единой привычки, куда крутит «повернуть».
 *
 * Файл не правим на месте: кладём повёрнутую копию под новым именем (в имени
 * — новые размеры, по ним сайт знает форму картинки; новый адрес заодно
 * обходит кэш браузера), а прежний файл убираем — это та же картинка, только
 * боком.
 */

const BLOB_HOST = /\.public\.blob\.vercel-storage\.com$/;
const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
/** выше, чем при загрузке (82): поворот пережимает уже сжатый JPEG ещё раз */
const JPEG_QUALITY = 90;

async function fetchImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new UploadError(`Фото не открылось (${response.status})`);
  }
  const data = Buffer.from(await response.arrayBuffer());
  if (data.length === 0 || data.length > MAX_SOURCE_BYTES) {
    throw new UploadError("Файл фото пустой или слишком большой");
  }
  return data;
}

/**
 * Прочитать наше фото: из Blob — по адресу; из папки сайта — с диска
 * (локально) или, если на диске функции его нет (Vercel раздаёт public
 * отдельно), запросом к самому сайту.
 */
async function readStoredImage(url: string, siteOrigin: string): Promise<Buffer> {
  if (isSiteImagePath(url)) {
    try {
      return await readFile(path.join(process.cwd(), "public", url));
    } catch {
      return fetchImage(`${siteOrigin}${url}`);
    }
  }
  let host = "";
  try {
    const parsed = new URL(url);
    host = parsed.protocol === "https:" ? parsed.hostname : "";
  } catch {
    host = "";
  }
  if (!BLOB_HOST.test(host)) {
    throw new UploadError(`Не наш адрес фото: ${url}`);
  }
  return fetchImage(url);
}

/** Повернуть фото и вернуть адрес новой копии (прежний файл удаляет вызывающий). */
export async function rotateStoredImage(
  url: string,
  folder: string,
  siteOrigin: string,
  /** по часовой (right) или против (left) */
  direction: "left" | "right",
): Promise<string> {
  const source = await readStoredImage(url, siteOrigin);
  let sharp: typeof import("sharp").default;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    throw new UploadError("Обработка фото на сервере сейчас недоступна");
  }
  let rotated: Buffer;
  let width: number | undefined;
  let height: number | undefined;
  try {
    // первый rotate() учитывает EXIF-ориентацию, второй — наш поворот
    rotated = await sharp(source)
      .rotate()
      .rotate(direction === "left" ? 270 : 90)
      .jpeg({ quality: JPEG_QUALITY })
      .toBuffer();
    ({ width, height } = await sharp(rotated).metadata());
  } catch {
    throw new UploadError("Не получилось обработать файл как изображение");
  }
  if (!width || !height) {
    throw new UploadError("Не получилось обработать файл как изображение");
  }
  return storeImageBuffer(
    folder,
    rotatedFileName(randomBytes(16).toString("hex"), width, height),
    rotated,
  );
}

/** Прежний файл после поворота: не удалился — не беда, лишний файл безвреден. */
export async function dropOldImage(url: string): Promise<void> {
  await removeStoredImage(url).catch((error: unknown) =>
    console.error("admin: прежний файл после поворота не удалён", url, error),
  );
}
