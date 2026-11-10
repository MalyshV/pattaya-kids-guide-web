import {
  resolveDistrictSlug,
  type DistrictDefinition,
  type LatLng,
} from "@/lib/districts/resolve-district";

/**
 * Геометрия для страницы района — чистые функции без карты и базы.
 */

export type GeoPosition = { latitude: number; longitude: number };

/**
 * Вершины границы, лежащие на суше. Прибрежные районы очерчены с запасом в
 * море (береговую линию не рисовали), и эти «морские» вершины в кадр карты
 * брать нельзя: район съёжился бы в угол, а половину экрана заняла бы вода.
 * seaLongitude — долгота морского края города; null — моря у города нет.
 */
export function landVertices(
  boundary: readonly LatLng[],
  seaLongitude: number | null,
): LatLng[] {
  if (seaLongitude === null) {
    return [...boundary];
  }
  return boundary.filter(([, longitude]) => longitude !== seaLongitude);
}

/**
 * Средняя точка набора координат — якорь подписи района на карте. Подпись
 * ставится туда, где в районе есть что смотреть (а не в геометрический центр
 * границы, который у прибрежных районов оказывается в море). Пустой набор —
 * null: подписывать нечего.
 */
export function meanPoint(points: readonly GeoPosition[]): GeoPosition | null {
  if (points.length === 0) {
    return null;
  }
  const sum = points.reduce(
    (acc, point) => ({
      latitude: acc.latitude + point.latitude,
      longitude: acc.longitude + point.longitude,
    }),
    { latitude: 0, longitude: 0 },
  );
  return {
    latitude: sum.latitude / points.length,
    longitude: sum.longitude / points.length,
  };
}

/**
 * Район занятия или события. Когда точка стоит на координатах своего места,
 * район берётся у места — вместе с ручным выбором из админки: иначе студия
 * на границе оказалась бы на странице одного района, а её кружки — соседнего.
 * Своя площадка (placeId не передан) или место не из списка — по координатам.
 *
 * placeDistricts: id места → его район (null — место вне районов).
 */
export function linkedDistrictSlug(input: {
  /** id места, чьи координаты у точки; null/undefined — координаты свои */
  placeId: string | null | undefined;
  placeDistricts: ReadonlyMap<string, string | null>;
  latitude: number;
  longitude: number;
  districts: readonly DistrictDefinition[];
}): string | null {
  const { placeId, placeDistricts, latitude, longitude, districts } = input;
  if (placeId) {
    const fromPlace = placeDistricts.get(placeId);
    if (fromPlace !== undefined) {
      return fromPlace;
    }
  }
  return resolveDistrictSlug(latitude, longitude, districts);
}
