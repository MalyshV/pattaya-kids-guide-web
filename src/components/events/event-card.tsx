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
    <Link className="place-card-link" href={`/events/${event.slug}`}>
      <article className="place-card">
        <div className="place-card-header">
          <div>
            <h3 className="place-card-title">{event.title}</h3>
            <p className="place-card-slug">/{event.slug}</p>
          </div>
        </div>

        <p className="place-card-description">
          {event.description ?? "No description yet."}
        </p>

        <div className="feature-list">
          <span className="feature-chip">Start: {formatDate(event.startDate)}</span>
          <span className="feature-chip">End: {formatDate(event.endDate)}</span>
        </div>

        <p className="place-card-address">
          {event.locationName ?? event.address ?? "Location not specified"}
        </p>

        {event.place ? (
          <div className="feature-list">
            <span className="feature-chip">Place: {event.place.name}</span>
          </div>
        ) : null}
      </article>
    </Link>
  );
}
