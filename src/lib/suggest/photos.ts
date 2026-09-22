/**
 * Фото в форме «Предложить своё» — общие правила для браузера и сервера.
 *
 * Почему фото ужимаются ещё в браузере: Vercel принимает запрос к функции не
 * больше 4,5 МБ целиком (это до нашего кода, лимит server actions тут не
 * поможет), а один айфонный снимок — 3–7 МБ. Поэтому браузер уменьшает каждое
 * фото до 1600 px и сжимает в JPEG, а сервер ещё раз проверяет и пережимает
 * сам (чужому браузеру не доверяем): так 5 фото с запасом влезают в запрос.
 *
 * Бонус сжатия через canvas: из файла уходят EXIF-метаданные, включая
 * GPS-метку, где сделан снимок (часто — дома у человека).
 */

export const SUGGEST_PHOTOS = {
  /** Столько фото можно приложить к одному предложению. */
  maxCount: 5,
  /** Длинная сторона после сжатия — как у фото, загруженных через админку. */
  maxDimension: 1600,
  /**
   * Потолок одного фото после сжатия: 5 × 700 КБ = 3,5 МБ — с запасом под
   * лимит Vercel 4,5 МБ на весь запрос вместе с текстом формы.
   */
  maxBytes: 700 * 1024,
} as const;

/**
 * Ступени сжатия в браузере: обычное фото укладывается в первую; шумное
 * ночное или очень детальное — в следующие. Последняя (1024 px, 0.65)
 * с запасом меньше потолка для любого снимка.
 */
export const SHRINK_STEPS: ReadonlyArray<{ dimension: number; quality: number }> = [
  { dimension: SUGGEST_PHOTOS.maxDimension, quality: 0.82 },
  { dimension: SUGGEST_PHOTOS.maxDimension, quality: 0.7 },
  { dimension: 1280, quality: 0.7 },
  { dimension: 1024, quality: 0.65 },
];

/** Размер после сжатия: длинная сторона — не больше limit, картинку не увеличиваем. */
export function fitWithin(
  width: number,
  height: number,
  limit: number,
): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= limit || longest <= 0) {
    return { width, height };
  }
  const scale = limit / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export type PhotoProblem = "tooMany" | "tooLarge" | "notImage";

/**
 * Серверная проверка присланных файлов ДО обработки: столько, сколько можно,
 * и уже сжатые. Большой файл значит, что его прислали в обход формы, —
 * такой не разбираем вовсе.
 */
export function checkPhotoFiles(
  files: ReadonlyArray<{ size: number; type: string }>,
): PhotoProblem | null {
  if (files.length > SUGGEST_PHOTOS.maxCount) {
    return "tooMany";
  }
  for (const file of files) {
    if (file.size > SUGGEST_PHOTOS.maxBytes) {
      return "tooLarge";
    }
    if (!file.type.startsWith("image/")) {
      return "notImage";
    }
  }
  return null;
}
