import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import sharp from "sharp";

/**
 * Загрузка фото из админки. Куда кладём:
 *  - на Vercel файловая система read-only → в Vercel Blob (нужен
 *    BLOB_READ_WRITE_TOKEN — появляется автоматически после подключения
 *    Blob-хранилища к проекту в дашборде Vercel);
 *  - локально без токена — в public/images/uploads/ (файл попадёт в git
 *    при коммите, как и остальные тестовые фото).
 * Перед сохранением фото ужимается до 1600px по длинной стороне (jpeg q82) —
 * айфонные оригиналы по 3–7 МБ сайту не нужны.
 */

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 82;

export class UploadError extends Error {}

function safeBaseName(fileName: string): string {
  const base = fileName.replace(/\.[^.]*$/, "");
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "photo";
}

/** Сжать и сохранить; вернуть URL для imageUrl/PlacePhoto.url. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new UploadError("Файл не похож на изображение");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError("Файл больше 12 МБ — выберите фото поменьше");
  }

  const original = Buffer.from(await file.arrayBuffer());
  const resized = await sharp(original)
    // без rotate() айфонные фото легли бы на бок (EXIF-ориентация)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();

  const fileName = `${Date.now()}-${safeBaseName(file.name)}.jpg`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${folder}/${fileName}`, resized, {
      access: "public",
      contentType: "image/jpeg",
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public", "images", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), resized);
  return `/images/uploads/${folder}/${fileName}`;
}
