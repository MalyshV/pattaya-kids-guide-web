import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PlaceDetailsDto } from "@/dto/place-details.dto";
import { mapEventToDto } from "@/mappers/event.mapper";
import { mapPlaceDetailsToDto } from "@/mappers/place-details.mapper";
import { getUpcomingApprovedEventsByPlaceId } from "@/services/events.service";
import { getApprovedPlaceBySlug } from "@/services/places.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { computeOpenStatus, nowInCity } from "@/lib/schedule/open-status";
import { OpenStatusBadge } from "@/components/places/open-status-badge";
import { PlaceProgramCard } from "@/components/places/place-program-card";
import { FactValue } from "@/components/places/fact-value";
import {
  contactHref,
  isExternalContact,
  showsContactValue,
} from "@/lib/contacts/contact-link";
import { metaDescription } from "@/lib/seo/meta";
import { ru } from "@/content/ru";

type PageProps = {
  params: Promise<{ lang: string; city: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  const place = await getApprovedPlaceBySlug(slug, city.id);

  if (!place) {
    return {};
  }

  return {
    title: `${place.name} — ${ru.brand}`,
    description: metaDescription(place.description, ru.meta.description),
  };
}

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

const DAY_ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function formatPricingLine(price: {
  priceType: string;
  minPrice: number | null;
  maxPrice: number | null;
  currency: string;
}): string {
  if (price.priceType === "FREE") {
    return ru.placeDetails.priceFree;
  }

  const { minPrice, maxPrice, currency } = price;

  if (minPrice != null && maxPrice != null && minPrice !== maxPrice) {
    return `${minPrice}–${maxPrice} ${currency}`;
  }

  const value = minPrice ?? maxPrice;

  return value != null ? `${value} ${currency}` : ru.placeDetails.priceUnknown;
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
  const openStatus = computeOpenStatus(dto.schedules, city.timezone);
  const todayEnum = nowInCity(city.timezone).day;

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
        {openStatus.kind !== "unknown" ? (
          <div className="hero-status">
            <OpenStatusBadge status={openStatus} />
          </div>
        ) : null}
        <p className="hero-description">
          {dto.description ?? ru.common.descriptionFallback}
        </p>
      </section>

      <section className="details-section">
        <h2 className="section-title">{ru.placeDetails.addressTitle}</h2>
        <p className="empty-text">{dto.address}</p>
        <a
          className="map-link"
          href={
            // проверенная карточка места (фото/отзывы/часы) приоритетнее:
            // координаты открывают лишь голую метку на карте
            dto.googleMapsUrl ??
            `https://www.google.com/maps/search/?api=1&query=${dto.latitude},${dto.longitude}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {ru.placeDetails.openInMaps} <span aria-hidden="true">↗</span>
        </a>
      </section>

      {dto.contacts.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.contactsTitle}</h2>
          <div className="contacts-list">
            {dto.contacts.map((contact) => {
              const channel =
                (ru.placeDetails.contactChannels as Record<string, string>)[
                  contact.type
                ] ?? contact.type;
              const external = isExternalContact(contact.type);

              return (
                <a
                  key={contact.id}
                  className="contact-link"
                  href={contactHref(contact.type, contact.value)}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className="contact-channel">{channel}</span>
                  {showsContactValue(contact.type, contact.value) ? (
                    <span className="contact-value">{contact.value}</span>
                  ) : null}
                  {external ? (
                    <span className="contact-arrow" aria-hidden="true">
                      ↗
                    </span>
                  ) : null}
                </a>
              );
            })}
          </div>
        </section>
      )}

      {dto.schedules.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.scheduleTitle}</h2>
          <div className="schedule-list">
            {[...dto.schedules]
              .sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
              .map((schedule) => {
                const isToday = schedule.day === todayEnum;

                return (
                  <div
                    key={schedule.day}
                    className={`schedule-row${isToday ? " schedule-row-today" : ""}`}
                  >
                    <span className="schedule-day">
                      {(ru.placeDetails.days as Record<string, string>)[schedule.day] ??
                        schedule.day}
                      {isToday ? (
                        <span className="schedule-today-tag">
                          {ru.placeDetails.today}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={`schedule-hours${
                        schedule.isClosed ? " schedule-hours-closed" : ""
                      }`}
                    >
                      {schedule.isClosed
                        ? ru.placeDetails.closed
                        : `${schedule.openTime}–${schedule.closeTime}`}
                    </span>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {dto.pricing.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.pricingTitle}</h2>
          <div className="details-grid">
            {dto.pricing.map((price, index) => (
              <div key={index}>
                <strong>{ru.placeDetails.entryLabel}:</strong> {formatPricingLine(price)}
              </div>
            ))}
          </div>
        </section>
      )}

      {dto.programs.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.programsTitle}</h2>
          <div className="programs-list">
            {dto.programs.map((program) => (
              <PlaceProgramCard key={program.id} program={program} />
            ))}
          </div>
        </section>
      )}

      {dto.tips.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.tipsTitle}</h2>
          <div className="tips-list">
            {dto.tips.map((tip) => (
              <p key={tip.id} className="tip-item">
                {tip.text}
                {tip.verifiedAt ? (
                  <span className="tip-verified">
                    {" · "}
                    {ru.placeDetails.tipVerified(
                      tip.verifiedAt.toLocaleDateString("ru-RU", {
                        month: "long",
                        year: "numeric",
                      }),
                    )}
                  </span>
                ) : null}
              </p>
            ))}
          </div>
        </section>
      )}

      {dto.ageGroups.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.ageTitle}</h2>
          <div className="category-list">
            {dto.ageGroups.map((ageGroup) => (
              <span key={ageGroup.id} className="category-chip">
                {ageGroup.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {dto.amenities.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.amenitiesTitle}</h2>
          <div className="category-list">
            {dto.amenities.map((amenity) => (
              <span key={amenity.id} className="category-chip">
                {amenity.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {dto.staffLanguages.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.staffLanguagesTitle}</h2>
          <div className="category-list">
            {dto.staffLanguages.map((language) => (
              <span key={language.id} className="category-chip">
                {language.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {dto.birthdayInfo?.hasPackages && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.birthdayTitle}</h2>
          <p className="detail-text">{ru.placeDetails.birthdayHas}</p>
          {dto.birthdayInfo.notes ? (
            <p className="empty-text">{dto.birthdayInfo.notes}</p>
          ) : null}
        </section>
      )}

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
            <FactValue value={dto.hasFood} />
          </div>

          <div>
            <strong>{ru.placeDetails.fields.wifi}:</strong>{" "}
            <FactValue value={dto.hasWifi} />
          </div>

          <div>
            <strong>{ru.placeDetails.fields.airCon}:</strong>{" "}
            <FactValue value={dto.hasAirCon} />
          </div>

          <div>
            <strong>{ru.placeDetails.fields.parking}:</strong>{" "}
            <FactValue value={dto.hasParking} />
          </div>

          <div>
            <strong>{ru.placeDetails.fields.powerOutlets}:</strong>{" "}
            <FactValue value={dto.hasPowerOutlets} />
          </div>

          <div>
            <strong>{ru.placeDetails.fields.cafeSeating}:</strong>{" "}
            <FactValue
              value={dto.hasCafeSeating}
              yes={ru.common.affirmative}
              no={ru.common.negative}
            />
          </div>

          <div>
            <strong>{ru.placeDetails.fields.childDropOff}:</strong>{" "}
            <FactValue
              value={dto.canLeaveChild}
              yes={ru.common.affirmative}
              no={ru.common.negative}
            />
          </div>

          <div>
            <strong>{ru.placeDetails.fields.animals}:</strong>{" "}
            <FactValue value={dto.animalContact} />
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
