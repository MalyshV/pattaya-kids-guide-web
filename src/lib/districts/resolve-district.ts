/**
 * Район по координатам — чистые функции без БД. Руками район не проставляется:
 * у мест, событий и занятий координаты уже есть, район из них вычисляется.
 * Точка вне всех районов — «без района» (null), это не ошибка.
 */

/** Вершина границы: [широта, долгота] — в таком порядке, как в Google Maps. */
export type LatLng = readonly [latitude: number, longitude: number];

/**
 * Район в коде: справочные поля (повторяются в БД скриптом заноса) и граница.
 * Граница — многоугольник; замыкать его (повторять первую вершину) не нужно.
 */
export type DistrictDefinition = {
  slug: string;
  name: string;
  nameEn: string;
  nameTh: string;
  /** порядок показа (меньше — раньше) */
  order: number;
  boundary: readonly LatLng[];
};

/**
 * Попадает ли точка в многоугольник (луч вдоль долготы, чётность пересечений).
 * Город — пара десятков километров, поэтому плоская геометрия в градусах
 * честна: кривизна Земли на таком масштабе ничего не сдвигает.
 */
export function isPointInPolygon(
  latitude: number,
  longitude: number,
  polygon: readonly LatLng[],
): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lngI] = polygon[i];
    const [latJ, lngJ] = polygon[j];
    const crosses = latI > latitude !== latJ > latitude;
    if (crosses) {
      const lngAtLatitude = lngJ + ((latitude - latJ) / (latI - latJ)) * (lngI - lngJ);
      if (longitude < lngAtLatitude) {
        inside = !inside;
      }
    }
  }
  return inside;
}

/**
 * Slug района, в который попадает точка; null — вне всех районов или
 * координаты битые. Соседние районы делят общую границу: точка ровно на ней
 * достаётся первому по списку — так результат детерминирован.
 */
export function resolveDistrictSlug(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
  districts: readonly DistrictDefinition[],
): string | null {
  if (
    latitude == null ||
    longitude == null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }
  const match = districts.find((district) =>
    isPointInPolygon(latitude, longitude, district.boundary),
  );
  return match?.slug ?? null;
}
