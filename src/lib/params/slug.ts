import { invalidParam } from "@/lib/errors";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseSlugParam(value: string): string {
  const slug = value.trim();

  if (!slug) {
    throw invalidParam("slug");
  }

  if (!SLUG_PATTERN.test(slug)) {
    throw invalidParam("slug");
  }

  return slug;
}
