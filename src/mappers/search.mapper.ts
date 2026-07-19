import type { SearchItemDto } from "@/dto/search-item.dto";
import type {
  SearchActivityRow,
  SearchEventRow,
  SearchPlaceRow,
} from "@/services/search.service";
import { pickLocalized } from "@/lib/i18n/localize";

/**
 * Индекс поиска: видимое название локализуется по языку страницы, а ищется
 * всегда по обеим локалям сразу — родители печатают и «литл гим», и
 * "little gym" независимо от выбранного языка интерфейса.
 */

function categoriesText(
  categories: Array<{ category: { name: string; nameEn: string | null } }>,
): string {
  return categories
    .flatMap(({ category }) => [category.name, category.nameEn ?? ""])
    .join(" ");
}

export function mapSearchIndex(
  places: SearchPlaceRow[],
  activities: SearchActivityRow[],
  events: SearchEventRow[],
  basePath: string,
  lang: string,
): SearchItemDto[] {
  const placeItems: SearchItemDto[] = places.map((place) => ({
    id: place.id,
    type: "place",
    // название места — имя собственное, не переводится
    name: place.name,
    hint: place.address,
    url: `${basePath}/places/${place.slug}`,
    searchText: `${place.name} ${categoriesText(place.categories)}`,
  }));

  const activityItems: SearchItemDto[] = activities
    // slug отфильтрован в сервисе; страховка на уровне типа
    .filter((activity) => activity.slug !== null)
    .map((activity) => ({
      id: activity.id,
      type: "activity",
      name: pickLocalized(activity.name, activity.nameEn, lang),
      hint:
        activity.place?.name ??
        (activity.venueName
          ? pickLocalized(activity.venueName, activity.venueNameEn, lang)
          : null),
      url: `${basePath}/activities/${activity.slug}`,
      searchText: [
        activity.name,
        activity.nameEn ?? "",
        activity.place?.name ?? "",
        activity.venueName ?? "",
        activity.venueNameEn ?? "",
        categoriesText(activity.categories),
      ].join(" "),
    }));

  const eventItems: SearchItemDto[] = events.map((event) => ({
    id: event.id,
    type: "event",
    name: pickLocalized(event.title, event.titleEn, lang),
    // где проходит: место из каталога или текстовая площадка события
    hint:
      event.place?.name ??
      (event.locationName
        ? pickLocalized(event.locationName, event.locationNameEn, lang)
        : null),
    url: `${basePath}/events/${event.slug}`,
    searchText: [
      event.title,
      event.titleEn ?? "",
      event.place?.name ?? "",
      event.locationName ?? "",
      event.locationNameEn ?? "",
    ].join(" "),
  }));

  return [...placeItems, ...activityItems, ...eventItems];
}
