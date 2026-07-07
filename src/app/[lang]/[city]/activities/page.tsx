import { notFound } from "next/navigation";
import { ActivityCard } from "@/components/activities/activity-card";
import { mapActivityToListItem } from "@/mappers/activity.mapper";
import { getCityActivities } from "@/services/activities.service";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { activitySortRank } from "@/lib/activities/activity-sort";
import { ru } from "@/content/ru";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
};

export default async function CityActivitiesPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const basePath = cityBasePath(lang, citySlug);
  const activities = await getCityActivities(city.id);
  const now = new Date();

  // Актуальное вверху, прошедшие лагеря вниз (стабильно к порядку из запроса)
  const items = [...activities]
    .sort((a, b) => activitySortRank(a, now) - activitySortRank(b, now))
    .map(mapActivityToListItem);

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{city.name}</p>
        <h1 className="hero-title">{ru.activities.heroTitle}</h1>
        <p className="hero-description">{ru.activities.heroDescription}</p>
      </section>

      <section className="results-header">
        <div>
          <h2>{ru.activities.sectionTitle}</h2>
          <p>{ru.activities.count(items.length)}</p>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="empty-state">
          <h3>{ru.activities.emptyTitle}</h3>
          <p>{ru.activities.emptyHint}</p>
        </section>
      ) : (
        <section className="activities-grid">
          {items.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} basePath={basePath} />
          ))}
        </section>
      )}
    </main>
  );
}
