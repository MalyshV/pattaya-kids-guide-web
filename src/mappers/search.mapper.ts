import type { SearchItemDto } from "@/dto/search-item.dto";
import type {
  SearchActivityRow,
  SearchEventRow,
  SearchPlaceRow,
} from "@/services/search.service";
import { pickLocalized } from "@/lib/i18n/localize";
import { placeDisplayName, placeDisplayNames } from "@/lib/places/display-name";

/**
 * Индекс поиска: видимое название локализуется по языку страницы, а ищется
 * всегда по обеим локалям сразу — родители печатают и «литл гим», и
 * "little gym" независимо от выбранного языка интерфейса.
 */

function categoriesText(
  categories: Array<{
    category: { name: string; nameEn: string | null; nameTh: string | null };
  }>,
): string {
  return categories
    .flatMap(({ category }) => [
      category.name,
      category.nameEn ?? "",
      category.nameTh ?? "",
    ])
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
    // название — имя собственное; у точки сети к нему добавляется метка на языке страницы
    name: placeDisplayName(place, lang),
    hint: place.address,
    url: `${basePath}/places/${place.slug}`,
    // ищется по всем написаниям: метка на трёх языках, бренд и его другие
    // написания («สกิ๊ปปี้แลนด์», «Скиппи Ленд») — независимо от языка страницы
    searchText: [
      ...placeDisplayNames(place),
      place.brand?.name ?? "",
      ...(place.brand?.searchAliases ?? []),
      categoriesText(place.categories),
    ].join(" "),
  }));

  const activityItems: SearchItemDto[] = activities
    // slug отфильтрован в сервисе; страховка на уровне типа
    .filter((activity) => activity.slug !== null)
    .map((activity) => ({
      id: activity.id,
      type: "activity",
      name: pickLocalized(activity.name, activity.nameEn, activity.nameTh, lang),
      hint:
        (activity.place ? placeDisplayName(activity.place, lang) : null) ??
        (activity.venueName
          ? pickLocalized(
              activity.venueName,
              activity.venueNameEn,
              activity.venueNameTh,
              lang,
            )
          : null),
      url: `${basePath}/activities/${activity.slug}`,
      searchText: [
        activity.name,
        activity.nameEn ?? "",
        activity.nameTh ?? "",
        ...(activity.place ? placeDisplayNames(activity.place) : []),
        activity.venueName ?? "",
        activity.venueNameEn ?? "",
        activity.venueNameTh ?? "",
        categoriesText(activity.categories),
      ].join(" "),
    }));

  const eventItems: SearchItemDto[] = events.map((event) => ({
    id: event.id,
    type: "event",
    name: pickLocalized(event.title, event.titleEn, event.titleTh, lang),
    // где проходит: место из каталога или текстовая площадка события
    hint:
      (event.place ? placeDisplayName(event.place, lang) : null) ??
      (event.locationName
        ? pickLocalized(
            event.locationName,
            event.locationNameEn,
            event.locationNameTh,
            lang,
          )
        : null),
    url: `${basePath}/events/${event.slug}`,
    searchText: [
      event.title,
      event.titleEn ?? "",
      event.titleTh ?? "",
      ...(event.place ? placeDisplayNames(event.place) : []),
      event.locationName ?? "",
      event.locationNameEn ?? "",
      event.locationNameTh ?? "",
    ].join(" "),
  }));

  return [...placeItems, ...activityItems, ...eventItems];
}
