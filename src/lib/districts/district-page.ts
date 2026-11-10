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

/** Место, как оно приходит вместе с занятием или событием. */
type LinkedPlace = { id: string; latitude: number; longitude: number };

/**
 * Район занятия. Координаты — как у точки карты: сначала место, при котором
 * оно проходит, иначе своя площадка; без координат района нет.
 */
export function activityDistrictSlug(
  activity: {
    place?: LinkedPlace | null;
    venueLatitude?: number | null;
    venueLongitude?: number | null;
  },
  placeDistricts: ReadonlyMap<string, string | null>,
  districts: readonly DistrictDefinition[],
): string | null {
  const latitude = activity.place?.latitude ?? activity.venueLatitude ?? null;
  const longitude = activity.place?.longitude ?? activity.venueLongitude ?? null;
  if (latitude == null || longitude == null) {
    return null;
  }
  return linkedDistrictSlug({
    placeId: activity.place?.id,
    placeDistricts,
    latitude,
    longitude,
    districts,
  });
}

/**
 * Район события. Свои координаты (проходит не в самом месте) важнее места:
 * тогда район считается по ним, а не наследуется.
 */
export function eventDistrictSlug(
  event: {
    latitude?: number | null;
    longitude?: number | null;
    place?: LinkedPlace | null;
  },
  placeDistricts: ReadonlyMap<string, string | null>,
  districts: readonly DistrictDefinition[],
): string | null {
  const ownCoordinates = event.latitude != null && event.longitude != null;
  const latitude = event.latitude ?? event.place?.latitude ?? null;
  const longitude = event.longitude ?? event.place?.longitude ?? null;
  if (latitude == null || longitude == null) {
    return null;
  }
  return linkedDistrictSlug({
    placeId: ownCoordinates ? null : event.place?.id,
    placeDistricts,
    latitude,
    longitude,
    districts,
  });
}
