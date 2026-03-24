import Link from "next/link";
import { notFound } from "next/navigation";
import type { EventDetailsDto } from "@/dto/event-details.dto";
import { mapEventDetailsToDto } from "@/mappers/event-details.mapper";
import { getApprovedEventBySlug } from "@/services/events.service";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(value: string | Date | null): string {
  if (!value) {
    return "Not specified";
  }

  const date = value instanceof Date ? value : new Date(value);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function EventDetailsPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;

  const event = await getApprovedEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const dto: EventDetailsDto = mapEventDetailsToDto(event);

  return (
    <main className="page-shell">
      <div className="back-link-wrapper">
        <Link href="/events" className="back-link">
          ← Back to events
        </Link>
      </div>

      <section className="hero">
        <p className="eyebrow">Event</p>
        <h1 className="hero-title">{dto.title}</h1>
        <p className="hero-description">
          {dto.description ?? "More details will be added soon."}
        </p>
      </section>

      <section className="details-section">
        <h2 className="section-title">Details</h2>

        <div className="details-grid">
          <div>
            <strong>Start:</strong> {formatDate(dto.startDate)}
          </div>

          <div>
            <strong>End:</strong> {formatDate(dto.endDate)}
          </div>

          <div>
            <strong>Location:</strong> {dto.locationName ?? "Not specified"}
          </div>

          <div>
            <strong>Address:</strong> {dto.address ?? "Not specified"}
          </div>
        </div>
      </section>

      <section className="details-section">
        <h2 className="section-title">Place</h2>

        {dto.place ? (
          <Link href={`/places/${dto.place.slug}`} className="linked-place">
            <span className="linked-place-label">Place</span>
            <span className="linked-place-name">{dto.place.name}</span>
          </Link>
        ) : (
          <p className="empty-text">This event is not tied to a place.</p>
        )}
      </section>
    </main>
  );
}
