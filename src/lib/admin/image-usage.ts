import "server-only";

import { prisma } from "@/db/prisma";

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
