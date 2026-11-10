import type { DistrictItemDto } from "@/dto/district-item.dto";
import type { MapPointDto } from "@/dto/map-point.dto";
import type { PlaceListItemDto } from "@/dto/place-list-item.dto";
import type { EventListItemDto } from "@/dto/event-list-item.dto";
import type { ActivityListItemDto } from "@/dto/activity-list-item.dto";
import { dateLocale, getDictionary } from "@/content/dictionary";
import { formatAgeRange } from "@/lib/age/format-age";

/**
 * Строки списка на странице района: точка карты + тихая подпись под
 * названием. Подпись собирается из того, что уже есть в карточках, — новых
 * полей и запросов страница района не требует.
 */

/** Больше трёх частей в одну строку не помещается и не читается. */
const META_PARTS = 3;
const SEPARATOR = " · ";

function joinMeta(parts: Array<string | null | undefined>): string | null {
  const present = parts.filter((part): part is string => Boolean(part));
  return present.length > 0 ? present.slice(0, META_PARTS).join(SEPARATOR) : null;
}

/** Место: формат и главные удобства — «В помещении · Кондиционер · Еда». */
export function placeItemMeta(place: PlaceListItemDto, lang: string): string | null {
  const dict = getDictionary(lang);
  // закрытое место: главное — что оно закрыто, удобства уже не важны
  if (place.closure === "temporarily") {
    return dict.openStatus.closedTemporarily;
  }
  if (place.closure === "permanently") {
    return dict.openStatus.closedPermanently;
  }
  return joinMeta([
    place.indoor ? dict.places.badgeIndoor : null,
    place.outdoor ? dict.places.badgeOutdoor : null,
    place.hasAirCon ? dict.placeFilters.labels.hasAirCon : null,
    place.hasFood ? dict.places.features.food : null,
    place.canLeaveChild ? dict.places.features.childDropOff : null,
    place.animalContact ? dict.places.features.animals : null,
  ]);
}

/** Событие: день начала (по времени города) и где — «28 нояб. · Terminal 21». */
export function eventItemMeta(
  event: EventListItemDto,
  lang: string,
  timezone: string,
): string | null {
  const day = new Intl.DateTimeFormat(dateLocale(lang), {
    timeZone: timezone,
    day: "numeric",
    month: "short",
  }).format(new Date(event.startDate));
  return joinMeta([day, event.place?.name ?? event.locationName]);
}

/** Занятие: возраст и где — «от 3 лет · Kids Studio». */
export function activityItemMeta(
  activity: ActivityListItemDto,
  lang: string,
): string | null {
  return joinMeta([
    formatAgeRange(activity.minAgeMonths, activity.maxAgeMonths, lang),
    activity.place?.name ?? activity.venueName,
  ]);
}

export function toDistrictItem(point: MapPointDto, meta: string | null): DistrictItemDto {
  return { ...point, meta };
}
