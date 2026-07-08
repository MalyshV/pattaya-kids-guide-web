import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mapActivityToListItem } from "@/mappers/activity.mapper";
import { getActivityBySlug } from "@/services/activities.service";
import { ShareButton } from "@/components/common/share-button";
import { PlaceImage } from "@/components/places/place-image";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { computeEventStatus } from "@/lib/events/event-lifecycle";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { formatAgeRange } from "@/lib/age/format-age";
import { metaDescription } from "@/lib/seo/meta";
import { ru } from "@/content/ru";

type PageProps = {
  params: Promise<{ lang: string; city: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  const activity = await getActivityBySlug(slug, city.id);

  if (!activity) {
    return {};
  }

  return {
    title: `${activity.name} — ${ru.brand}`,
    description: metaDescription(activity.description, ru.meta.description),
  };
}

function formatMoney(amount: number, currency: string): string {
  return `${amount.toLocaleString("ru-RU")} ${currency}`;
}

function parentBadgeLabel(value: boolean | null): string {
  if (value === true) return ru.activityDetails.withParent;
  if (value === false) return ru.activityDetails.withoutParent;
  return ru.activityDetails.parentDepends;
}

function parentBadgeClass(value: boolean | null): string {
  if (value === true) return "class-parent-badge class-parent-with";
  if (value === false) return "class-parent-badge class-parent-without";
  return "class-parent-badge class-parent-both";
}

export default async function ActivityDetailsPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { lang, city: citySlug, slug } = await params;

  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const basePath = cityBasePath(lang, citySlug);
  const activity = await getActivityBySlug(slug, city.id);

  if (!activity) {
    notFound();
  }

  const dto = mapActivityToListItem(activity);
  const typeLabel =
    (ru.placeDetails.programTypes as Record<string, string>)[dto.type] ?? dto.type;

  // Лагерь с датами показывает живой статус (идёт/скоро/прошло); регулярные — нет.
  const status =
    dto.type === "CAMP" && dto.startDate
      ? computeEventStatus(
          new Date(dto.startDate),
          dto.endDate ? new Date(dto.endDate) : null,
          new Date(),
        )
      : undefined;

  const ageRange = formatAgeRange(dto.minAgeMonths, dto.maxAgeMonths);

  return (
    <main className="page-shell">
      <div className="back-link-wrapper">
        <Link href={`${basePath}/activities`} className="back-link">
          {ru.activityDetails.back}
        </Link>
        <ShareButton title={dto.name} />
      </div>

      <PlaceImage url={dto.imageUrl} alt={dto.name} className="place-image-hero" />

      <section className="hero">
        <p className="eyebrow">{typeLabel}</p>
        <h1 className="hero-title">{dto.name}</h1>
        {status ? (
          <div className="hero-status">
            <EventStatusBadge status={status} />
          </div>
        ) : null}
        {dto.description ? <p className="hero-description">{dto.description}</p> : null}
      </section>

      <section className="details-section">
        <h2 className="section-title">{ru.placeDetails.detailsTitle}</h2>
        <div className="details-grid">
          {ageRange ? (
            <div>
              <strong>{ru.activities.ageLabel}</strong> {ageRange}
            </div>
          ) : null}

          <div>
            <strong>{ru.placeDetails.pricingTitle}:</strong>{" "}
            {dto.price != null ? (
              <>
                {dto.oldPrice != null ? (
                  <span className="program-old-price">
                    {ru.placeDetails.programOldPrice(
                      formatMoney(dto.oldPrice, dto.currency),
                    )}
                  </span>
                ) : null}{" "}
                {formatMoney(dto.price, dto.currency)}
                {dto.priceUnit ? ` ${dto.priceUnit}` : ""}
              </>
            ) : (
              <span className="value-unknown">{ru.placeDetails.priceUnknown}</span>
            )}
          </div>
        </div>
      </section>

      {dto.categories.length > 0 ? (
        <section className="details-section">
          <h2 className="section-title">{ru.placeDetails.categoriesTitle}</h2>
          <div className="category-list">
            {dto.categories.map((category) => (
              <span key={category.id} className="category-chip">
                {category.name}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dto.classes.length > 0 ? (
        <section className="details-section">
          <h2 className="section-title">{ru.activityDetails.classesTitle}</h2>
          <div className="class-table-wrap">
            <table className="class-table">
              <thead>
                <tr>
                  <th>{ru.activityDetails.classCol}</th>
                  <th>{ru.activityDetails.ageCol}</th>
                  <th>{ru.activityDetails.timeCol}</th>
                </tr>
              </thead>
              <tbody>
                {dto.classes.map((cls) => (
                  <tr key={cls.id}>
                    <th scope="row">
                      <span className="class-name">{cls.name}</span>
                      <span className={parentBadgeClass(cls.parentRequired)}>
                        {parentBadgeLabel(cls.parentRequired)}
                      </span>
                    </th>
                    <td>{cls.ageLabel}</td>
                    <td className="class-schedule">{cls.schedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="class-legend">{ru.activityDetails.classLegend}</p>
        </section>
      ) : null}

      {dto.place || dto.venueName ? (
        <section className="details-section">
          <h2 className="section-title">{ru.activityDetails.whereTitle}</h2>
          {dto.place ? (
            <Link
              href={`${basePath}/places/${dto.place.slug}`}
              className="activity-venue"
            >
              <div className="activity-venue-name">{dto.place.name}</div>
              <div className="activity-venue-address">{dto.place.address}</div>
            </Link>
          ) : (
            <div className="activity-venue activity-venue-static">
              <div className="activity-venue-name">{dto.venueName}</div>
              {dto.venueAddress ? (
                <div className="activity-venue-address">{dto.venueAddress}</div>
              ) : null}
            </div>
          )}
        </section>
      ) : null}
    </main>
  );
}
