import Link from "next/link";
import type { EventListItemDto } from "@/dto/event-list-item.dto";
import { PlaceImage } from "@/components/places/place-image";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import type { EventLifecycle } from "@/lib/events/event-lifecycle";
import { ru } from "@/content/ru";

type EventCardProps = {
  event: EventListItemDto;
  basePath: string;
  status?: EventLifecycle;
};

function formatDate(value: string | null): string {
  if (!value) {
    return ru.eventCard.dateTbd;
  }

  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export function EventCard({
  event,
  basePath,
  status,
}: EventCardProps): React.ReactElement {
  const isPast = status === "past";

  return (
    <article
      className={`event-card interactive-surface${isPast ? " event-card-past" : ""}`}
    >
      <PlaceImage url={event.imageUrl} alt={event.title} />

      <div className="event-card-header">
        <div>
          <h3 className="event-card-title">{event.title}</h3>
          <p className="event-card-slug">/{event.slug}</p>
        </div>
      </div>

      <EventStatusBadge status={status} wrapperClassName="event-card-status" />

      <p className="event-card-description">
        {event.description ?? ru.common.descriptionFallback}
      </p>

      <div className="feature-list">
        <span className="feature-chip">
          {ru.eventCard.starts} {formatDate(event.startDate)}
        </span>
        <span className="feature-chip">
          {ru.eventCard.ends}{" "}
          {event.endDate ? formatDate(event.endDate) : ru.eventCard.dateTbd}
        </span>
      </div>

      <p className="event-card-location">
        {event.locationName ?? event.address ?? ru.eventCard.locationTbd}
      </p>

      {event.place ? (
        <p className="event-card-place">
          {ru.eventCard.placeLabel}: {event.place.name}
        </p>
      ) : null}

      <div className="event-card-actions">
        <Link href={`${basePath}/events/${event.slug}`} className="event-card-cta">
          <span className="event-card-cta-text">{ru.common.detailsCta}</span>
          <span className="event-card-cta-arrow" aria-hidden="true">
            →
          </span>
        </Link>

        {event.place ? (
          <Link
            href={`${basePath}/places/${event.place.slug}`}
            className="event-card-secondary-link"
          >
            {ru.eventCard.viewPlace}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
