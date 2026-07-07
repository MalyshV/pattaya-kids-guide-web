import type { ActivityListItemDto } from "@/dto/activity-list-item.dto";
import type { ActivityWithPlace } from "@/services/activities.service";

export function mapActivityToListItem(activity: ActivityWithPlace): ActivityListItemDto {
  return {
    id: activity.id,
    slug: activity.slug,
    imageUrl: activity.imageUrl,
    type: activity.type,
    name: activity.name,
    description: activity.description,
    price: activity.price,
    oldPrice: activity.oldPrice,
    currency: activity.currency,
    priceUnit: activity.priceUnit,
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
    venueName: activity.venueName,
    venueAddress: activity.venueAddress,
    categories: activity.categories.map((link) => ({
      id: link.category.id,
      name: link.category.name,
      slug: link.category.slug,
    })),
  };
}
