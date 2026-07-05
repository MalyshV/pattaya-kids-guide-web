import Link from "next/link";
import { notFound } from "next/navigation";
import type { PlaceDetailsDto } from "@/dto/place-details.dto";
import { mapEventToDto } from "@/mappers/event.mapper";
import { mapPlaceDetailsToDto } from "@/mappers/place-details.mapper";
import { getUpcomingApprovedEventsByPlaceId } from "@/services/events.service";
import { getApprovedPlaceBySlug } from "@/services/places.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { ru } from "@/content/ru";

type PageProps = {
  params: Promise<{ lang: string; city: string; slug: string }>;
};

function formatShortDate(value: string | Date | null): string {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export default async function PlaceDetailsPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug, slug } = await params;

  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const basePath = cityBasePath(lang, citySlug);
  const place = await getApprovedPlaceBySlug(slug, city.id);

  if (!place) {
    notFound();
  }

  const events = await getUpcomingApprovedEventsByPlaceId(place.id);
  const eventDtos = events.map(mapEventToDto);
  const dto: PlaceDetailsDto = mapPlaceDetailsToDto(place);

  return (
    <main className="page-shell">
      <div className="back-link-wrapper">
        <Link href={basePath} className="back-link">
          {ru.placeDetails.back}
        </Link>
      </div>

      <section className="hero">
        <p className="eyebrow">{ru.placeDetails.eyebrow}</p>
        <h1 className="hero-title">{dto.name}</h1>
        <p className="hero-description">
          {dto.description ?? ru.common.descriptionFallback}
        </p>
      </section>

      <section className="details-section">
        <h2 className="section-title">{ru.placeDetails.detailsTitle}</h2>

        <div className="details-grid">
          <div>
            <strong>{ru.placeDetails.fields.type}:</strong>{" "}
            {[dto.indoor && ru.places.badgeIndoor, dto.outdoor && ru.places.badgeOutdoor]
              .filter(Boolean)
              .join(", ") || ru.common.no}
          </div>

          <div>
            <strong>{ru.placeDetails.fields.food}:</strong>{" "}
            {dto.hasFood ? ru.common.yes : ru.common.no}
          </div>

          <div>
            <strong>{ru.placeDetails.fields.wifi}:</strong>{" "}
            {dto.hasWifi ? ru.common.yes : ru.common.no}
          </div>

          <div>
            <strong>{ru.placeDetails.fields.childDropOff}:</strong>{" "}
            {dto.canLeaveChild ? ru.common.yes : ru.common.no}
          </div>

          <div>
            <strong>{ru.placeDetails.fields.animals}:</strong>{" "}
            {dto.animalContact ? ru.common.yes : ru.common.no}
          </div>
        </div>
      </section>

      {dto.categories.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.categoriesTitle}</h2>

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
        <h2 className="section-title">{ru.placeDetails.upcomingTitle}</h2>

        {eventDtos.length > 0 ? (
          <div className="events-list">
            {eventDtos.map((event) => (
              <Link
                key={event.id}
                href={`${basePath}/events/${event.slug}`}
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
          <p className="empty-text">{ru.placeDetails.noUpcoming}</p>
        )}
      </section>
    </main>
  );
}
