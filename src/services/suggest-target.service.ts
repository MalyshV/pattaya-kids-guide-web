import { placeDisplayName } from "@/lib/places/display-name";
import "server-only";

import { pickLocalized } from "@/lib/i18n/localize";
import type { AboutKind, AboutRef } from "@/lib/suggest/about";
import { getActivityBySlug } from "@/services/activities.service";
import { getApprovedEventBySlug } from "@/services/events.service";
import { getApprovedPlaceBySlug } from "@/services/places.service";

/**
 * Карточка, к которой относится дополнение из формы «Предложить своё»
 * (?about=place:slug). Только то, что уже видно на сайте: те же запросы, что
 * у страниц карточек, — черновик или чужой город дополнить нельзя.
 */

export type SuggestTarget = {
  kind: AboutKind;
  id: string;
  slug: string;
  name: string;
};

export async function getSuggestTarget(
  ref: AboutRef,
  cityId: string,
  lang: string,
): Promise<SuggestTarget | null> {
  if (ref.kind === "place") {
    const place = await getApprovedPlaceBySlug(ref.slug, cityId);
    // имя — бренд + метка точки сети на языке страницы
    return place
      ? {
          kind: "place",
          id: place.id,
          slug: ref.slug,
          name: placeDisplayName(place, lang),
        }
      : null;
  }
  if (ref.kind === "event") {
    const event = await getApprovedEventBySlug(ref.slug, cityId);
    return event
      ? {
          kind: "event",
          id: event.id,
          slug: ref.slug,
          name: pickLocalized(event.title, event.titleEn, event.titleTh, lang),
        }
      : null;
  }
  const activity = await getActivityBySlug(ref.slug, cityId);
  return activity
    ? {
        kind: "activity",
        id: activity.id,
        slug: ref.slug,
        name: pickLocalized(activity.name, activity.nameEn, activity.nameTh, lang),
      }
    : null;
}
