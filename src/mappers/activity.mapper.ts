import type { ActivityListItemDto } from "@/dto/activity-list-item.dto";
import type { ActivityWithPlace } from "@/services/activities.service";

export function mapActivityToListItem(activity: ActivityWithPlace): ActivityListItemDto {
  return {
    id: activity.id,
    type: activity.type,
    name: activity.name,
    description: activity.description,
    price: activity.price,
    oldPrice: activity.oldPrice,
    currency: activity.currency,
    priceUnit: activity.priceUnit,
    startDate: activity.startDate,
    endDate: activity.endDate,
    place: {
      name: activity.place.name,
      slug: activity.place.slug,
    },
    categories: activity.categories.map((link) => ({
      id: link.category.id,
      name: link.category.name,
      slug: link.category.slug,
    })),
  };
}
