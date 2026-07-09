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
import { getDictionary } from "@/content/dictionary";
import { localizedCityName } from "@/lib/i18n/localize";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  const dict = getDictionary(lang);

  return {
    title: `${dict.birthdays.metaTitle(localizedCityName(city, lang))} — ${dict.brand}`,
    description: dict.birthdays.heroDescription,
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

  const dict = getDictionary(lang);
  const basePath = cityBasePath(lang, citySlug);
  const places = await getBirthdayPlaces(city.id);
  const items = places.map((place) => mapBirthdayPlaceToDto(place, lang));

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{localizedCityName(city, lang)}</p>
        <h1 className="hero-title">{dict.birthdays.heroTitle}</h1>
        <p className="hero-description">{dict.birthdays.heroDescription}</p>
      </section>

      {items.length === 0 ? (
        <section className="empty-state">
          <h3>{dict.birthdays.emptyTitle}</h3>
          <p>{dict.birthdays.emptyHint}</p>
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
                      <strong>{dict.birthdays.guestsLabel}</strong>{" "}
                      {place.maxGuests != null
                        ? dict.birthdays.guestsRange(place.minGuests, place.maxGuests)
                        : dict.birthdays.guestsFrom(place.minGuests)}
                    </span>
                  ) : null}
                  <span className="birthday-fact">
                    <strong>{dict.birthdays.depositLabel}</strong>{" "}
                    <FactValue
                      value={place.depositRequired}
                      lang={lang}
                      yes={dict.birthdays.depositYes}
                      no={dict.birthdays.depositNo}
                    />
                  </span>
                  {place.preBookingDays != null ? (
                    <span className="birthday-fact">
                      <strong>{dict.birthdays.preBookLabel}</strong>{" "}
                      {dict.birthdays.preBookDays(place.preBookingDays)}
                    </span>
                  ) : null}
                </div>

                {place.contacts.length > 0 ? (
                  <div className="contacts-list">
                    {place.contacts.map((contact) => {
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
                    <span className="place-card-cta-text">
                      {dict.birthdays.openPlace}
                    </span>
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
