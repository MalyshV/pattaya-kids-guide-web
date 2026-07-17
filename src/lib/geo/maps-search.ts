/**
 * Ссылка «найти адрес на Google Maps» для сущностей без проверенной карточки
 * места (события, занятия в садах): текстовый адрес — не мёртвая строка,
 * а путь построить маршрут. У мест приоритетнее ручной googleMapsUrl.
 */
export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
