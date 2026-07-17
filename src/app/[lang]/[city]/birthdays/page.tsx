import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mapBirthdayPlaceToDto } from "@/mappers/birthday-place.mapper";
import { getBirthdayPlaces } from "@/services/places.service";
import { PlaceImage } from "@/components/places/place-image";
import { MemoryButtons } from "@/components/memory/memory-buttons";
import { FactValue } from "@/components/places/fact-value";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import {
  contactHref,
  isExternalContact,
  showsContactValue,
} from "@/lib/contacts/contact-link";
import { getDictionary } from "@/content/dictionary";
import { localizedCityName } from "@/lib/i18n/localize";
import { listPageAlternates } from "@/lib/seo/meta";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
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
    alternates: listPageAlternates(lang, citySlug, "/birthdays"),
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
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const dict = getDictionary(lang);
  const basePath = cityBasePath(lang, citySlug);
  // шапка приносит сюда ?age= (сквозной контекст), но соседние разделы им
  // ФИЛЬТРУЮТ, а этот — нет: честно говорим об этом, а не молчим
  const resolvedSearchParams = (await searchParams) ?? {};
  const hasAgeParam = Boolean(resolvedSearchParams.age);
  const places = await getBirthdayPlaces(city.id);
  const items = places.map((place) => mapBirthdayPlaceToDto(place, lang));

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{localizedCityName(city, lang)}</p>
        <h1 className="hero-title">{dict.birthdays.heroTitle}</h1>
        <p className="hero-description">{dict.birthdays.heroDescription}</p>
        {hasAgeParam ? <p className="hero-note">{dict.birthdays.ageNote}</p> : null}
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
              {/* площадку ДР можно сохранить прямо с лендинга — раньше ♡ был
                  только в общем каталоге, обходной путь */}
              <MemoryButtons
                compact
                entity="place"
                slug={place.slug}
                name={place.name}
                imageUrl={place.imageUrl}
              />

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
                    {/* «уточняется» без следующего шага — тупик: подсказываем */}
                    {place.depositRequired === null ? (
                      <span className="value-unknown">
                        {" "}
                        {dict.birthdays.askOnBooking}
                      </span>
                    ) : null}
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
                    // #birthday — сразу к ДР-блоку места, а не в начало
                    // длинной страницы с повтором уже прочитанного
                    href={`${basePath}/places/${place.slug}#birthday`}
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
