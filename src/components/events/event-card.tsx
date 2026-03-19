import Link from "next/link";
import type { EventListItemDto } from "@/dto/event-list-item.dto";

type EventCardProps = {
  event: EventListItemDto;
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Not specified";
  }

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function EventCard({ event }: EventCardProps): React.ReactElement {
  return (
    <Link className="event-card-link" href={`/events/${event.slug}`}>
      <article className="event-card">
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
          <span className="feature-chip">Start: {formatDate(event.startDate)}</span>
          <span className="feature-chip">End: {formatDate(event.endDate)}</span>
        </div>

        <p className="event-card-location">
          {event.locationName ?? event.address ?? "Location not specified"}
        </p>

        {event.place ? (
          <p className="event-card-place">Place: {event.place.name}</p>
        ) : null}
      </article>
    </Link>
  );
}
