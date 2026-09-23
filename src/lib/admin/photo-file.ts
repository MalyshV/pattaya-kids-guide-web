/**
 * Фото из форм админки: что браузер делает с файлом до отправки.
 *
 * Vercel принимает запрос к функции не больше 4,5 МБ целиком — это до нашего
 * кода, лимит server actions в next.config тут не поможет. Айфонный снимок —
 * 3–7 МБ, и форма с ним падала бы ошибкой 413. Поэтому большое фото браузер
 * сам уменьшает (тем же сжатием, что и форма «Предложить своё» —
 * lib/suggest/shrink-photo), а сервер, как и раньше, пережимает его sharp'ом.
 */

/**
 * Такой файл уходит как есть: с запасом влезает в лимит запроса, а сервер
 * сожмёт его один раз — без двойной потери качества.
 */
export const PHOTO_AS_IS_MAX_BYTES = 3 * 1024 * 1024;

/**
 * Форматы, которые сервер точно откроет сам. HEIC сюда не входит: его
 * переводит в JPEG браузер (Safari умеет).
 */
const SERVER_READABLE_TYPES: ReadonlySet<string> = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/** Надо ли уменьшать фото в браузере перед отправкой формы. */
export function needsBrowserShrink(file: { size: number; type: string }): boolean {
  return file.size > PHOTO_AS_IS_MAX_BYTES || !SERVER_READABLE_TYPES.has(file.type);
}

/** Имя уменьшенного файла: прежнее, но .jpg — из него сервер строит имя в хранилище. */
export function jpegFileName(name: string): string {
  const base = name.replace(/\.[^.]*$/, "");
  return `${base || "photo"}.jpg`;
}
