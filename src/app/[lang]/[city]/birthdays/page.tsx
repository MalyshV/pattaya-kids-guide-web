import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mapBirthdayPlaceToDto } from "@/mappers/birthday-place.mapper";
import { getBirthdayPlaces } from "@/services/places.service";
import { PlaceImage } from "@/components/places/place-image";
import { FactValue } from "@/components/places/fact-value";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import {
  contactHref,
  isExternalContact,
  showsContactValue,
} from "@/lib/contacts/contact-link";
import { ru } from "@/content/ru";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  return {
    title: `${ru.birthdays.metaTitle(city.name)} — ${ru.brand}`,
    description: ru.birthdays.heroDescription,
  };
}

/**
 * Лендинг «Дни рождения»: SEO-вход по самому дорогому запросу родителя и
 * витрина уникальных данных (пакеты с ценами собираются руками). Показывает
 * только площадки с подтверждённым фактом «проводят»; неизвестные условия
 * честно «уточняются».
 */
export default async function BirthdaysPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const basePath = cityBasePath(lang, citySlug);
  const places = await getBirthdayPlaces(city.id);
  const items = places.map(mapBirthdayPlaceToDto);

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{city.name}</p>
        <h1 className="hero-title">{ru.birthdays.heroTitle}</h1>
        <p className="hero-description">{ru.birthdays.heroDescription}</p>
      </section>

      {items.length === 0 ? (
        <section className="empty-state">
          <h3>{ru.birthdays.emptyTitle}</h3>
          <p>{ru.birthdays.emptyHint}</p>
        </section>
      ) : (
        <section className="birthday-list">
          {items.map((place) => (
            <article key={place.id} className="birthday-card interactive-surface">
              <PlaceImage url={place.imageUrl} alt={place.name} />

              <div className="birthday-card-body">
                <h2 className="birthday-card-title">
                  <Link
                    href={`${basePath}/places/${place.slug}`}
                    className="card-title-link"
                  >
                    {place.name}
                  </Link>
                </h2>
                {place.address ? (
                  <p className="birthday-card-address">{place.address}</p>
                ) : null}

                {place.notes ? (
                  <p className="birthday-card-notes">{place.notes}</p>
                ) : null}

                <div className="birthday-facts">
                  {place.minGuests != null ? (
                    <span className="birthday-fact">
                      <strong>{ru.birthdays.guestsLabel}</strong>{" "}
                      {place.maxGuests != null
                        ? ru.birthdays.guestsRange(place.minGuests, place.maxGuests)
                        : ru.birthdays.guestsFrom(place.minGuests)}
                    </span>
                  ) : null}
                  <span className="birthday-fact">
                    <strong>{ru.birthdays.depositLabel}</strong>{" "}
                    <FactValue
                      value={place.depositRequired}
                      yes={ru.birthdays.depositYes}
                      no={ru.birthdays.depositNo}
                    />
                  </span>
                  {place.preBookingDays != null ? (
                    <span className="birthday-fact">
                      <strong>{ru.birthdays.preBookLabel}</strong>{" "}
                      {ru.birthdays.preBookDays(place.preBookingDays)}
                    </span>
                  ) : null}
                </div>

                {place.contacts.length > 0 ? (
                  <div className="contacts-list">
                    {place.contacts.map((contact) => {
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
                          {...(external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
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
                ) : null}

                <div className="place-card-actions">
                  <Link
                    href={`${basePath}/places/${place.slug}`}
                    className="place-card-cta"
                  >
                    <span className="place-card-cta-text">{ru.birthdays.openPlace}</span>
                    <span className="place-card-cta-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
