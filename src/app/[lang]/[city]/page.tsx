import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  LandingHero,
  type LandingActivityKindDto,
  type LandingDistrictDto,
  type LandingQuickDto,
  type LandingQuickKey,
} from "@/components/landing/landing-hero";
import {
  LandingSections,
  type LandingSectionDto,
} from "@/components/landing/landing-sections";
import { LandingSoon } from "@/components/landing/landing-soon";
import { PlaceCard } from "@/components/places/place-card";
import { mapEventListItemToDto } from "@/mappers/event.mapper";
import { LazyMount } from "@/components/common/lazy-mount";
import { PlacesMap, type MapDistrict } from "@/components/places/places-map";
import { JsonLd } from "@/components/seo/json-ld";
import { websiteJsonLd } from "@/lib/seo/json-ld";
import { getAllApprovedPlaces, getBirthdayPlaces } from "@/services/places.service";
import { getSearchRows } from "@/services/search.service";
import { getCityEvents } from "@/services/events.service";
import { getCityActivities } from "@/services/activities.service";
import {
  activityToMapPoint,
  eventToMapPoint,
  placeToMapPoint,
} from "@/mappers/map-point.mapper";
import { mapPlaceToListItemDto } from "@/mappers/place.mapper";
import { closureKind, computePlaceStatus } from "@/lib/places/closure";
import type { MapPointDto, MapPointKind } from "@/dto/map-point.dto";
import { computeEventStatus } from "@/lib/events/event-lifecycle";
import { isActivityActive } from "@/lib/activities/activity-sort";
import { cityBasePath, getCityBySlug, getSiteUrl } from "@/lib/geo/city";
import { getCityDistrictDefinitions } from "@/lib/districts/city-districts";
import { countByDistrict, placeDistrictSlug } from "@/lib/districts/place-district";
import {
  activityDistrictSlug,
  eventDistrictSlug,
  meanPoint,
  type GeoPosition,
} from "@/lib/districts/district-page";
import { placeDistrictMap } from "@/lib/districts/district-facet";
import { pickLocalized } from "@/lib/i18n/localize";
import { toDistrictDto } from "@/mappers/district.mapper";
import {
  isGoNowStatus,
  nowInCity,
  isMorningTomorrow,
  opensEarlyNextMorning,
} from "@/lib/schedule/open-status";
import {
  eligibleScenarios,
  isShelterPlace,
  isWorkFriendlyPlace,
  isWeekendDay,
  landingSlot,
  scenarioPriority,
  type LandingSlot,
  type ScenarioKey,
} from "@/lib/landing/scenarios";
import { getDictionary } from "@/content/dictionary";
import { pageAlternates } from "@/lib/seo/meta";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: {
  params: PageProps["params"];
}): Promise<Metadata> {
  const { lang, city: citySlug } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.landing.metaTitle,
    // self-canonical корня города; бренд-суффикс добавляет template
    alternates: pageAlternates(lang, citySlug, ""),
  };
}

/** Параметры каталога: старые расшаренные ссылки на корень города с
 *  фильтрами тихо уводим в каталог, не показывая посадочную с «мёртвым» query. */
const CATALOG_PARAMS = new Set([
  "age",
  "visited",
  "view",
  "page",
  "near",
  "openNow",
  "openMorning",
  "workFriendly",
  "shelter",
  "indoor",
  "outdoor",
  "hasFood",
  "hasWifi",
  "hasAirCon",
  "hasParking",
  "canLeaveChild",
  "animalContact",
  "district",
]);

