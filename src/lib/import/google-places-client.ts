/**
 * Тонкий клиент Google Places API (New, v1) поверх fetch — без зависимостей.
 * Ключ читается из GOOGLE_PLACES_API_KEY (как получить — docs/DATA_ENGINE.md).
 * Field mask держим минимальным: платим только за поля скелета.
 */

import type { GooglePlace, GoogleSearchTextResponse } from "./google-places-types";

const PLACES_API_BASE = "https://places.googleapis.com/v1";

/// поля скелета (см. place-skeleton.ts); для поиска — укороченный список
const DETAILS_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "regularOpeningHours",
  "internationalPhoneNumber",
  "nationalPhoneNumber",
  "websiteUri",
  "googleMapsUri",
  "types",
].join(",");

const SEARCH_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.types",
].join(",");

const REQUEST_TIMEOUT_MS = 15_000;

/// радиус locationBias вокруг координат из ссылки Maps: покрывает город,
/// не утаскивая поиск в другую провинцию
const LOCATION_BIAS_RADIUS_M = 10_000;

export class GooglePlacesApiError extends Error {
  code = "GOOGLE_PLACES_API_ERROR";

  constructor(
    public readonly operation: string,
    public readonly status: number,
    public readonly detail: string,
  ) {
    super(`Google Places ${operation} failed (${status}): ${detail}`);
  }
}

function getApiKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    throw new Error(
      "GOOGLE_PLACES_API_KEY is not defined — как получить ключ: docs/DATA_ENGINE.md",
    );
  }
  return key;
}

async function readErrorDetail(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      error?: { message?: string; status?: string };
    };
    return body.error?.message || body.error?.status || "Unknown error";
  } catch {
    return "Non-JSON error response";
  }
}

/**
 * Поиск мест по тексту (places:searchText). Координаты (из ссылки на карточку
 * Maps) дают locationBias — иначе «Skippy Land» найдётся в другом городе.
 * Возвращает кандидатов как есть; выбор — за человеком в CLI.
 */
export async function searchPlacesByText(
  query: string,
  bias?: { latitude: number; longitude: number },
): Promise<GooglePlace[]> {
  const body: Record<string, unknown> = {
    textQuery: query,
    // адреса и названия в каталоге ведём на английском
    languageCode: "en",
  };
  if (bias) {
    body.locationBias = {
      circle: {
        center: { latitude: bias.latitude, longitude: bias.longitude },
        radius: LOCATION_BIAS_RADIUS_M,
      },
    };
  }

  const response = await fetch(`${PLACES_API_BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": getApiKey(),
      "X-Goog-FieldMask": SEARCH_FIELD_MASK,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new GooglePlacesApiError(
      "searchText",
      response.status,
      await readErrorDetail(response),
    );
  }

  const data = (await response.json()) as GoogleSearchTextResponse;
  return data.places ?? [];
}

/** Полные детали места по каноническому Place ID (для скелета). */
export async function getPlaceDetails(placeId: string): Promise<GooglePlace> {
  const response = await fetch(
    `${PLACES_API_BASE}/places/${encodeURIComponent(placeId)}?languageCode=en`,
    {
      headers: {
        "X-Goog-Api-Key": getApiKey(),
        "X-Goog-FieldMask": DETAILS_FIELD_MASK,
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    },
  );

  if (!response.ok) {
    throw new GooglePlacesApiError(
      "getPlace",
      response.status,
      await readErrorDetail(response),
    );
  }

  return (await response.json()) as GooglePlace;
}
