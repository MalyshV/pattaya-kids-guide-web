import type { MapPointDto } from "@/dto/map-point.dto";
import type { EventWithPlace } from "@/services/events.service";
import type { ActivityWithPlace } from "@/services/activities.service";
import type { PlaceListItemDto } from "@/dto/place-list-item.dto";
import { pickLocalized } from "@/lib/i18n/localize";

/**
 * Сборка единых точек карты из трёх сущностей. Координаты берутся честно:
 *  - место: свои (обязательные);
 *  - событие: свои ИЛИ у связанного места;
 *  - занятие: у связанного места ИЛИ у текстовой площадки (venue-координаты).
 * Точка без координат и без slug (нет страницы) отбрасывается — null.
 */

export function placeToMapPoint(place: PlaceListItemDto, basePath: string): MapPointDto {
  return {
    id: place.id,
    kind: "place",
    name: place.name,
    href: `${basePath}/places/${place.slug}`,
    latitude: place.latitude,
    longitude: place.longitude,
    imageUrl: place.imageUrl,
  };
}

export function eventToMapPoint(
  event: EventWithPlace,
  basePath: string,
  lang: string,
): MapPointDto | null {
  const latitude = event.latitude ?? event.place?.latitude ?? null;
  const longitude = event.longitude ?? event.place?.longitude ?? null;
  if (latitude == null || longitude == null) {
    return null;
  }
  return {
    id: event.id,
    kind: "event",
    name: pickLocalized(event.title, event.titleEn, event.titleTh, lang),
    href: `${basePath}/events/${event.slug}`,
    latitude,
    longitude,
    imageUrl: event.imageUrl,
  };
}

export function activityToMapPoint(
  activity: ActivityWithPlace,
  basePath: string,
  lang: string,
): MapPointDto | null {
  // абонементы (без slug) страницы не имеют — на карту не ставим
  if (!activity.slug) {
    return null;
  }
  const latitude = activity.place?.latitude ?? activity.venueLatitude ?? null;
  const longitude = activity.place?.longitude ?? activity.venueLongitude ?? null;
  if (latitude == null || longitude == null) {
    return null;
  }
  return {
    id: activity.id,
    kind: "activity",
    name: pickLocalized(activity.name, activity.nameEn, activity.nameTh, lang),
    href: `${basePath}/activities/${activity.slug}`,
    latitude,
    longitude,
    imageUrl: activity.imageUrl,
  };
}