export default async function CityLandingPage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  const basePath = cityBasePath(lang, citySlug);
  const listPath = `${basePath}/places`;

  // старые ссылки с фильтрами (?openNow=…&age=…) — сразу в каталог с ними же
  const catalogQuery = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    const single = Array.isArray(value) ? value[0] : value;
    if (single != null && CATALOG_PARAMS.has(key)) {
      catalogQuery.set(key, single);
    }
  }
  if (catalogQuery.size > 0) {
    redirect(`${listPath}?${catalogQuery.toString()}`);
  }

  const city = await getCityBySlug(citySlug);
  if (!city) {
    notFound();
  }

  const dict = getDictionary(lang);

  // Слот времени и порог честности: сценарий мест показывается, только если
  // под ним достаточно карточек — красивый ответ с пустой выдачей хуже, чем
  // ответ попроще. Каталог маленький, считаем по одному запросу в памяти.
  // getSearchRows/getBirthdayPlaces кэшированы (layout уже звал первый) —
  // лишних кругов до базы нет.
  const [places, searchRows, birthdayPlaces, cityEvents, cityActivities] =
    await Promise.all([
      getAllApprovedPlaces({}, city.id),
      getSearchRows(city.id),
      getBirthdayPlaces(city.id),
      getCityEvents(city.id),
      getCityActivities(city.id),
    ]);
  const now = nowInCity(city.timezone);
  const slot: LandingSlot = landingSlot(now.minutes);
  // абсолютный момент для жизненного цикла событий/лагерей на карте
  // (startDate/endDate — абсолютные, пояс города тут не нужен)
  const nowDate = new Date();

  const workingPlaces = places.filter((place) => closureKind(place) === null);
  const counts: Partial<Record<ScenarioKey, number>> = {
    // закрытые на время/насовсем в сценарии не считаем (на карте — остаются)
    openNow: places.filter((place) =>
      isGoNowStatus(computePlaceStatus(place, place.schedules, city.timezone)),
    ).length,
    openMorning: workingPlaces.filter((place) =>
      opensEarlyNextMorning(place.schedules, city.timezone),
    ).length,
    workFriendly: workingPlaces.filter(isWorkFriendlyPlace).length,
    shelter: workingPlaces.filter(isShelterPlace).length,
  };

  // разделы: пустая афиша/ДР/занятия не обещаются (порог 1 в ядре)
  const sectionCounts: Partial<Record<ScenarioKey, number>> = {
    events: searchRows.events.length,
    birthdays: birthdayPlaces.length,
    age: searchRows.activities.length,
  };

  const priority = scenarioPriority(slot, isWeekendDay(now.day));
  const pool = eligibleScenarios(priority, counts, sectionCounts);

  const scenarioHrefs: Record<ScenarioKey, { href: string; needsAge?: boolean }> = {
    age: { href: `${basePath}/activities`, needsAge: true },
    workFriendly: { href: `${listPath}?workFriendly=true` },
    openMorning: { href: `${listPath}?openMorning=true` },
    openNow: { href: `${listPath}?openNow=true` },
    shelter: { href: `${listPath}?shelter=true` },
    events: { href: `${basePath}/events` },
    birthdays: { href: `${basePath}/birthdays` },
    near: { href: `${listPath}?near=true` },
  };

  // Сценарии мест в одно касание под предложением-фильтром: тот же пул, что
  // прошёл порог честности и подходит ко времени суток. Разделы (афиша, ДР,
  // занятия) в строку кнопок не идут — у них своя строка разделов ниже.
  const quickKeys = new Set<ScenarioKey>([
    "openNow",
    "openMorning",
    "workFriendly",
    "shelter",
    "near",
  ]);
  const quick: LandingQuickDto[] = pool
    .filter((key) => quickKeys.has(key))
    .map((key) => ({ key: key as LandingQuickKey, href: scenarioHrefs[key].href }));

  // «Открыто сейчас»: три места, куда можно пойти в эту минуту; с фото — вперёд
  const openNowCards = places
    .map((place) => ({
      place,
      status: computePlaceStatus(place, place.schedules, city.timezone),
    }))
    .filter(({ status }) => isGoNowStatus(status))
    .sort((a, b) => Number(Boolean(b.place.imageUrl)) - Number(Boolean(a.place.imageUrl)))
    .slice(0, 3);

  // районы для предложения: только те, где есть места. По-русски у района
  // своя форма «где?» (предлог и падеж разные), в остальных языках — шаблон.
  const districtDefinitions = getCityDistrictDefinitions(citySlug);
  const districtCounts = countByDistrict(
    places.map((place) => placeDistrictSlug(place, districtDefinitions)),
    districtDefinitions,
  ).map(({ district, count }) => ({
    ...toDistrictDto(district, lang),
    locativeRu: district.locativeRu,
    count,
  }));
  // Район в предложении есть у мест, занятий и событий — у каждого раздела
  // свой счёт: занятие и событие при месте наследуют его район, как в их
  // каталогах. В списке остаются районы, где есть хоть что-то.
  const placeDistricts = placeDistrictMap(places, districtDefinitions);
  const countsBySlug = (slugs: Array<string | null>): Map<string, number> =>
    new Map(
      countByDistrict(slugs, districtDefinitions).map(({ district, count }) => [
        district.slug,
        count,
      ]),
    );
  const placeCounts = countsBySlug([...placeDistricts.values()]);
  const activityCounts = countsBySlug(
    cityActivities.map((activity) =>
      activityDistrictSlug(activity, placeDistricts, districtDefinitions),
    ),
  );
  const eventCounts = countsBySlug(
    cityEvents.map((event) =>
      eventDistrictSlug(event, placeDistricts, districtDefinitions),
    ),
  );
  const sentenceDistricts: LandingDistrictDto[] = [...districtDefinitions]
    .sort((a, b) => a.order - b.order)
    .map((definition) => {
      const { slug, name } = toDistrictDto(definition, lang);
      return {
        slug,
        // по-русски у района своя форма «где?», в остальных языках — шаблон
        phrase:
          lang === "ru" && definition.locativeRu
            ? definition.locativeRu
            : dict.landing.sentence.inDistrict(name),
        optionLabel: name,
        counts: {
          places: placeCounts.get(slug) ?? 0,
          activities: activityCounts.get(slug) ?? 0,
          events: eventCounts.get(slug) ?? 0,
        },
      };
    })
    .filter(({ counts }) => counts.places + counts.activities + counts.events > 0);

  // Вид занятия в предложении — те же виды и в том же порядке, что чипы
  // каталога занятий; в предложении слово пишется со строчной.
  const kindMap = new Map<string, LandingActivityKindDto & { order: number }>();
  for (const activity of cityActivities) {
    for (const link of activity.categories) {
      const known = kindMap.get(link.category.slug);
      if (known) {
        known.count += 1;
        continue;
      }
      const name = pickLocalized(
        link.category.name,
        link.category.nameEn,
        link.category.nameTh,
        lang,
      );
      kindMap.set(link.category.slug, {
        slug: link.category.slug,
        phrase: name.toLocaleLowerCase(lang),
        optionLabel: name,
        count: 1,
        order: link.category.order,
      });
    }
  }
  const activityKinds: LandingActivityKindDto[] = [...kindMap.values()]
    .sort((a, b) => a.order - b.order)
    .map(({ slug, phrase, optionLabel, count }) => ({
      slug,
      phrase,
      optionLabel,
      count,
    }));

  // районы для карты: под курсором или пальцем район подсвечивается, в нём
  // появляется подпись-ссылка на его страницу. Якорь подписи — среднее по
  // местам района: там, где в нём есть что смотреть.
  const placesByDistrict = new Map<string, GeoPosition[]>();
  for (const place of places) {
    const slug = placeDistrictSlug(place, districtDefinitions);
    if (slug && Number.isFinite(place.latitude) && Number.isFinite(place.longitude)) {
      const position = { latitude: place.latitude, longitude: place.longitude };
      placesByDistrict.set(slug, [...(placesByDistrict.get(slug) ?? []), position]);
    }
  }
  const mapDistricts: MapDistrict[] = districtCounts.flatMap((district) => {
    const anchor = meanPoint(placesByDistrict.get(district.slug) ?? []);
    const definition = districtDefinitions.find((item) => item.slug === district.slug);
    return anchor && definition
      ? [
          {
            id: district.slug,
            name: district.name,
            hint: dict.places.count(district.count),
            href: `${basePath}/districts/${district.slug}`,
            latitude: anchor.latitude,
            longitude: anchor.longitude,
            boundary: definition.boundary.map(
              ([latitude, longitude]): [number, number] => [latitude, longitude],
            ),
          },
        ]
      : [];
  });

  // ближайшие события: идущие и предстоящие, по дате начала
  const liveEvents = cityEvents.filter(
    (event) =>
      computeEventStatus(
        new Date(event.startDate),
        event.endDate ? new Date(event.endDate) : null,
        nowDate,
      ) !== "past",
  );
  const soonEvents = [...liveEvents]
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3)
    .map((event) => mapEventListItemToDto(event, lang));

  const activeActivitiesCount = cityActivities.filter((activity) =>
    isActivityActive(activity, nowDate),
  ).length;
  const sections: LandingSectionDto[] = [
    {
      key: "places",
      href: listPath,
      title: dict.nav.places,
      label: dict.places.count(places.length),
      hint: dict.landing.sections.placesHint,
    },
    {
      key: "events",
      href: `${basePath}/events`,
      title: dict.nav.events,
      // пустая афиша — не «0 событий», а спокойная подпись раздела
      label:
        liveEvents.length > 0
          ? dict.events.count(liveEvents.length)
          : dict.landing.allEvents,
      hint: dict.landing.sections.eventsHint,
    },
    {
      key: "activities",
      href: `${basePath}/activities`,
      title: dict.nav.activities,
      label: dict.activities.count(activeActivitiesCount),
      hint: dict.landing.sections.activitiesHint,
    },
    {
      key: "birthdays",
      href: `${basePath}/birthdays`,
      title: dict.nav.birthdays,
      label: dict.landing.sections.birthdaysLabel,
      hint: dict.landing.sections.birthdaysHint,
    },
  ];

  // Единая карта ниже сгиба (первый экран свят — карту «просто так» не видно;
  // «посмотреть на карте» под предложением ведёт не сюда, а в каталог с теми
  // же фильтрами в виде карты). Все три типа точек —
  // места (терракота), события (янтарь), занятия (шалфей); координаты берут
  // мапперы (событие/занятие — у своей точки ИЛИ у связанного места).
  const placePoints: MapPointDto[] = places
    .filter(
      (place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude),
    )
    .map((place) => placeToMapPoint(mapPlaceToListItemDto(place, lang), basePath, lang));
  // прошедшие события и завершённые лагеря на карту не ставим: пин, в отличие
  // от карточки, не несёт бейджа статуса — живой янтарный/шалфейный пин вёл бы
  // на «прошло». COURSE вечнозелёные, места и ongoing/upcoming — остаются.
  const eventPoints = liveEvents
    .map((event) => eventToMapPoint(event, basePath, lang))
    .filter((point): point is MapPointDto => point !== null);
  const activityPoints = cityActivities
    .filter((activity) => isActivityActive(activity, nowDate))
    .map((activity) => activityToMapPoint(activity, basePath, lang))
    .filter((point): point is MapPointDto => point !== null);

  const mapPoints: MapPointDto[] = [...placePoints, ...eventPoints, ...activityPoints];
  // легенда показывает только реально присутствующие типы (порядок постоянный)
  const presentKinds: MapPointKind[] = (
    ["place", "event", "activity"] as MapPointKind[]
  ).filter((kind) => mapPoints.some((point) => point.kind === kind));

  return (
    <main className="page-shell landing-shell">
      {/* WebSite (имя сайта для выдачи) живёт на корне города. Без
          SearchAction: поиск клиентский, URL результатов не существует */}
      <JsonLd
        data={websiteJsonLd({ name: dict.brand, url: getSiteUrl(), inLanguage: lang })}
      />
      {/* первый экран — предложение-фильтр и сценарии в одно касание */}
      <LandingHero
        basePath={basePath}
        listPath={listPath}
        quick={quick}
        districts={sentenceDistricts}
        activityKinds={activityKinds}
        morningTomorrow={isMorningTomorrow(city.timezone)}
        hasOpenNow={(counts.openNow ?? 0) > 0}
      />

      <LandingSections ariaLabel={dict.nav.sectionsAria} sections={sections} />

      {openNowCards.length > 0 ? (
        <section className="landing-block">
          <div className="landing-block-header">
            <h2 className="landing-block-title">{dict.landing.openNowTitle}</h2>
            <Link href={`${listPath}?openNow=true`} className="landing-more-link">
              {dict.landing.allPlaces}
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
          <div className="places-grid">
            {openNowCards.map(({ place, status }) => (
              <PlaceCard
                key={place.id}
                place={mapPlaceToListItemDto(place, lang, districtDefinitions)}
                basePath={basePath}
                status={status}
                schedules={place.schedules.map((schedule) => ({
                  day: schedule.day,
                  openTime: schedule.openTime,
                  closeTime: schedule.closeTime,
                  isClosed: schedule.isClosed,
                }))}
                timezone={city.timezone}
              />
            ))}
          </div>
        </section>
      ) : null}

      {soonEvents.length > 0 ? (
        <section className="landing-block landing-soon">
          <div className="landing-soon-intro">
            <h2 className="landing-block-title">{dict.landing.soonTitle}</h2>
            <p className="landing-soon-hint">{dict.landing.soonHint}</p>
            <Link href={`${basePath}/events`} className="landing-more-link">
              {dict.landing.allEvents}
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
          <LandingSoon
            events={soonEvents}
            basePath={basePath}
            lang={lang}
            timezone={city.timezone}
          />
        </section>
      ) : null}

      {/* карта; Leaflet монтируется только при приближении.
          Без aria-label: внутри PlacesMap уже есть region «Карта мест»,
          второй почти одноимённый ориентир только путал бы скринридер */}
      <section id="map" className="landing-block landing-map">
        <p className="eyebrow">{dict.landing.mapEyebrow}</p>
        <h2 className="landing-block-title landing-map-title">{dict.landing.mapTitle}</h2>
        {mapDistricts.length > 0 ? (
          <p className="landing-map-hint">{dict.landing.mapDistrictHint}</p>
        ) : null}
        <LazyMount>
          <PlacesMap
            markers={mapPoints}
            userPoint={null}
            basePath={basePath}
            legendKinds={presentKinds}
            hoverDistricts={mapDistricts}
          />
        </LazyMount>
      </section>

      {/* «Где жить с детьми?» — районы с числом мест; каждый открывает
          страницу района: всё, что в нём есть, списком и на карте */}
      {districtCounts.length > 0 ? (
        <section className="landing-block landing-districts">
          <div className="landing-districts-intro">
            <h2 className="landing-block-title">{dict.landing.districtsTitle}</h2>
            <p className="landing-soon-hint">{dict.landing.districtsHint}</p>
          </div>
          <ul className="landing-districts-list">
            {districtCounts.map((district) => (
              <li key={district.slug}>
                <Link
                  href={`${basePath}/districts/${district.slug}`}
                  className="landing-district"
                >
                  <span className="landing-district-name">{district.name}</span>
                  <span className="landing-district-count">
                    {dict.places.count(district.count)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
