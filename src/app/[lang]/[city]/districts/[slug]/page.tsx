import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DistrictView } from "@/components/districts/district-view";
import type { MapLabel } from "@/components/places/places-map";
import { getDictionary } from "@/content/dictionary";
import type { DistrictItemDto } from "@/dto/district-item.dto";
import { computeEventStatus } from "@/lib/events/event-lifecycle";
import { isActivityActive } from "@/lib/activities/activity-sort";
import {
  getCityDistrictDefinitions,
  getCitySeaLongitude,
} from "@/lib/districts/city-districts";
import { landVertices, meanPoint } from "@/lib/districts/district-page";
import { resolveDistrictSlug } from "@/lib/districts/resolve-district";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { pickLocalized } from "@/lib/i18n/localize";
import { pageAlternates } from "@/lib/seo/meta";
import { mapActivityToListItem } from "@/mappers/activity.mapper";
import { toDistrictDto } from "@/mappers/district.mapper";
import {
  activityItemMeta,
  eventItemMeta,
  placeItemMeta,
  toDistrictItem,
} from "@/mappers/district-item.mapper";
import { mapEventListItemToDto } from "@/mappers/event.mapper";
import {
  activityToMapPoint,
  eventToMapPoint,
  placeToMapPoint,
} from "@/mappers/map-point.mapper";
import { mapPlaceToListItemDto } from "@/mappers/place.mapper";
import { getCityActivities } from "@/services/activities.service";
import { getCityEvents } from "@/services/events.service";
import { getAllApprovedPlaces } from "@/services/places.service";

type PageProps = {
  params: Promise<{ lang: string; city: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, slug } = await params;
  const district = getCityDistrictDefinitions(citySlug).find(
    (definition) => definition.slug === slug,
  );
  const city = await getCityBySlug(citySlug);
  if (!district || !city) {
    return {};
  }
  const text = getDictionary(lang).districtPage;
  const name = toDistrictDto(district, lang).name;
  const cityName = pickLocalized(city.name, city.nameEn, city.nameTh, lang);
  return {
    // бренд-суффикс добавит template из [lang]/layout
    title: text.metaTitle(name),
    description: text.metaDescription(name, cityName),
    alternates: pageAlternates(lang, citySlug, `/districts/${slug}`),
  };
}

/**
 * Страница района (решение 10.11): для тех, кто выбирает, где жить с детьми.
 * Всё, что есть в районе, — места, события и занятия — списком и на карте.
 * Район каждой точки считается на показе по координатам (у места — с учётом
 * ручного выбора из админки), запись в базу не нужна.
 */
