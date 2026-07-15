/**
 * Типы ответа Google Places API (New, v1) — только поля, которые запрашивает
 * наш field mask. Все поля опциональны: Google возвращает ровно то, что
 * запрошено, и не для каждого места данные полны.
 */

/// точка времени в расписании Google: day 0=воскресенье … 6=суббота
export type GoogleOpeningPoint = {
  day: number;
  hour: number;
  minute: number;
};

/// интервал работы; close отсутствует у круглосуточных мест
export type GoogleOpeningPeriod = {
  open: GoogleOpeningPoint;
  close?: GoogleOpeningPoint;
};

export type GoogleOpeningHours = {
  periods?: GoogleOpeningPeriod[];
};

export type GooglePlace = {
  /// канонический Place ID (формат ChIJ…) — наш ключ дедупа
  id?: string;
  displayName?: { text?: string; languageCode?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  regularOpeningHours?: GoogleOpeningHours;
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  /// типы Google (amusement_center, cafe…) — НЕ мапим в наши категории
  /// автоматически, показываем как подсказку модератору
  types?: string[];
};

export type GoogleSearchTextResponse = {
  places?: GooglePlace[];
};
