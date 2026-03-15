import { InvalidQueryParamError } from "@/lib/errors";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseSlugParam(value: string): string {
  const slug: string = value.trim();

  if (!slug) {
    throw new InvalidQueryParamError("Invalid slug parameter");
  }

  if (!SLUG_PATTERN.test(slug)) {
    throw new InvalidQueryParamError("Invalid slug parameter");
  }

  return slug;
}
