import Link from "next/link";
import type { EventListItemDto } from "@/dto/event-list-item.dto";
import { PlaceImage } from "@/components/places/place-image";
import { MemoryButtons } from "@/components/memory/memory-buttons";
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
      <MemoryButtons
        compact
        entity="event"
        slug={event.slug}
        name={event.title}
        imageUrl={event.imageUrl}
      />

      <div className="event-card-header">
        <div>
          <h3 className="event-card-title">
            <Link href={`${basePath}/events/${event.slug}`} className="card-title-link">
              {event.title}
            </Link>
          </h3>
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
        {/* endDate=null — это разовое событие (конвенция данных), а не
            «организаторы не определились»: чип «Конец» просто не показываем */}
        {event.endDate ? (
          <span className="feature-chip">
            {dict.eventCard.ends} {formatDate(event.endDate, dict, lang)}
          </span>
        ) : null}
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
        {/* дубль ссылки-заголовка (вся карточка кликабельна) — прячем от
            скринридера и клавиатуры; ссылка на место ниже остаётся живой */}
        <Link
          href={`${basePath}/events/${event.slug}`}
          className="event-card-cta"
          aria-hidden="true"
          tabIndex={-1}
        >
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
