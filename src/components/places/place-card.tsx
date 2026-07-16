import Link from "next/link";
import type { PlaceListItemDto } from "@/dto/place-list-item.dto";
import { OpenStatusBadge } from "@/components/places/open-status-badge";
import { PlaceImage } from "@/components/places/place-image";
import { MemoryButtons } from "@/components/memory/memory-buttons";
import type { OpenStatus } from "@/lib/schedule/open-status";
import { getDictionary, langFromPath } from "@/content/dictionary";
import { pickLocalized } from "@/lib/i18n/localize";

type PlaceCardProps = {
  place: PlaceListItemDto;
  basePath: string;
  status?: OpenStatus;
  /** «≈ 800 м» в режиме «Рядом со мной»; расстояние по прямой */
  distanceLabel?: string;
};

export function PlaceCard({
  place,
  basePath,
  status,
  distanceLabel,
}: PlaceCardProps): React.ReactElement {
  const lang = langFromPath(basePath);
  const dict = getDictionary(lang);
  const isClosedToday = status?.kind === "closedToday";

  return (
    <article
      className={`place-card interactive-surface${
        isClosedToday ? " place-card-closed" : ""
      }`}
    >
      <PlaceImage url={place.imageUrl} alt={place.name} />
      <MemoryButtons
        compact
        entity="place"
        slug={place.slug}
        name={place.name}
        imageUrl={place.imageUrl}
      />

      <div className="place-card-header">
        <div>
          <h3 className="place-card-title">
            <Link href={`${basePath}/places/${place.slug}`} className="card-title-link">
              {place.name}
            </Link>
          </h3>
        </div>

        <div className="place-badges">
          {place.indoor ? (
            <span className="place-badge">{dict.places.badgeIndoor}</span>
          ) : null}
          {place.outdoor ? (
            <span className="place-badge">{dict.places.badgeOutdoor}</span>
          ) : null}
        </div>
      </div>

      {status && status.kind !== "unknown" ? (
        <div className="place-card-status">
          <OpenStatusBadge status={status} lang={lang} />
        </div>
      ) : null}

      <p className="place-card-description">
        {pickLocalized(place.description, place.descriptionEn, lang) ??
          dict.common.descriptionFallback}
      </p>

      <p className="place-card-address">
        {place.address ?? dict.places.addressFallback}
        {distanceLabel ? (
          <span className="place-card-distance"> · {distanceLabel}</span>
        ) : null}
      </p>

      <div className="feature-list">
        {place.hasFood ? (
          <span className="feature-chip">{dict.places.features.food}</span>
        ) : null}
        {place.hasWifi ? (
          <span className="feature-chip">{dict.places.features.wifi}</span>
        ) : null}
        {place.canLeaveChild ? (
          <span className="feature-chip">{dict.places.features.childDropOff}</span>
        ) : null}
        {place.animalContact ? (
          <span className="feature-chip">{dict.places.features.animals}</span>
        ) : null}
      </div>

      <div className="place-card-actions">
        <Link href={`${basePath}/places/${place.slug}`} className="place-card-cta">
          <span className="place-card-cta-text">{dict.common.detailsCta}</span>
          <span className="place-card-cta-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
