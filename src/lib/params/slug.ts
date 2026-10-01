import { invalidParam } from "@/lib/errors";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Slug из URL (путь или query): trim + строгий формат `a-z0-9` через дефис.
 *  paramName — имя параметра в ошибке 400 (по умолчанию «slug»). */
export function parseSlugParam(value: string, paramName = "slug"): string {
  const slug = value.trim();

  if (!slug) {
    throw invalidParam(paramName);
  }

  if (!SLUG_PATTERN.test(slug)) {
    throw invalidParam(paramName);
  }

  return slug;
}
