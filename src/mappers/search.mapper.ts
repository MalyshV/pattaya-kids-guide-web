import type { SearchItemDto } from "@/dto/search-item.dto";
import type {
  SearchActivityRow,
  SearchEventRow,
  SearchPlaceRow,
} from "@/services/search.service";
import { pickLocalized } from "@/lib/i18n/localize";
import { placeDisplayName, placeDisplayNames } from "@/lib/places/display-name";
import { closureKind } from "@/lib/places/closure";
import { getDictionary } from "@/content/dictionary";
import { placeDistrictMap } from "@/lib/districts/district-facet";
import { activityDistrictSlug, eventDistrictSlug } from "@/lib/districts/district-page";
import type { DistrictDefinition } from "@/lib/districts/resolve-district";

/**
 * Индекс поиска: видимое название локализуется по языку страницы, а ищется
 * всегда по обеим локалям сразу — родители печатают и «литл гим», и
 * "little gym" независимо от выбранного языка интерфейса.
 *
 * Районы (решение 10.10, шаг 4): район находится сам — ведёт на свою
 * страницу, — а место, занятие и событие находятся по названию своего
 * района: «игровая джомтьен», «за сукхумвитом».
 */

/** Все написания района: названия на трёх языках и разговорные варианты. */
function districtNames(district: DistrictDefinition): string[] {
  return [
    district.name,
    district.nameEn,
    district.nameTh,
    ...(district.searchAliases ?? []),
  ];
}

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
  /** районы города; без них поиск работает как раньше — только по названиям */
  districts: readonly DistrictDefinition[] = [],
): SearchItemDto[] {
  const statusDict = getDictionary(lang).openStatus;

  // район каждой позиции считается здесь, на показе: ручной выбор из админки
  // или координаты (как в каталоге и на странице района)
  const districtText = new Map(
    districts.map((district) => [district.slug, districtNames(district).join(" ")]),
  );
  const placeDistricts = placeDistrictMap(places, districts);
  const textOf = (slug: string | null | undefined): string =>
    (slug ? districtText.get(slug) : undefined) ?? "";

  const districtItems: SearchItemDto[] = [...districts]
    .sort((a, b) => a.order - b.order)
    .map((district) => ({
      id: `district:${district.slug}`,
      type: "district",
      name: pickLocalized(district.name, district.nameEn, district.nameTh, lang),
      hint: null,
      url: `${basePath}/districts/${district.slug}`,
      searchText: districtNames(district).join(" "),
      // любое написание района весит как его название: район встаёт выше
      // мест, которые находятся по нему же
      aliases: districtNames(district),
    }));

  const placeItems: SearchItemDto[] = places.map((place) => ({
    id: place.id,
    type: "place",
    // название — имя собственное; у точки сети к нему добавляется метка на языке страницы
    name: placeDisplayName(place, lang),
    // закрытое место находится по знакомому названию, подсказка — честная
    hint:
      closureKind(place) === "temporarily"
        ? `${statusDict.closedTemporarily} · ${place.address}`
        : closureKind(place) === "permanently"
          ? `${statusDict.closedPermanently} · ${place.address}`
          : place.address,
    url: `${basePath}/places/${place.slug}`,
    // ищется по всем написаниям: метка на трёх языках, бренд и его другие
    // написания («สกิ๊ปปี้แลนด์», «Скиппи Ленд») — независимо от языка страницы
    searchText: [
      ...placeDisplayNames(place),
      place.brand?.name ?? "",
      ...(place.brand?.searchAliases ?? []),
      categoriesText(place.categories),
      textOf(placeDistricts.get(place.id)),
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
        textOf(activityDistrictSlug(activity, placeDistricts, districts)),
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
      textOf(eventDistrictSlug(event, placeDistricts, districts)),
    ].join(" "),
  }));

  return [...districtItems, ...placeItems, ...activityItems, ...eventItems];
}
