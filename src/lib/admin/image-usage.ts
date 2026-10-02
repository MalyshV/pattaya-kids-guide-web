import "server-only";

import { prisma } from "@/db/prisma";
import { removeStoredImage } from "@/lib/admin/upload";

/**
 * Используется ли адрес картинки где-то ещё: в галереях мест, обложках
 * мест, событий и занятий, фото предложений. Нужно перед удалением файла
 * из хранилища — один и тот же файл может стоять сразу в нескольких местах
 * (например, фото из дополнения скопировано в галерею, а предложение
 * по-прежнему на него ссылается).
 * Вызывать после удаления своей записи: она в счёт не идёт.
 */
export async function isImageUrlInUse(url: string): Promise<boolean> {
  const [photos, places, events, programs, submissions] = await Promise.all([
    prisma.placePhoto.count({ where: { url } }),
    prisma.place.count({ where: { imageUrl: url } }),
    prisma.event.count({ where: { imageUrl: url } }),
    prisma.placeProgram.count({ where: { imageUrl: url } }),
    prisma.submission.count({ where: { photoUrls: { has: url } } }),
  ]);
  return photos + places + events + programs + submissions > 0;
}

/**
 * Убрать файл картинки после удаления записи, которая на него ссылалась
 * (фото галереи, событие, занятие). Общий файл — адрес стоит ещё где-то —
 * не трогаем. Сбой не роняет действие: запись уже удалена, лишний файл
 * безвреден — только пишем в лог.
 */
export async function removeImageIfUnused(
  url: string | null | undefined,
  what: string,
): Promise<void> {
  if (!url) {
    return;
  }
  try {
    if (!(await isImageUrlInUse(url))) {
      await removeStoredImage(url);
    }
  } catch (error) {
    console.error(`admin: файл не удалён (${what})`, url, error);
  }
}
