import { haversineMeters } from "../geo/distance";

/** Ближе этого расстояния и с похожим названием — вероятный дубль. */
export const DUPLICATE_RADIUS_M = 150;

export type DraftIdentity = {
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string | null;
};

export type DuplicateReason = "slug" | "maps-url" | "name-and-distance";

/** Название для сравнения: без регистра, знаков и пробелов. */
export function normalizeName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "");
}

/**
 * Совпадает ли кандидат с кем-то из уже существующих мест. «Дубль страшнее
 * потери»: при сомнении — не писать, а показать человеку.
 * Три сигнала: тот же slug, та же ссылка на карточку карты, либо похожее
 * название (одно содержит другое) в пределах DUPLICATE_RADIUS_M.
 */
export function findDuplicate(
  candidate: DraftIdentity,
  existing: readonly DraftIdentity[],
): { reason: DuplicateReason; with: DraftIdentity } | null {
  const candidateName = normalizeName(candidate.name);
  for (const place of existing) {
    if (place.slug === candidate.slug) {
      return { reason: "slug", with: place };
    }
    if (
      candidate.googleMapsUrl &&
      place.googleMapsUrl &&
      candidate.googleMapsUrl === place.googleMapsUrl
    ) {
      return { reason: "maps-url", with: place };
    }
    const placeName = normalizeName(place.name);
    const similar =
      candidateName.length > 0 &&
      placeName.length > 0 &&
      (candidateName.includes(placeName) || placeName.includes(candidateName));
    if (similar) {
      const meters = haversineMeters(
        { latitude: candidate.latitude, longitude: candidate.longitude },
        { latitude: place.latitude, longitude: place.longitude },
      );
      if (meters < DUPLICATE_RADIUS_M) {
        return { reason: "name-and-distance", with: place };
      }
    }
  }
  return null;
}
