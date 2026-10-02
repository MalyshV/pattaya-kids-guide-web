/**
 * Фото, которое лежит в самом сайте (папка public): /images/places/x.jpg.
 * Такие файлы админка читает, чтобы повернуть (lib/admin/rotate-photo), —
 * поэтому адрес проверяем строго: только картинки из /images/, без выхода
 * наверх и без чужих хостов.
 */
const SITE_IMAGE = /^\/images\/[a-zA-Z0-9/_.-]+\.(?:jpe?g|png|webp)$/;

export function isSiteImagePath(url: string): boolean {
  return SITE_IMAGE.test(url) && !url.includes("..") && !url.includes("//");
}

/** Имя повёрнутого файла: случайное + размеры (по ним сайт знает форму картинки). */
export function rotatedFileName(
  randomHex: string,
  width: number,
  height: number,
): string {
  return `${randomHex}-${width}x${height}.jpg`;
}
