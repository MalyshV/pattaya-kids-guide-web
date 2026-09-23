import "server-only";

import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { copy } from "@vercel/blob";
import { UploadError, storeImageBuffer } from "@/lib/admin/upload";

/**
 * Копия уже сохранённого фото в другую папку хранилища.
 *
 * Зачем копия, а не та же ссылка: фото предложения можно удалить кнопкой в
 * админке (и удаляется сам файл). Если бы карточка ссылалась на тот же файл,
 * обложка места превратилась бы в пустоту. Копия делает карточку независимой.
 *
 * В Blob копирование делает сам сервер хранилища (не качаем файл к себе);
 * локально — обычное чтение файла из public/images/uploads.
 */

const LOCAL_UPLOADS_URL = "/images/uploads/";
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), "public", "images", "uploads");
const BLOB_HOST = /\.public\.blob\.vercel-storage\.com$/;
/** «…-1067x1600.jpg» — размеры в имени, по ним сайт знает форму картинки */
const SIZE_IN_NAME = /-(\d{2,5}x\d{2,5})\.jpg$/i;

function newFileName(sourceUrl: string): string {
  const size = SIZE_IN_NAME.exec(sourceUrl.split("?")[0] ?? "");
  return `${randomBytes(16).toString("hex")}${size ? `-${size[1]}` : ""}.jpg`;
}

export async function copyStoredImage(url: string, folder: string): Promise<string> {
  if (!/^[a-z-]+$/.test(folder)) {
    throw new Error(`copyStoredImage: недопустимая папка "${folder}"`);
  }
  const fileName = newFileName(url);

  if (url.startsWith(LOCAL_UPLOADS_URL)) {
    const file = path.resolve(LOCAL_UPLOADS_DIR, url.slice(LOCAL_UPLOADS_URL.length));
    if (!file.startsWith(LOCAL_UPLOADS_DIR + path.sep)) {
      throw new UploadError(`Файл вне папки загрузок: ${url}`);
    }
    return storeImageBuffer(folder, fileName, await readFile(file));
  }

  let host = "";
  try {
    const parsed = new URL(url);
    host = parsed.protocol === "https:" ? parsed.hostname : "";
  } catch {
    throw new UploadError(`Не наш адрес фото: ${url}`);
  }
  if (!BLOB_HOST.test(host)) {
    throw new UploadError(`Не наш адрес фото: ${url}`);
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new UploadError("Нет BLOB_READ_WRITE_TOKEN — фото не скопировать");
  }
  const blob = await copy(url, `${folder}/${fileName}`, { access: "public" });
  return blob.url;
}
