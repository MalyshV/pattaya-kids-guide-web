import Link from "next/link";
import { notFound } from "next/navigation";
import type { EventDetailsDto } from "@/dto/event-details.dto";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { mapEventDetailsToDto } from "@/mappers/event-details.mapper";
import { getApprovedEventBySlug } from "@/services/events.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { computeEventStatus } from "@/lib/events/event-lifecycle";
import { ru } from "@/content/ru";

type PageProps = {
  params: Promise<{ lang: string; city: string; slug: string }>;
};

function formatDate(value: string | Date | null): string {
  if (!value) {
    return ru.eventDetails.notSpecified;
  }

  const date = value instanceof Date ? value : new Date(value);

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function EventDetailsPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug, slug } = await params;

  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const basePath = cityBasePath(lang, citySlug);
  const event = await getApprovedEventBySlug(slug, city.id);

  if (!event) {
    notFound();
  }

  const dto: EventDetailsDto = mapEventDetailsToDto(event);
  const eventStatus = dto.startDate
    ? computeEventStatus(
        new Date(dto.startDate),
        dto.endDate ? new Date(dto.endDate) : null,
        new Date(),
      )
    : undefined;

  return (
    <main className="page-shell">
      <div className="back-link-wrapper">
        <Link href={`${basePath}/events`} className="back-link">
          {ru.eventDetails.back}
        </Link>
      </div>

      <section className="hero">
        <p className="eyebrow">{ru.eventDetails.eyebrow}</p>
        <h1 className="hero-title">{dto.title}</h1>
        <EventStatusBadge status={eventStatus} wrapperClassName="hero-status" />
        <p className="hero-description">
          {dto.description ?? ru.common.descriptionFallback}
        </p>
      </section>

      <section className="details-section">
        <h2 className="section-title">{ru.eventDetails.detailsTitle}</h2>

        <div className="details-grid">
          <div>
            <strong>{ru.eventDetails.start}:</strong> {formatDate(dto.startDate)}
          </div>

          <div>
            <strong>{ru.eventDetails.end}:</strong> {formatDate(dto.endDate)}
          </div>

          <div>
            <strong>{ru.eventDetails.location}:</strong>{" "}
            {dto.locationName ?? ru.eventDetails.notSpecified}
          </div>

          <div>
            <strong>{ru.eventDetails.address}:</strong>{" "}
            {dto.address ?? ru.eventDetails.notSpecified}
          </div>
        </div>
      </section>

      <section className="details-section">
        <h2 className="section-title">{ru.eventDetails.placeTitle}</h2>

        {dto.place ? (
          <Link href={`${basePath}/places/${dto.place.slug}`} className="linked-place">
            <span className="linked-place-label">{ru.eventDetails.placeLabel}</span>
            <span className="linked-place-name">{dto.place.name}</span>
          </Link>
        ) : (
          <p className="empty-text">{ru.eventDetails.noPlace}</p>
        )}
      </section>
    </main>
  );
}
