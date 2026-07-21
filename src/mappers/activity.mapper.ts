import type { ActivityListItemDto } from "@/dto/activity-list-item.dto";
import type { ActivityWithPlace } from "@/services/activities.service";
import { pickLocalized } from "@/lib/i18n/localize";

export function mapActivityToListItem(
  activity: ActivityWithPlace,
  lang: string = "ru",
): ActivityListItemDto {
  return {
    id: activity.id,
    slug: activity.slug,
    imageUrl: activity.imageUrl,
    type: activity.type,
    name: pickLocalized(activity.name, activity.nameEn, activity.nameTh, lang),
    description: pickLocalized(
      activity.description,
      activity.descriptionEn,
      activity.descriptionTh,
      lang,
    ),
    price: activity.price,
    oldPrice: activity.oldPrice,
    currency: activity.currency,
    priceUnit: pickLocalized(
      activity.priceUnit,
      activity.priceUnitEn,
      activity.priceUnitTh,
      lang,
    ),
    minAgeMonths: activity.minAgeMonths,
    maxAgeMonths: activity.maxAgeMonths,
    // с кэш-хита (data-cache) даты приходят строками — возвращаем им Date,
    // иначе сравнения в сортировке ленты (activity-sort) дают NaN и любой
    // будущий лагерь считался бы «прошедшим»
    startDate: activity.startDate ? new Date(activity.startDate) : null,
    endDate: activity.endDate ? new Date(activity.endDate) : null,
    place: activity.place
      ? {
          name: activity.place.name,
          slug: activity.place.slug,
          address: activity.place.address,
        }
      : null,
    venueName: pickLocalized(
      activity.venueName,
      activity.venueNameEn,
      activity.venueNameTh,
      lang,
    ),
    venueAddress: activity.venueAddress,
    categories: activity.categories.map((link) => ({
      id: link.category.id,
      name: pickLocalized(
        link.category.name,
        link.category.nameEn,
        link.category.nameTh,
        lang,
      ),
      slug: link.category.slug,
    })),
    classes: activity.classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      ageLabel: pickLocalized(cls.ageLabel, cls.ageLabelEn, cls.ageLabelTh, lang),
      minAgeMonths: cls.minAgeMonths,
      maxAgeMonths: cls.maxAgeMonths,
      parentRequired: cls.parentRequired,
      schedule: pickLocalized(cls.schedule, cls.scheduleEn, cls.scheduleTh, lang),
    })),
  };
}