export default async function DistrictPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);
  const definitions = getCityDistrictDefinitions(citySlug);
  const district = definitions.find((definition) => definition.slug === slug);
  if (!city || !district) {
    notFound();
  }

  const dict = getDictionary(lang);
  const basePath = cityBasePath(lang, citySlug);
  const [places, cityEvents, cityActivities] = await Promise.all([
    getAllApprovedPlaces({}, city.id),
    getCityEvents(city.id),
    getCityActivities(city.id),
  ]);
  const now = new Date();

  // всё с координатами — по районам; точка вне районов сюда не попадает
  const byDistrict = new Map<string, DistrictItemDto[]>();
  const put = (districtSlug: string | null, item: DistrictItemDto): void => {
    if (!districtSlug) {
      return;
    }
    const list = byDistrict.get(districtSlug);
    if (list) {
      list.push(item);
    } else {
      byDistrict.set(districtSlug, [item]);
    }
  };

  for (const place of places) {
    if (!Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) {
      continue;
    }
    // маппер уже посчитал район места: ручной выбор или координаты
    const dto = mapPlaceToListItemDto(place, lang, definitions);
    put(
      dto.district?.slug ?? null,
      toDistrictItem(placeToMapPoint(dto, basePath, lang), placeItemMeta(dto, lang)),
    );
  }

  // прошедшие события и завершённые лагеря не показываем — как на общей карте
  const liveEvents = cityEvents
    .filter(
      (event) =>
        computeEventStatus(
          new Date(event.startDate),
          event.endDate ? new Date(event.endDate) : null,
          now,
        ) !== "past",
    )
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  for (const event of liveEvents) {
    const point = eventToMapPoint(event, basePath, lang);
    if (point) {
      put(
        resolveDistrictSlug(point.latitude, point.longitude, definitions),
        toDistrictItem(
          point,
          eventItemMeta(mapEventListItemToDto(event, lang), lang, city.timezone),
        ),
      );
    }
  }

  for (const activity of cityActivities) {
    if (!isActivityActive(activity, now)) {
      continue;
    }
    const point = activityToMapPoint(activity, basePath, lang);
    if (point) {
      put(
        resolveDistrictSlug(point.latitude, point.longitude, definitions),
        toDistrictItem(
          point,
          activityItemMeta(mapActivityToListItem(activity, lang), lang),
        ),
      );
    }
  }

  const items = byDistrict.get(district.slug) ?? [];
  const countOf = (list: DistrictItemDto[], kind: DistrictItemDto["kind"]): number =>
    list.filter((item) => item.kind === kind).length;
  // «12 мест · 4 занятия · 1 событие» — только то, что есть
  const countsLabel =
    [
      countOf(items, "place") > 0 ? dict.places.count(countOf(items, "place")) : null,
      countOf(items, "activity") > 0
        ? dict.activities.count(countOf(items, "activity"))
        : null,
      countOf(items, "event") > 0 ? dict.events.count(countOf(items, "event")) : null,
    ]
      .filter((part): part is string => part !== null)
      .join(" · ") || null;

  // все районы, где что-то есть, в порядке показа: подписи на карте (кроме
  // текущего) и оглавление внизу страницы
  const others = [...definitions]
    .sort((a, b) => a.order - b.order)
    .map((definition) => {
      const list = byDistrict.get(definition.slug) ?? [];
      const placesCount = countOf(list, "place");
      return {
        slug: definition.slug,
        name: toDistrictDto(definition, lang).name,
        total: list.length,
        // как на главной: число мест; район без мест — число занятий
        countLabel:
          placesCount > 0
            ? dict.places.count(placesCount)
            : dict.activities.count(countOf(list, "activity")),
        anchor: meanPoint(list),
      };
    })
    .filter((entry) => entry.total > 0 || entry.slug === district.slug);

  const labels: MapLabel[] = others.flatMap((entry) =>
    entry.slug !== district.slug && entry.anchor
      ? [
          {
            id: entry.slug,
            name: entry.name,
            hint: String(entry.total),
            href: `${basePath}/districts/${entry.slug}`,
            latitude: entry.anchor.latitude,
            longitude: entry.anchor.longitude,
          },
        ]
      : [],
  );

  const boundary = district.boundary.map(([latitude, longitude]): [number, number] => [
    latitude,
    longitude,
  ]);
  const frame = landVertices(district.boundary, getCitySeaLongitude(citySlug)).map(
    ([latitude, longitude]): [number, number] => [latitude, longitude],
  );

  return (
    <main className="page-shell district-shell">
      <DistrictView
        basePath={basePath}
        name={toDistrictDto(district, lang).name}
        countsLabel={countsLabel}
        note={null}
        items={items}
        boundary={boundary}
        frame={frame}
        labels={labels}
        catalogHref={`${basePath}/places?district=${district.slug}`}
        allDistrictsHref="#districts"
      />

      <section id="districts" className="landing-block landing-districts">
        <div className="landing-districts-intro">
          <h2 className="landing-block-title">{dict.landing.districtsTitle}</h2>
          <p className="landing-soon-hint">{dict.districtPage.otherHint}</p>
        </div>
        <ul className="landing-districts-list">
          {others.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`${basePath}/districts/${entry.slug}`}
                className="landing-district"
                aria-current={entry.slug === district.slug ? "page" : undefined}
              >
                <span className="landing-district-name">{entry.name}</span>
                <span className="landing-district-count">{entry.countLabel}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
