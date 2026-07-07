import Link from "next/link";
import type { ActivityListItemDto } from "@/dto/activity-list-item.dto";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { computeEventStatus } from "@/lib/events/event-lifecycle";
import { formatAgeRange } from "@/lib/age/format-age";
import { ru } from "@/content/ru";

type ActivityCardProps = {
  activity: ActivityListItemDto;
  basePath: string;
};

function formatMoney(amount: number, currency: string): string {
  return `${amount.toLocaleString("ru-RU")} ${currency}`;
}

export function ActivityCard({
  activity,
  basePath,
}: ActivityCardProps): React.ReactElement {
  const typeLabel =
    (ru.placeDetails.programTypes as Record<string, string>)[activity.type] ??
    activity.type;

  // Лагерь с датами показывает живой статус (идёт/скоро/прошло); регулярные — нет.
  const status =
    activity.type === "CAMP" && activity.startDate
      ? computeEventStatus(
          new Date(activity.startDate),
          activity.endDate ? new Date(activity.endDate) : null,
          new Date(),
        )
      : undefined;

  const ageRange = formatAgeRange(activity.minAgeMonths, activity.maxAgeMonths);

  return (
    <article className="activity-card interactive-surface">
      <div className="activity-card-head">
        <span className="program-type">{typeLabel}</span>
        {status ? <EventStatusBadge status={status} /> : null}
      </div>

      <h3 className="activity-name">{activity.name}</h3>

      <Link href={`${basePath}/places/${activity.place.slug}`} className="activity-place">
        <span className="activity-place-label">{ru.activities.placeLabel}</span>
        <span className="activity-place-name">{activity.place.name}</span>
      </Link>

      {ageRange ? (
        <p className="activity-age">
          <span className="activity-age-label">{ru.activities.ageLabel}</span> {ageRange}
        </p>
      ) : null}

      {activity.categories.length > 0 ? (
        <div className="category-list">
          {activity.categories.map((category) => (
            <span key={category.id} className="category-chip">
              {category.name}
            </span>
          ))}
        </div>
      ) : null}

      {activity.price != null ? (
        <p className="program-price">
          {activity.oldPrice != null ? (
            <span className="program-old-price">
              {ru.placeDetails.programOldPrice(
                formatMoney(activity.oldPrice, activity.currency),
              )}
            </span>
          ) : null}
          <span className="program-current-price">
            {formatMoney(activity.price, activity.currency)}
          </span>
          {activity.priceUnit ? (
            <span className="program-price-unit">{activity.priceUnit}</span>
          ) : null}
        </p>
      ) : null}

      {activity.description ? (
        <p className="activity-description">{activity.description}</p>
      ) : null}
    </article>
  );
}
