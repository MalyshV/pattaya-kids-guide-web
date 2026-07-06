/** Целевая длина meta description (рекомендация поисковиков ~150–160). */
const META_DESCRIPTION_MAX = 160;

/**
 * Описание для <meta name="description">: берёт текст сущности, обрезает по
 * границе слова с многоточием; без текста — отдаёт запасной вариант.
 */
export function metaDescription(
  text: string | null | undefined,
  fallback: string,
): string {
  const source = text?.trim();

  if (!source) {
    return fallback;
  }

  if (source.length <= META_DESCRIPTION_MAX) {
    return source;
  }

  const cut = source.slice(0, META_DESCRIPTION_MAX);
  const lastSpace = cut.lastIndexOf(" ");

  return `${cut.slice(0, lastSpace > META_DESCRIPTION_MAX / 2 ? lastSpace : META_DESCRIPTION_MAX)}…`;
}
