import Link from "next/link";
import type { EventListItemDto } from "@/dto/event-list-item.dto";
import { PlaceImage } from "@/components/places/place-image";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import type { EventLifecycle } from "@/lib/events/event-lifecycle";
import { dateLocale, getDictionary, langFromPath } from "@/content/dictionary";
import type { Dictionary } from "@/content/dictionary";
import { formatAgeRange } from "@/lib/age/format-age";

type EventCardProps = {
  event: EventListItemDto;
  basePath: string;
  status?: EventLifecycle;
};

function formatDate(value: string | null, dict: Dictionary, lang: string): string {
  if (!value) {
    return dict.eventCard.dateTbd;
  }

  return new Date(value).toLocaleDateString(dateLocale(lang), {
    day: "numeric",
    month: "short",
  });
}

export function EventCard({
  event,
  basePath,
  status,
}: EventCardProps): React.ReactElement {
  const lang = langFromPath(basePath);
  const dict = getDictionary(lang);
  const isPast = status === "past";
  const ageRange = formatAgeRange(event.minAgeMonths, event.maxAgeMonths, lang);

  return (
    <article
      className={`event-card interactive-surface${isPast ? " event-card-past" : ""}`}
    >
      <PlaceImage url={event.imageUrl} alt={event.title} />

      <div className="event-card-header">
        <div>
          <h3 className="event-card-title">
            <Link href={`${basePath}/events/${event.slug}`} className="card-title-link">
              {event.title}
            </Link>
          </h3>
          <p className="event-card-slug">/{event.slug}</p>
        </div>
      </div>

      <EventStatusBadge
        status={status}
        wrapperClassName="event-card-status"
        lang={lang}
      />

      <p className="event-card-description">
        {event.description ?? dict.common.descriptionFallback}
      </p>

      <div className="feature-list">
        <span className="feature-chip">
          {dict.eventCard.starts} {formatDate(event.startDate, dict, lang)}
        </span>
        <span className="feature-chip">
          {dict.eventCard.ends}{" "}
          {event.endDate ? formatDate(event.endDate, dict, lang) : dict.eventCard.dateTbd}
        </span>
        {ageRange ? (
          <span className="feature-chip">
            {dict.eventCard.ageLabel}: {ageRange}
          </span>
        ) : null}
      </div>

      <p className="event-card-location">
        {event.locationName ?? event.address ?? dict.eventCard.locationTbd}
      </p>

      {event.place ? (
        <p className="event-card-place">
          {dict.eventCard.placeLabel}: {event.place.name}
        </p>
      ) : null}

      <div className="event-card-actions">
        <Link href={`${basePath}/events/${event.slug}`} className="event-card-cta">
          <span className="event-card-cta-text">{dict.common.detailsCta}</span>
          <span className="event-card-cta-arrow" aria-hidden="true">
            →
          </span>
        </Link>

        {event.place ? (
          <Link
            href={`${basePath}/places/${event.place.slug}`}
            className="event-card-secondary-link"
          >
            {dict.eventCard.viewPlace}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
