/**
 * «Что рядом со мной»: расстояния по прямой (хаверсин) и их формат.
 * Чистые функции без БД: геопозиция пользователя не покидает браузер —
 * и вычисление, и сортировка происходят на клиенте.
 */

export type GeoPoint = { latitude: number; longitude: number };

const EARTH_RADIUS_M = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Расстояние по прямой между двумя точками, в метрах. */
export function haversineMeters(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const h =
    sinLat * sinLat +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * sinLng * sinLng;

  // float может дать h чуть больше 1 (почти антиподы) → asin вернул бы NaN
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(Math.min(1, h)));
}

/**
 * «≈ 800 м» / «≈ 1,2 км» (en: “≈ 800 m” / “≈ 1.2 km”).
 * До километра округляем до 50 м — точнее по прямой всё равно нечестно;
 * дальше 10 км десятые не показываем.
 */
export function formatDistance(meters: number, lang: string): string {
  const unitM = lang === "en" ? "m" : "м";
  const unitKm = lang === "en" ? "km" : "км";
  const decimalSeparator = lang === "en" ? "." : ",";

  if (meters < 975) {
    const rounded = Math.max(50, Math.round(meters / 50) * 50);
    return `≈ ${rounded} ${unitM}`;
  }

  const km = meters / 1000;
  if (km >= 9.95) {
    return `≈ ${Math.round(km)} ${unitKm}`;
  }

  const rounded = (Math.round(km * 10) / 10).toFixed(1).replace(".", decimalSeparator);
  return `≈ ${rounded} ${unitKm}`;
}

export type WithDistance<T> = {
  item: T;
  /** null = у места нет координат; такие уходят в конец списка */
  distanceM: number | null;
};

/**
 * Сортировка по близости к origin. Элементы без координат честно уходят
 * в конец, сохраняя исходный порядок между собой (стабильная сортировка).
 */
export function sortByDistance<T>(
  items: T[],
  origin: GeoPoint,
  getPoint: (item: T) => GeoPoint | null,
): Array<WithDistance<T>> {
  return items
    .map((item) => {
      const point = getPoint(item);
      const valid =
        point !== null &&
        Number.isFinite(point.latitude) &&
        Number.isFinite(point.longitude);

      return {
        item,
        distanceM: valid ? haversineMeters(origin, point) : null,
      };
    })
    .sort((a, b) => {
      if (a.distanceM === null && b.distanceM === null) return 0;
      if (a.distanceM === null) return 1;
      if (b.distanceM === null) return -1;
      return a.distanceM - b.distanceM;
    });
}
