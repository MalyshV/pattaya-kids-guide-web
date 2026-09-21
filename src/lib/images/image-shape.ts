import imageMeta from "@/lib/images/image-meta.json";

/**
 * Форма картинки — чтобы решить, как её показать в обложке, ДО загрузки.
 *
 * Афиши и флаеры обычно вертикальные или почти квадратные: в широкой рамке
 * обложки (16:10 в карточке, 16:7 на странице) от них оставалась узкая
 * полоска, растянутая в 1.5–3 раза, — мыло и обрезанный текст. Такие картинки
 * показываем целиком «в рамке» (на размытом фоне той же картинки), а
 * горизонтальные фото — как раньше, кадром на всю обложку (решение Вероники
 * 21.09: автоматически по форме).
 *
 * Где берём размеры: файлы из public/ — справочник image-meta.json (строится
 * скриптом npm run images:meta перед сборкой); загруженные через админку —
 * из имени файла, куда upload.ts дописывает «-ШxВ». Неизвестно — считаем
 * фото (как было до рамки).
 */

/** Ширина/высота меньше этого — «афиша»: показываем целиком. 4:3 фото (1.33) — нет. */
export const POSTER_MAX_ASPECT = 1.2;

// JSON типизируется как number[] — пара «ширина, высота» по контракту скрипта
const META: Record<string, readonly number[]> = imageMeta;

// «…-739x925.jpg» (+ возможный ?query) — размеры, записанные при загрузке
const SIZE_IN_NAME = /-(\d{2,5})x(\d{2,5})\.(?:jpe?g|png|webp|avif)(?:\?.*)?$/i;

export function imageAspect(url: string | null | undefined): number | null {
  if (!url) {
    return null;
  }
  const known = META[url];
  if (known && known.length === 2 && known[1] > 0) {
    return known[0] / known[1];
  }
  const match = SIZE_IN_NAME.exec(url);
  if (match) {
    const width = Number(match[1]);
    const height = Number(match[2]);
    return height > 0 ? width / height : null;
  }
  return null;
}

/** Вертикальная или почти квадратная картинка — показываем целиком. */
export function isPosterShape(url: string | null | undefined): boolean {
  const aspect = imageAspect(url);
  return aspect !== null && aspect < POSTER_MAX_ASPECT;
}
