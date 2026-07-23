import { notFound, redirect } from "next/navigation";
import { LandingHero, type LandingScenarioDto } from "@/components/landing/landing-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { websiteJsonLd } from "@/lib/seo/json-ld";
import { getAllApprovedPlaces } from "@/services/places.service";
import { cityBasePath, getCityBySlug, getSiteUrl } from "@/lib/geo/city";
import {
  computeOpenStatus,
  isGoNowStatus,
  nowInCity,
  opensEarlyToday,
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
]);

/** Эмоджи-подсказки сценариев (тексты — в словарях). */
const SCENARIO_EMOJI: Record<ScenarioKey, string[]> = {
  age: ["🧩", "✏️"],
  workFriendly: ["💻", "📶"],
  openMorning: ["🌅", "🕗"],
  openNow: ["🏃", "✨"],
  shelter: ["❄️", "🌴"],
  events: ["🎪", "📅"],
  birthdays: ["🎂", "🎈"],
  near: ["📍", "🚶"],
};

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
  const places = await getAllApprovedPlaces({}, city.id);
  const now = nowInCity(city.timezone);
  const slot: LandingSlot = landingSlot(now.minutes);

  const counts: Partial<Record<ScenarioKey, number>> = {
    openNow: places.filter((place) =>
      isGoNowStatus(computeOpenStatus(place.schedules, city.timezone)),
    ).length,
    openMorning: places.filter((place) => opensEarlyToday(place.schedules, city.timezone))
      .length,
    workFriendly: places.filter(isWorkFriendlyPlace).length,
    shelter: places.filter(isShelterPlace).length,
  };

  const priority = scenarioPriority(slot, isWeekendDay(now.day));
  const pool = eligibleScenarios(priority, counts);

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
    emoji: SCENARIO_EMOJI[key],
    ...scenarioHrefs[key],
  }));

  return (
    <main className="page-shell landing-shell">
      {/* WebSite (имя сайта для выдачи) живёт на корне города. Без
          SearchAction: поиск клиентский, URL результатов не существует */}
      <JsonLd
        data={websiteJsonLd({ name: dict.brand, url: getSiteUrl(), inLanguage: lang })}
      />
      <LandingHero slot={slot} scenarios={scenarios} listPath={listPath} />
    </main>
  );
}
