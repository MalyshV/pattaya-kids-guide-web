import Link from "next/link";
import { notFound } from "next/navigation";
import type { PlaceDetailsDto } from "@/dto/place-details.dto";
import { mapEventToDto } from "@/mappers/event.mapper";
import { mapPlaceDetailsToDto } from "@/mappers/place-details.mapper";
import { getUpcomingApprovedEventsByPlaceId } from "@/services/events.service";
import { getApprovedPlaceBySlug } from "@/services/places.service";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatShortDate(value: string | Date | null): string {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export default async function PlaceDetailsPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;

  const place = await getApprovedPlaceBySlug(slug);

  if (!place) {
    notFound();
  }

  const events = await getUpcomingApprovedEventsByPlaceId(place.id);
  const eventDtos = events.map(mapEventToDto);
  const dto: PlaceDetailsDto = mapPlaceDetailsToDto(place);

  return (
    <main className="page-shell">
      <div className="back-link-wrapper">
        <Link href="/" className="back-link">
          ← Back to places
        </Link>
      </div>

      <section className="hero">
        <p className="eyebrow">Place</p>
        <h1 className="hero-title">{dto.name}</h1>
        <p className="hero-description">
          {dto.description ?? "More details will be added soon."}
        </p>
      </section>

      <section className="details-section">
        <h2 className="section-title">Details</h2>

        <div className="details-grid">
          <div>
            <strong>Type:</strong> {dto.indoor ? "Indoor" : "Outdoor"}
          </div>

          <div>
            <strong>Food:</strong> {dto.hasFood ? "Available" : "Not available"}
          </div>

          <div>
            <strong>Wi-Fi:</strong> {dto.hasWifi ? "Available" : "Not available"}
          </div>

          <div>
            <strong>Child drop-off:</strong>{" "}
            {dto.canLeaveChild ? "Available" : "Not available"}
          </div>

          <div>
            <strong>Animals:</strong> {dto.animalContact ? "Yes" : "No"}
          </div>
        </div>
      </section>

      {dto.categories.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">Categories</h2>

          <div className="category-list">
            {dto.categories.map((category) => (
              <span key={category.id} className="category-chip">
                {category.name}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="details-section">
        <h2 className="section-title">Upcoming at this place</h2>

        {eventDtos.length > 0 ? (
          <div className="events-list">
            {eventDtos.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="event-inline"
              >
                <div className="event-inline-title">{event.title}</div>
                <div className="event-inline-date">
                  {formatShortDate(event.startDate)}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-text">No upcoming events right now.</p>
        )}
      </section>
    </main>
  );
}
