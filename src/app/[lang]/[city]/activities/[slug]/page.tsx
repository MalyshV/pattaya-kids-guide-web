import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mapActivityToListItem } from "@/mappers/activity.mapper";
import { getActivityBySlug } from "@/services/activities.service";
import { ShareButton } from "@/components/common/share-button";
import { ZoomableImage } from "@/components/common/zoomable-image";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { computeEventStatus } from "@/lib/events/event-lifecycle";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { formatAgeRange } from "@/lib/age/format-age";
import { articleOpenGraph, metaDescription } from "@/lib/seo/meta";
import { dateLocale, getDictionary, type Dictionary } from "@/content/dictionary";

type PageProps = {
  params: Promise<{ lang: string; city: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  const activity = await getActivityBySlug(slug, city.id);

  if (!activity) {
    return {};
  }

  const dict = getDictionary(lang);
  const title = `${activity.name} — ${dict.brand}`;
  const description = metaDescription(activity.description, dict.meta.description);

  return {
    title,
    description,
    openGraph: articleOpenGraph({
      title,
      description,
      siteName: dict.brand,
      path: `${cityBasePath(lang, citySlug)}/activities/${slug}`,
      imageUrl: activity.imageUrl,
      lang,
    }),
  };
}

function formatMoney(amount: number, currency: string, lang: string): string {
  return `${amount.toLocaleString(dateLocale(lang))} ${currency}`;
}

function parentBadgeLabel(value: boolean | null, dict: Dictionary): string {
  if (value === true) return dict.activityDetails.withParent;
  if (value === false) return dict.activityDetails.withoutParent;
  return dict.activityDetails.parentDepends;
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

  const dict = getDictionary(lang);
  const basePath = cityBasePath(lang, citySlug);
  const activity = await getActivityBySlug(slug, city.id);

  if (!activity) {
    notFound();
  }

  const dto = mapActivityToListItem(activity, lang);
  const typeLabel =
    (dict.placeDetails.programTypes as Record<string, string>)[dto.type] ?? dto.type;

  // Лагерь с датами показывает живой статус (идёт/скоро/прошло); регулярные — нет.
  const status =
    dto.type === "CAMP" && dto.startDate
      ? computeEventStatus(
          new Date(dto.startDate),
          dto.endDate ? new Date(dto.endDate) : null,
          new Date(),
        )
      : undefined;

  const ageRange = formatAgeRange(dto.minAgeMonths, dto.maxAgeMonths, lang);

  return (
    <main className="page-shell">
      <div className="back-link-wrapper">
        <Link href={`${basePath}/activities`} className="back-link">
          {dict.activityDetails.back}
        </Link>
        <ShareButton title={dto.name} />
      </div>

      <ZoomableImage
        url={dto.imageUrl}
        alt={dto.name}
        className="place-image-hero"
        sizes="(max-width: 940px) 100vw, 900px"
      />

      <section className="hero">
        <p className="eyebrow">{typeLabel}</p>
        <h1 className="hero-title">{dto.name}</h1>
        {/* «где» сразу в шапке: вернувшись на страницу, не нужно листать вниз,
            чтобы вспомнить, куда это вообще ходить */}
        {dto.place || dto.venueName ? (
          <p className="hero-venue">
            {dict.activityDetails.heroWhere}{" "}
            {dto.place ? (
              <Link href={`${basePath}/places/${dto.place.slug}`}>{dto.place.name}</Link>
            ) : (
              dto.venueName
            )}
          </p>
        ) : null}
        {status ? (
          <div className="hero-status">
            <EventStatusBadge status={status} lang={lang} />
          </div>
        ) : null}
        {dto.description ? <p className="hero-description">{dto.description}</p> : null}
      </section>

      <section className="details-section">
        <h2 className="section-title">{dict.placeDetails.detailsTitle}</h2>
        <div className="details-grid">
          {ageRange ? (
            <div>
              <strong>{dict.activities.ageLabel}</strong> {ageRange}
            </div>
          ) : null}

          <div>
            <strong>{dict.placeDetails.pricingTitle}:</strong>{" "}
            {dto.price != null ? (
              <>
                {dto.oldPrice != null ? (
                  <span className="program-old-price">
                    {dict.placeDetails.programOldPrice(
                      formatMoney(dto.oldPrice, dto.currency, lang),
                    )}
                  </span>
                ) : null}{" "}
                {formatMoney(dto.price, dto.currency, lang)}
                {dto.priceUnit ? ` ${dto.priceUnit}` : ""}
              </>
            ) : (
              <span className="value-unknown">{dict.placeDetails.priceUnknown}</span>
            )}
          </div>
        </div>
      </section>

      {dto.categories.length > 0 ? (
        <section className="details-section">
          <h2 className="section-title">{dict.placeDetails.categoriesTitle}</h2>
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
          <h2 className="section-title">{dict.activityDetails.classesTitle}</h2>
          <div className="class-table-wrap">
            <table className="class-table">
              <thead>
                <tr>
                  <th>{dict.activityDetails.classCol}</th>
                  <th>{dict.activityDetails.ageCol}</th>
                  <th>{dict.activityDetails.timeCol}</th>
                </tr>
              </thead>
              <tbody>
                {dto.classes.map((cls) => (
                  <tr key={cls.id}>
                    <th scope="row">
                      <span className="class-name">{cls.name}</span>
                      <span className={parentBadgeClass(cls.parentRequired)}>
                        {parentBadgeLabel(cls.parentRequired, dict)}
                      </span>
                    </th>
                    <td>{cls.ageLabel}</td>
                    <td className="class-schedule">
                      {/* пара «день время» не разрывается при переносе строки */}
                      {cls.schedule.split(" · ").map((slot, index) => (
                        <span key={slot + index}>
                          {index > 0 ? " · " : ""}
                          <span className="class-slot">{slot}</span>
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="class-legend">{dict.activityDetails.classLegend}</p>
        </section>
      ) : null}

      {dto.place || dto.venueName ? (
        <section className="details-section">
          <h2 className="section-title">{dict.activityDetails.whereTitle}</h2>
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
