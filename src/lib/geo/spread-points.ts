/**
 * Раздвигание точек с совпадающими координатами. На единой карте место и его
 * занятия/события стоят в одной точке (занятие «в месте» берёт координаты
 * места) — без этого пины сливаются в одну кляксу. Точки одной координаты
 * раскладываем по кругу малого радиуса вокруг общего центра; одиночные точки
 * не трогаем. Детерминированно (без random) — карта стабильна между рендерами.
 */

/** ~18 м на широте Паттайи: пины видны раздельно, но точка «читается» как одна. */
const SPREAD_RADIUS_DEG = 0.00016;

type Located = { latitude: number; longitude: number };

/** Ключ группировки: округление до ~1 м прячет незначимый разброс координат. */
function coordKey(point: Located): string {
  return `${point.latitude.toFixed(5)},${point.longitude.toFixed(5)}`;
}

export function spreadOverlapping<T extends Located>(points: T[]): T[] {
  const groups = new Map<string, T[]>();
  for (const point of points) {
    const key = coordKey(point);
    const group = groups.get(key);
    if (group) {
      group.push(point);
    } else {
      groups.set(key, [point]);
    }
  }

  const result: T[] = [];
  for (const group of groups.values()) {
    if (group.length === 1) {
      result.push(group[0]);
      continue;
    }
    // общий центр — исходная координата группы; раскладываем по кругу
    const { latitude, longitude } = group[0];
    group.forEach((point, index) => {
      const angle = (2 * Math.PI * index) / group.length;
      result.push({
        ...point,
        latitude: latitude + SPREAD_RADIUS_DEG * Math.cos(angle),
        longitude: longitude + SPREAD_RADIUS_DEG * Math.sin(angle),
      });
    });
  }
  return result;
}
