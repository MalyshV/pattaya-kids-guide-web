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
import { ShareButton } from "@/components/common/share-button";
import { OpenStatusBadge } from "@/components/places/open-status-badge";
import { PlaceProgramCard } from "@/components/places/place-program-card";
import { PlaceImage } from "@/components/places/place-image";
import { FactValue } from "@/components/places/fact-value";
import { fromAgeLabel } from "@/lib/age/format-age";
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

function currencySymbol(code: string): string {
  return code === "THB" ? "฿" : code;
}

/**
 * Сводка-чипы в шапке: возраст · вход от · можно оставить · сегодня до.
 * Лекарство от «простыни» — решающие факты видны без прокрутки. Чип без
 * данных честно пропускается, ничего не выдумываем.
 */
function buildSummaryChips(dto: PlaceDetailsDto, todayEnum: string): string[] {
  const chips: string[] = [];
  const s = ru.placeDetails.summary;

  if (dto.ageGroups.length === 1) {
    chips.push(dto.ageGroups[0].name);
  } else if (dto.ageGroups.length > 1) {
    const min = Math.min(...dto.ageGroups.map((g) => g.minAge));
    const max = Math.max(...dto.ageGroups.map((g) => g.maxAge));
    chips.push(s.ageRange(min, max));
  }

  const childPrices = dto.entryPrices
    .map((tier) => tier.childPrice)
    .filter((price): price is number => price != null);
  if (childPrices.length > 0) {
    const currency = currencySymbol(dto.entryPrices[0].currency);
    chips.push(s.entryFrom(`${Math.min(...childPrices)} ${currency}`));
  } else if (dto.pricing.length > 0) {
    const first = dto.pricing[0];
    if (first.priceType === "FREE") {
      chips.push(s.entryFree);
    } else if (first.minPrice != null) {
      chips.push(s.entryFrom(`${first.minPrice} ${currencySymbol(first.currency)}`));
    }
  }

  if (dto.canLeaveChild === true) {
    chips.push(
      dto.leaveChildFromMonths != null
        ? s.canLeaveFrom(fromAgeLabel(dto.leaveChildFromMonths))
        : s.canLeave,
    );
  }

  const todayHours = dto.schedules.filter(
    (schedule) => schedule.day === todayEnum && !schedule.isClosed,
  );
  if (todayHours.length > 0) {
    const lastClose = todayHours
      .map((schedule) => schedule.closeTime)
      .sort()
      .at(-1);
    if (lastClose) {
      chips.push(s.todayUntil(lastClose));
    }
  }

  return chips;
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
  const summaryChips = buildSummaryChips(dto, todayEnum);

  // Занятия (курсы/лагеря — ведут на свою страницу) отдельно от абонементов
  // (тарифы места), чтобы занятия не терялись под абонементами
  const activityPrograms = dto.programs.filter(
    (program) => program.type === "COURSE" || program.type === "CAMP",
  );
  const membershipPrograms = dto.programs.filter(
    (program) => program.type === "MEMBERSHIP",
  );

  // Порядок секций — «как родитель думает»: решаю (сводка/часы/цены/советы) →
  // планирую (занятия/абонементы/ДР) → углубляюсь (возраст/факты/язык) →
  // еду (адрес/контакты) → справка (категории/события).
  return (
    <main className="page-shell">
      <div className="back-link-wrapper">
        <Link href={basePath} className="back-link">
          {ru.placeDetails.back}
        </Link>
        <ShareButton title={dto.name} />
      </div>

      <PlaceImage url={dto.imageUrl} alt={dto.name} className="place-image-hero" />

      <section className="hero">
        <p className="eyebrow">{ru.placeDetails.eyebrow}</p>
        <h1 className="hero-title">{dto.name}</h1>
        {openStatus.kind !== "unknown" ? (
          <div className="hero-status">
            <OpenStatusBadge status={openStatus} />
          </div>
        ) : null}
        {summaryChips.length > 0 ? (
          <div className="hero-facts">
            {summaryChips.map((chip) => (
              <span key={chip} className="hero-fact-chip">
                {chip}
              </span>
            ))}
          </div>
        ) : null}
        <p className="hero-description">
          {dto.description ?? ru.common.descriptionFallback}
        </p>
      </section>

      {dto.photos.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.photosTitle}</h2>
          <div className="cover-gallery">
            {dto.photos.map((photo) => (
              <PlaceImage
                key={photo.id}
                url={photo.url}
                alt={photo.caption ?? dto.name}
              />
            ))}
          </div>
        </section>
      )}

      {dto.schedules.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.scheduleTitle}</h2>
          <div className="schedule-list">
            {[...dto.schedules]
              // по дню, затем по времени открытия — у дня может быть два
              // интервала (перерыв на обед), ключ поэтому day+openTime
              .sort(
                (a, b) =>
                  DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day) ||
                  a.openTime.localeCompare(b.openTime),
              )
              .map((schedule) => {
                const isToday = schedule.day === todayEnum;

                return (
                  <div
                    key={`${schedule.day}-${schedule.openTime}`}
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

      {(dto.pricing.length > 0 || dto.entryPrices.length > 0) && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.pricingTitle}</h2>

          {dto.pricing.length > 0 && (
            <div className="details-grid">
              {dto.pricing.map((price, index) => (
                <div key={index}>
                  <strong>{ru.placeDetails.entryLabel}:</strong>{" "}
                  {formatPricingLine(price)}
                </div>
              ))}
            </div>
          )}

          {dto.entryPrices.length > 0 && (
            <div className="entry-price-block">
              <h3 className="entry-price-title">{ru.placeDetails.entryTitle}</h3>
              <table className="entry-price-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>{ru.placeDetails.entryChild}</th>
                    <th>{ru.placeDetails.entryAdult}</th>
                  </tr>
                </thead>
                <tbody>
                  {dto.entryPrices.map((tier) => (
                    <tr key={tier.id}>
                      <th scope="row">{tier.label}</th>
                      <td>
                        {tier.childPrice != null
                          ? `${tier.childPrice} ${currencySymbol(tier.currency)}`
                          : "—"}
                      </td>
                      <td>
                        {tier.adultPrice != null
                          ? `${tier.adultPrice} ${currencySymbol(tier.currency)}`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dto.entryPriceNote ? (
                <p className="entry-price-note">{dto.entryPriceNote}</p>
              ) : null}
            </div>
          )}
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

      {activityPrograms.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.activitiesTitle}</h2>
          <div className="programs-list">
            {activityPrograms.map((program) => (
              <PlaceProgramCard key={program.id} program={program} basePath={basePath} />
            ))}
          </div>
        </section>
      )}

      {membershipPrograms.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.membershipsTitle}</h2>
          <div className="programs-list">
            {membershipPrograms.map((program) => (
              <PlaceProgramCard key={program.id} program={program} basePath={basePath} />
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
            {dto.canLeaveChild === true && dto.leaveChildFromMonths != null ? (
              fromAgeLabel(dto.leaveChildFromMonths)
            ) : (
              <FactValue
                value={dto.canLeaveChild}
                yes={ru.common.affirmative}
                no={ru.common.negative}
              />
            )}
          </div>

          <div>
            <strong>{ru.placeDetails.fields.animals}:</strong>{" "}
            <FactValue value={dto.animalContact} />
          </div>
        </div>

        {/* удобства-справочник в той же секции фактов (решение: не плодить секции) */}
        {dto.amenities.length > 0 && (
          <div className="category-list details-amenities">
            {dto.amenities.map((amenity) => (
              <span key={amenity.id} className="category-chip">
                {amenity.name}
              </span>
            ))}
          </div>
        )}
      </section>

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

      {eventDtos.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.upcomingTitle}</h2>
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
        </section>
      )}
    </main>
  );
}
