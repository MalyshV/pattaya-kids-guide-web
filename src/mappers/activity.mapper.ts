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
    name: pickLocalized(activity.name, activity.nameEn, lang),
    description: pickLocalized(activity.description, activity.descriptionEn, lang),
    price: activity.price,
    oldPrice: activity.oldPrice,
    currency: activity.currency,
    priceUnit: pickLocalized(activity.priceUnit, activity.priceUnitEn, lang),
    minAgeMonths: activity.minAgeMonths,
    maxAgeMonths: activity.maxAgeMonths,
    startDate: activity.startDate,
    endDate: activity.endDate,
    place: activity.place
      ? {
          name: activity.place.name,
          slug: activity.place.slug,
          address: activity.place.address,
        }
      : null,
    venueName: pickLocalized(activity.venueName, activity.venueNameEn, lang),
    venueAddress: activity.venueAddress,
    categories: activity.categories.map((link) => ({
      id: link.category.id,
      name: pickLocalized(link.category.name, link.category.nameEn, lang),
      slug: link.category.slug,
    })),
    classes: activity.classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      ageLabel: pickLocalized(cls.ageLabel, cls.ageLabelEn, lang),
      minAgeMonths: cls.minAgeMonths,
      maxAgeMonths: cls.maxAgeMonths,
      parentRequired: cls.parentRequired,
      schedule: pickLocalized(cls.schedule, cls.scheduleEn, lang),
    })),
  };
}
