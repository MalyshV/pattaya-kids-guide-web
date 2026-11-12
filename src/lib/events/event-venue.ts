/**
 * Где проходит событие. У события два источника: своё текстовое поле
 * (площадка + адрес — для афиш «где-то в городе») и место из каталога, к
 * которому оно привязано. Часто заполнено только второе — тогда «Место
 * уточняется» рядом с «Место: Gaya Wellness Studio» противоречит самому себе.
 * Правило одно на всех: своё поле главнее, место из каталога — запасной ответ.
 */

export type EventVenueSource = {
  locationName: string | null;
  address: string | null;
  place: { name: string; address: string } | null;
};

export type EventVenue = {
  name: string | null;
  address: string | null;
};

/** Название площадки и адрес с откатом на место из каталога. */
export function eventVenue(event: EventVenueSource): EventVenue {
  return {
    name: event.locationName ?? event.place?.name ?? null,
    address: event.address ?? event.place?.address ?? null,
  };
}

/**
 * Строка «где» в карточке события — над строкой «Место: …».
 * - место из каталога есть: строка нужна, только если добавляет что-то своё
 *   (зал, адрес), а не повторяет имя места; иначе null — строку не рисуем;
 * - места нет: своё поле или честное «уточняется» (`tbdLabel`).
 */
export function eventCardLocation(
  event: EventVenueSource,
  tbdLabel: string,
): string | null {
  const own = event.locationName ?? event.address;

  if (event.place) {
    return own && own !== event.place.name ? own : null;
  }

  return own ?? tbdLabel;
}
