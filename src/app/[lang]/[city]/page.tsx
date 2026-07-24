import { notFound, redirect } from "next/navigation";
import { LandingHero, type LandingScenarioDto } from "@/components/landing/landing-hero";
import { LazyMount } from "@/components/common/lazy-mount";
import { PlacesMap } from "@/components/places/places-map";
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
import type { MapPointDto, MapPointKind } from "@/dto/map-point.dto";
import { computeEventStatus } from "@/lib/events/event-lifecycle";
import { isActivityActive } from "@/lib/activities/activity-sort";
import { cityBasePath, getCityBySlug, getSiteUrl } from "@/lib/geo/city";
import {
  computeOpenStatus,
  isGoNowStatus,
  nowInCity,
  opensEarlyToday,
} from "@/lib/schedule/open-status";
import {
  dropLateNightMorning,
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

  const counts: Partial<Record<ScenarioKey, number>> = {
    openNow: places.filter((place) =>
      isGoNowStatus(computeOpenStatus(place.schedules, city.timezone)),
    ).length,
    openMorning: places.filter((place) => opensEarlyToday(place.schedules, city.timezone))
      .length,
    workFriendly: places.filter(isWorkFriendlyPlace).length,
    shelter: places.filter(isShelterPlace).length,
  };

  // разделы: пустая афиша/ДР/занятия не обещаются (порог 1 в ядре)
  const sectionCounts: Partial<Record<ScenarioKey, number>> = {
    events: searchRows.events.length,
    birthdays: birthdayPlaces.length,
    age: searchRows.activities.length,
  };

  const priority = scenarioPriority(slot, isWeekendDay(now.day));
  const pool = dropLateNightMorning(
    eligibleScenarios(priority, counts, sectionCounts),
    slot,
    now.minutes,
  );

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

  const scenarios: LandingScenarioDto[] = pool.map((key) => ({
    key,
    ...scenarioHrefs[key],
  }));

  // Единая карта ниже сгиба (первый экран свят — карту «просто так» не видно,
  // к ней ведёт «Смотреть на карте» плавным скроллом). Все три типа точек —
  // места (терракота), события (янтарь), занятия (шалфей); координаты берут
  // мапперы (событие/занятие — у своей точки ИЛИ у связанного места).
  const placePoints: MapPointDto[] = places
    .filter(
      (place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude),
    )
    .map((place) => placeToMapPoint(mapPlaceToListItemDto(place), basePath));
  // прошедшие события и завершённые лагеря на карту не ставим: пин, в отличие
  // от карточки, не несёт бейджа статуса — живой янтарный/шалфейный пин вёл бы
  // на «прошло». COURSE вечнозелёные, места и ongoing/upcoming — остаются.
  const eventPoints = cityEvents
    .filter(
      (event) =>
        computeEventStatus(
          new Date(event.startDate),
          event.endDate ? new Date(event.endDate) : null,
          nowDate,
        ) !== "past",
    )
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
      {/* первый экран — вопрос и ответы, занимает вьюпорт целиком */}
      <div className="landing-hero-viewport">
        <LandingHero slot={slot} scenarios={scenarios} listPath={listPath} />
      </div>

      {/* ниже сгиба: карта; Leaflet монтируется только при приближении.
          Без aria-label: внутри PlacesMap уже есть region «Карта мест»,
          второй почти одноимённый ориентир только путал бы скринридер */}
      <section id="map" className="landing-map">
        <h2 className="landing-map-title">{dict.landing.mapTitle}</h2>
        <LazyMount>
          <PlacesMap
            markers={mapPoints}
            userPoint={null}
            basePath={basePath}
            legendKinds={presentKinds}
          />
        </LazyMount>
      </section>
    </main>
  );
}
