import Link from "next/link";
import type { ActivityListItemDto } from "@/dto/activity-list-item.dto";
import { PlaceImage } from "@/components/places/place-image";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { computeEventStatus } from "@/lib/events/event-lifecycle";
import { formatAgeRange } from "@/lib/age/format-age";
import { dateLocale, getDictionary, langFromPath } from "@/content/dictionary";

type ActivityCardProps = {
  activity: ActivityListItemDto;
  basePath: string;
};

function formatMoney(amount: number, currency: string, lang: string): string {
  return `${amount.toLocaleString(dateLocale(lang))} ${currency}`;
}

export function ActivityCard({
  activity,
  basePath,
}: ActivityCardProps): React.ReactElement {
  const lang = langFromPath(basePath);
  const dict = getDictionary(lang);
  const typeLabel =
    (dict.placeDetails.programTypes as Record<string, string>)[activity.type] ??
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

  const ageRange = formatAgeRange(activity.minAgeMonths, activity.maxAgeMonths, lang);

  return (
    <Link
      href={
        activity.slug
          ? `${basePath}/activities/${activity.slug}`
          : `${basePath}/activities`
      }
      className="activity-card interactive-surface"
    >
      <PlaceImage url={activity.imageUrl} alt={activity.name} />

      <div className="activity-card-head">
        <span className="program-type">{typeLabel}</span>
        {status ? <EventStatusBadge status={status} lang={lang} /> : null}
      </div>

      <h3 className="activity-name">{activity.name}</h3>

      <p className="activity-place">
        <span className="activity-place-label">{dict.activities.placeLabel}</span>
        <span className="activity-place-name">
          {activity.place?.name ?? activity.venueName}
        </span>
      </p>

      {ageRange ? (
        <p className="activity-age">
          <span className="activity-age-label">{dict.activities.ageLabel}</span>{" "}
          {ageRange}
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
              {dict.placeDetails.programOldPrice(
                formatMoney(activity.oldPrice, activity.currency, lang),
              )}
            </span>
          ) : null}
          <span className="program-current-price">
            {formatMoney(activity.price, activity.currency, lang)}
          </span>
          {activity.priceUnit ? (
            <span className="program-price-unit">{activity.priceUnit}</span>
          ) : null}
        </p>
      ) : null}

      {activity.description ? (
        <p className="activity-description">{activity.description}</p>
      ) : null}

      <span className="activity-cta">
        {dict.activityCard.detailsCta} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
