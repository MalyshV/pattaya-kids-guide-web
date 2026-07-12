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
import { ZoomableImage } from "@/components/common/zoomable-image";
import { FactValue } from "@/components/places/fact-value";
import { fromAgeLabel } from "@/lib/age/format-age";
import {
  contactHref,
  isExternalContact,
  showsContactValue,
} from "@/lib/contacts/contact-link";
import { articleOpenGraph, metaDescription } from "@/lib/seo/meta";
import { dateLocale, getDictionary, type Dictionary } from "@/content/dictionary";

type PageProps = {
  params: Promise<{ lang: string; city: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  const place = await getApprovedPlaceBySlug(slug, city.id);

  if (!place) {
    return {};
  }

  const dict = getDictionary(lang);
  const title = `${place.name} — ${dict.brand}`;
  const description = metaDescription(place.description, dict.meta.description);

  return {
    title,
    description,
    openGraph: articleOpenGraph({
      title,
      description,
      siteName: dict.brand,
      path: `${cityBasePath(lang, citySlug)}/places/${slug}`,
      imageUrl: place.imageUrl,
      lang,
    }),
  };
}

function formatShortDate(value: string | Date | null, lang: string): string {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  return date.toLocaleDateString(dateLocale(lang), {
    day: "numeric",
    month: "short",
  });
}

const DAY_ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function formatPricingLine(
  price: {
    priceType: string;
    minPrice: number | null;
    maxPrice: number | null;
    currency: string;
  },
  dict: Dictionary,
): string {
  if (price.priceType === "FREE") {
    return dict.placeDetails.priceFree;
  }

  const { minPrice, maxPrice, currency } = price;

  if (minPrice != null && maxPrice != null && minPrice !== maxPrice) {
    return `${minPrice}–${maxPrice} ${currency}`;
  }

  const value = minPrice ?? maxPrice;

  return value != null ? `${value} ${currency}` : dict.placeDetails.priceUnknown;
}

function currencySymbol(code: string): string {
  return code === "THB" ? "฿" : code;
}

/**
 * Сводка-чипы в шапке: возраст · вход от · можно оставить · сегодня до.
 * Лекарство от «простыни» — решающие факты видны без прокрутки. Чип без
 * данных честно пропускается, ничего не выдумываем.
 */
function buildSummaryChips(
  dto: PlaceDetailsDto,
  todayEnum: string,
  lang: string,
  dict: Dictionary,
): string[] {
  const chips: string[] = [];
  const s = dict.placeDetails.summary;

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
        ? s.canLeaveFrom(fromAgeLabel(dto.leaveChildFromMonths, lang))
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

  const dict = getDictionary(lang);
  const basePath = cityBasePath(lang, citySlug);
  const place = await getApprovedPlaceBySlug(slug, city.id);

  if (!place) {
    notFound();
  }

  const events = await getUpcomingApprovedEventsByPlaceId(place.id);
  const eventDtos = events.map((event) => mapEventToDto(event, lang));
  const dto: PlaceDetailsDto = mapPlaceDetailsToDto(place, lang);
  const openStatus = computeOpenStatus(dto.schedules, city.timezone);
  const todayEnum = nowInCity(city.timezone).day;
  const summaryChips = buildSummaryChips(dto, todayEnum, lang, dict);

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
          {dict.placeDetails.back}
        </Link>
        <ShareButton title={dto.name} />
      </div>

      <ZoomableImage
        url={dto.imageUrl}
        alt={dto.name}
        className="place-image-hero"
        sizes="(max-width: 940px) 100vw, 900px"
      />

      <section className="hero">
        <p className="eyebrow">{dict.placeDetails.eyebrow}</p>
        <h1 className="hero-title">{dto.name}</h1>
        {openStatus.kind !== "unknown" ? (
          <div className="hero-status">
            <OpenStatusBadge status={openStatus} lang={lang} />
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
          {dto.description ?? dict.common.descriptionFallback}
        </p>
      </section>

      {dto.photos.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{dict.placeDetails.photosTitle}</h2>
          <div className="cover-gallery">
            {dto.photos.map((photo) => (
              <ZoomableImage
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
          <h2 className="section-title">{dict.placeDetails.scheduleTitle}</h2>
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
                      {(dict.placeDetails.days as Record<string, string>)[schedule.day] ??
                        schedule.day}
                      {isToday ? (
                        <span className="schedule-today-tag">
                          {dict.placeDetails.today}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={`schedule-hours${
                        schedule.isClosed ? " schedule-hours-closed" : ""
                      }`}
                    >
                      {schedule.isClosed
                        ? dict.placeDetails.closed
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
          <h2 className="section-title">{dict.placeDetails.pricingTitle}</h2>

          {dto.pricing.length > 0 && (
            <div className="details-grid">
              {dto.pricing.map((price, index) => (
                <div key={index}>
                  <strong>{dict.placeDetails.entryLabel}:</strong>{" "}
                  {formatPricingLine(price, dict)}
                </div>
              ))}
            </div>
          )}

          {dto.entryPrices.length > 0 && (
            <div className="entry-price-block">
              <h3 className="entry-price-title">{dict.placeDetails.entryTitle}</h3>
              <table className="entry-price-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>{dict.placeDetails.entryChild}</th>
                    <th>{dict.placeDetails.entryAdult}</th>
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
          <h2 className="section-title">{dict.placeDetails.tipsTitle}</h2>
          <div className="tips-list">
            {dto.tips.map((tip) => (
              <p key={tip.id} className="tip-item">
                {tip.text}
                {tip.verifiedAt ? (
                  <span className="tip-verified">
                    {" · "}
                    {dict.placeDetails.tipVerified(
                      tip.verifiedAt.toLocaleDateString(dateLocale(lang), {
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
          <h2 className="section-title">{dict.placeDetails.activitiesTitle}</h2>
          <div className="programs-list">
            {activityPrograms.map((program) => (
              <PlaceProgramCard key={program.id} program={program} basePath={basePath} />
            ))}
          </div>
        </section>
      )}

      {membershipPrograms.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{dict.placeDetails.membershipsTitle}</h2>
          <div className="programs-list">
            {membershipPrograms.map((program) => (
              <PlaceProgramCard key={program.id} program={program} basePath={basePath} />
            ))}
          </div>
        </section>
      )}

      {dto.birthdayInfo?.hasPackages && (
        <section className="details-section">
          <h2 className="section-title">{dict.placeDetails.birthdayTitle}</h2>
          <p className="detail-text">{dict.placeDetails.birthdayHas}</p>
          {dto.birthdayInfo.notes ? (
            <p className="empty-text">{dto.birthdayInfo.notes}</p>
          ) : null}
          <Link href={`${basePath}/birthdays`} className="map-link">
            {dict.placeDetails.birthdayAllLink} <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}

      {dto.ageGroups.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{dict.placeDetails.ageTitle}</h2>
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
        <h2 className="section-title">{dict.placeDetails.detailsTitle}</h2>

        <div className="details-grid">
          <div>
            <strong>{dict.placeDetails.fields.type}:</strong>{" "}
            {[
              dto.indoor && dict.places.badgeIndoor,
              dto.outdoor && dict.places.badgeOutdoor,
            ]
              .filter(Boolean)
              .join(", ") || dict.common.no}
          </div>

          <div>
            <strong>{dict.placeDetails.fields.food}:</strong>{" "}
            <FactValue value={dto.hasFood} lang={lang} />
          </div>

          <div>
            <strong>{dict.placeDetails.fields.wifi}:</strong>{" "}
            <FactValue value={dto.hasWifi} lang={lang} />
          </div>

          <div>
            <strong>{dict.placeDetails.fields.airCon}:</strong>{" "}
            <FactValue value={dto.hasAirCon} lang={lang} />
          </div>

          <div>
            <strong>{dict.placeDetails.fields.parking}:</strong>{" "}
            <FactValue value={dto.hasParking} lang={lang} />
          </div>

          <div>
            <strong>{dict.placeDetails.fields.powerOutlets}:</strong>{" "}
            <FactValue value={dto.hasPowerOutlets} lang={lang} />
          </div>

          <div>
            <strong>{dict.placeDetails.fields.cafeSeating}:</strong>{" "}
            <FactValue
              value={dto.hasCafeSeating}
              lang={lang}
              yes={dict.common.affirmative}
              no={dict.common.negative}
            />
          </div>

          <div>
            <strong>{dict.placeDetails.fields.childDropOff}:</strong>{" "}
            {dto.canLeaveChild === true && dto.leaveChildFromMonths != null ? (
              fromAgeLabel(dto.leaveChildFromMonths, lang)
            ) : (
              <FactValue
                value={dto.canLeaveChild}
                lang={lang}
                yes={dict.common.affirmative}
                no={dict.common.negative}
              />
            )}
          </div>

          <div>
            <strong>{dict.placeDetails.fields.animals}:</strong>{" "}
            <FactValue value={dto.animalContact} lang={lang} />
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
          <h2 className="section-title">{dict.placeDetails.staffLanguagesTitle}</h2>
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
        <h2 className="section-title">{dict.placeDetails.addressTitle}</h2>
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
          {dict.placeDetails.openInMaps} <span aria-hidden="true">↗</span>
        </a>
      </section>

      {dto.contacts.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">{dict.placeDetails.contactsTitle}</h2>
          <div className="contacts-list">
            {dto.contacts.map((contact) => {
              const channel =
                (dict.placeDetails.contactChannels as Record<string, string>)[
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
          <h2 className="section-title">{dict.placeDetails.categoriesTitle}</h2>

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
          <h2 className="section-title">{dict.placeDetails.upcomingTitle}</h2>
          <div className="events-list">
            {eventDtos.map((event) => (
              <Link
                key={event.id}
                href={`${basePath}/events/${event.slug}`}
                className="event-inline"
              >
                <div className="event-inline-title">{event.title}</div>
                <div className="event-inline-date">
                  {formatShortDate(event.startDate, lang)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
