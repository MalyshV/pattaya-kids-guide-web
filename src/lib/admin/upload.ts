import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

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

/**
 * sharp грузим только в момент загрузки фото, а не при открытии админки:
 * если его нативная часть на сервере не поднимется, упадёт одна загрузка
 * (спокойной ошибкой формы), а вход, правки и «Обновить кэш» останутся
 * рабочими. Так было 22.09: из-за потерянного libvips лежала вся админка.
 */
async function loadSharp(): Promise<typeof import("sharp").default> {
  try {
    return (await import("sharp")).default;
  } catch {
    throw new UploadError("Обработка фото на сервере сейчас недоступна");
  }
}

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
  // контракт: folder — только наши константы ("places"/"events"/"activities"),
  // никогда пользовательский ввод; проверка — страховка контракта
  if (!/^[a-z-]+$/.test(folder)) {
    throw new Error(`uploadImage: недопустимая папка "${folder}"`);
  }
  if (!file.type.startsWith("image/")) {
    throw new UploadError("Файл не похож на изображение");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError("Файл больше 12 МБ — выберите фото поменьше");
  }

  const sharp = await loadSharp();
  const original = Buffer.from(await file.arrayBuffer());
  let resized: Buffer;
  try {
    resized = await sharp(original)
      // без rotate() айфонные фото легли бы на бок (EXIF-ориентация)
      .rotate()
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY })
      .toBuffer();
  } catch {
    // битый файл или не-картинка с поддельным type — спокойная ошибка, не 500
    throw new UploadError("Не получилось обработать файл как изображение");
  }

  // размеры в имени файла: по ним сайт заранее знает форму картинки и
  // показывает афиши целиком «в рамке», а фото — кадром (lib/images/image-shape)
  const { width, height } = await sharp(resized).metadata();
  const fileName = `${Date.now()}-${safeBaseName(file.name)}-${width}x${height}.jpg`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`${folder}/${fileName}`, resized, {
        access: "public",
        contentType: "image/jpeg",
      });
      return blob.url;
    } catch {
      // сеть/протухший токен — спокойная ошибка формы, не 500
      throw new UploadError(
        "Хранилище не приняло файл — попробуйте ещё раз или проверьте Blob-токен",
      );
    }
  }

  // На Vercel файловая система read-only: без Blob-токена честно объясняем,
  // что настроить, вместо невнятного EROFS-краха
  if (process.env.VERCEL) {
    throw new UploadError(
      "На проде не подключено Blob-хранилище (BLOB_READ_WRITE_TOKEN) — см. docs/ADMIN.md",
    );
  }

  const dir = path.join(process.cwd(), "public", "images", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), resized);
  return `/images/uploads/${folder}/${fileName}`;
}
