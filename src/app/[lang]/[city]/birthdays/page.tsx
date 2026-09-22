import Link from "next/link";
import { SuggestLink } from "@/components/suggest/suggest-link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mapBirthdayPlaceToDto } from "@/mappers/birthday-place.mapper";
import { getBirthdayPlaces } from "@/services/places.service";
import { PlaceImage } from "@/components/places/place-image";
import { MemoryButtons } from "@/components/memory/memory-buttons";
import { FactValue } from "@/components/places/fact-value";
import { PlacesMap, type PlaceMapMarker } from "@/components/places/places-map";
import { ViewToggle } from "@/components/common/view-toggle";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import {
  contactHref,
  isExternalContact,
  showsContactValue,
} from "@/lib/contacts/contact-link";
import { getDictionary } from "@/content/dictionary";
import { localizedCityName } from "@/lib/i18n/localize";
import { pageAlternates } from "@/lib/seo/meta";
import { getSingleSearchParam } from "@/lib/params/search-params";
import { parseListView, viewHref } from "@/lib/params/view-href";

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
    // бренд-суффикс добавит template из [lang]/layout
    title: dict.birthdays.metaTitle(localizedCityName(city, lang)),
    description: dict.birthdays.heroDescription,
    alternates: pageAlternates(lang, citySlug, "/birthdays"),
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

  // ?view=map — те же площадки на карте; ?age= (сквозной из шапки) сохраняем
  const view = parseListView(getSingleSearchParam(resolvedSearchParams.view));
  const listPath = `${basePath}/birthdays`;
  const listParams = { age: getSingleSearchParam(resolvedSearchParams.age) };
  const mapMarkers: PlaceMapMarker[] = items
    .filter(
      (place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude),
    )
    .map((place) => ({
      id: place.id,
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      // сразу к ДР-блоку места, как кнопка «Страница места» в карточке
      href: `${basePath}/places/${place.slug}#birthday`,
      imageUrl: place.imageUrl,
    }));

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{localizedCityName(city, lang)}</p>
        <h1 className="hero-title">{dict.birthdays.heroTitle}</h1>
        <p className="hero-description">{dict.birthdays.heroDescription}</p>
        {hasAgeParam ? <p className="hero-note">{dict.birthdays.ageNote}</p> : null}
      </section>

      {/* «Список | Карта» и «Предложить своё» — одной строкой: шапки списка
          с заголовком здесь нет (h2 заняты карточками площадок) */}
      <div className="list-toolbar">
        {items.length > 0 ? (
          <ViewToggle
            view={view}
            listHref={viewHref(listPath, listParams, "list")}
            mapHref={viewHref(listPath, listParams, "map")}
            labels={{
              list: dict.places.viewList,
              map: dict.places.viewMap,
              aria: dict.places.viewToggleAria,
            }}
          />
        ) : (
          <span />
        )}
        <SuggestLink basePath={basePath} kind="birthday" label={dict.suggest.cta} />
      </div>

      {items.length === 0 ? (
        <section className="empty-state">
          <h3>{dict.birthdays.emptyTitle}</h3>
          <p>{dict.birthdays.emptyHint}</p>
        </section>
      ) : view === "map" ? (
        <PlacesMap
          markers={mapMarkers}
          userPoint={null}
          basePath={basePath}
          regionLabel={dict.birthdays.mapRegionLabel}
        />
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
                            <>
                              <span className="contact-arrow" aria-hidden="true">
                                ↗
                              </span>
                              <span className="sr-only">
                                {" "}
                                {dict.common.opensInNewTab}
                              </span>
                            </>
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
