import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { EventDetailsDto } from "@/dto/event-details.dto";
import { ShareButton } from "@/components/common/share-button";
import { SmartBackLink } from "@/components/common/smart-back-link";
import { MemoryButtons } from "@/components/memory/memory-buttons";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { mapEventDetailsToDto } from "@/mappers/event-details.mapper";
import { getApprovedEventBySlug } from "@/services/events.service";
import { ZoomableImage } from "@/components/common/zoomable-image";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { mapsSearchUrl } from "@/lib/geo/maps-search";
import { computeEventStatus } from "@/lib/events/event-lifecycle";
import { formatAgeRange } from "@/lib/age/format-age";
import { articleOpenGraph, metaDescription } from "@/lib/seo/meta";
import { dateLocale, getDictionary, type Dictionary } from "@/content/dictionary";
import { pickLocalized } from "@/lib/i18n/localize";

type PageProps = {
  params: Promise<{ lang: string; city: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  const event = await getApprovedEventBySlug(slug, city.id);

  if (!event) {
    return {};
  }

  const dict = getDictionary(lang);
  const title = `${pickLocalized(event.title, event.titleEn, event.titleTh, lang)} — ${dict.brand}`;
  const description = metaDescription(
    pickLocalized(event.description, event.descriptionEn, event.descriptionTh, lang),
    dict.meta.description,
  );

  return {
    title,
    description,
    openGraph: articleOpenGraph({
      title,
      description,
      siteName: dict.brand,
      path: `${cityBasePath(lang, citySlug)}/events/${slug}`,
      imageUrl: event.imageUrl,
      lang,
    }),
  };
}

/**
 * «Когда» события: дата + время в таймзоне города. Однодневное — одной строкой
 * «17 июня 2026 г., 15:30–17:30»; многодневное — с обеими датами; без конца —
 * только начало. Время считаем в TZ города, иначе показали бы UTC.
 */
function formatEventWhen(
  start: string | Date | null,
  end: string | Date | null,
  timezone: string,
  lang: string,
  dict: Dictionary,
): string {
  if (!start) {
    return dict.eventDetails.notSpecified;
  }

  const startDate = start instanceof Date ? start : new Date(start);
  const dateFmt = new Intl.DateTimeFormat(dateLocale(lang), {
    timeZone: timezone,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat(dateLocale(lang), {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const startDay = dateFmt.format(startDate);
  const startTime = timeFmt.format(startDate);

  if (!end) {
    return `${startDay}, ${startTime}`;
  }

  const endDate = end instanceof Date ? end : new Date(end);
  const endDay = dateFmt.format(endDate);
  const endTime = timeFmt.format(endDate);

  if (startDay === endDay) {
    return `${startDay}, ${startTime}–${endTime}`;
  }

  return `${startDay}, ${startTime} — ${endDay}, ${endTime}`;
}

export default async function EventDetailsPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug, slug } = await params;

  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const dict = getDictionary(lang);
  const basePath = cityBasePath(lang, citySlug);
  const event = await getApprovedEventBySlug(slug, city.id);

  if (!event) {
    notFound();
  }

  const dto: EventDetailsDto = mapEventDetailsToDto(event, lang);
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
        <SmartBackLink
          fallbackHref={`${basePath}/events`}
          label={dict.eventDetails.back}
        />
        <div className="detail-actions">
          <MemoryButtons
            compact
            entity="event"
            slug={dto.slug}
            name={dto.title}
            imageUrl={dto.imageUrl}
          />
          <ShareButton title={dto.title} />
        </div>
      </div>

      <ZoomableImage
        url={dto.imageUrl}
        alt={dto.title}
        className="place-image-hero"
        sizes="(max-width: 940px) 100vw, 900px"
        priority
      />

      <section className="hero">
        <p className="eyebrow">{dict.eventDetails.eyebrow}</p>
        <h1 className="hero-title">{dto.title}</h1>
        <EventStatusBadge
          status={eventStatus}
          lang={lang}
          wrapperClassName="hero-status"
        />
        <p className="hero-description">
          {dto.description ?? dict.common.descriptionFallback}
        </p>
      </section>

      <section className="details-section">
        <h2 className="section-title">{dict.eventDetails.detailsTitle}</h2>

        <div className="details-grid">
          <div>
            <strong>{dict.eventDetails.when}:</strong>{" "}
            {formatEventWhen(dto.startDate, dto.endDate, city.timezone, lang, dict)}
          </div>

          {formatAgeRange(dto.minAgeMonths, dto.maxAgeMonths, lang) ? (
            <div>
              <strong>{dict.eventCard.ageLabel}:</strong>{" "}
              {formatAgeRange(dto.minAgeMonths, dto.maxAgeMonths, lang)}
            </div>
          ) : null}

          <div>
            <strong>{dict.eventDetails.location}:</strong>{" "}
            {dto.locationName ?? dict.eventDetails.notSpecified}
          </div>

          <div>
            <strong>{dict.eventDetails.address}:</strong>{" "}
            {dto.address ?? dict.eventDetails.notSpecified}
            {dto.address ? (
              <>
                {" "}
                {/* адрес — не мёртвый текст: с него можно построить маршрут */}
                <a
                  className="map-link"
                  href={mapsSearchUrl(dto.address)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {dict.placeDetails.openInMaps} ↗
                </a>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="details-section">
        <h2 className="section-title">{dict.eventDetails.placeTitle}</h2>

        {dto.place ? (
          <Link href={`${basePath}/places/${dto.place.slug}`} className="linked-place">
            <span className="linked-place-label">{dict.eventDetails.placeLabel}</span>
            <span className="linked-place-name">{dto.place.name}</span>
          </Link>
        ) : (
          <p className="empty-text">{dict.eventDetails.noPlace}</p>
        )}
      </section>
    </main>
  );
}
