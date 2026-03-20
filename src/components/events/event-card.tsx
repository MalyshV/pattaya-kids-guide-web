import Link from "next/link";
import type { EventListItemDto } from "@/dto/event-list-item.dto";

type EventCardProps = {
  event: EventListItemDto;
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Date TBD";
  }

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export function EventCard({ event }: EventCardProps): React.ReactElement {
  return (
    <article className="event-card interactive-surface">
      <div className="event-card-header">
        <div>
          <h3 className="event-card-title">{event.title}</h3>
          <p className="event-card-slug">/{event.slug}</p>
        </div>
      </div>

      <p className="event-card-description">
        {event.description ?? "No description yet."}
      </p>

      <div className="feature-list">
        <span className="feature-chip">Starts {formatDate(event.startDate)}</span>
        <span className="feature-chip">
          Ends {event.endDate ? formatDate(event.endDate) : "Date TBD"}
        </span>
      </div>

      <p className="event-card-location">
        {event.locationName ?? event.address ?? "Location to be confirmed"}
      </p>

      {event.place ? <p className="event-card-place">At {event.place.name}</p> : null}

      <div className="event-card-actions">
        <Link href={`/events/${event.slug}`} className="event-card-cta">
          <span className="event-card-cta-text">View event</span>
          <span className="event-card-cta-arrow" aria-hidden="true">
            →
          </span>
        </Link>

        {event.place ? (
          <Link
            href={`/places/${event.place.slug}`}
            className="event-card-secondary-link"
          >
            View place
          </Link>
        ) : null}
      </div>
    </article>
  );
}
