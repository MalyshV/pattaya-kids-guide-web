import Link from "next/link";
import type { PlaceListItemDto } from "@/dto/place-list-item.dto";
import { ru } from "@/content/ru";

type PlaceCardProps = {
  place: PlaceListItemDto;
  basePath: string;
};

export function PlaceCard({ place, basePath }: PlaceCardProps): React.ReactElement {
  return (
    <article className="place-card interactive-surface">
      <div className="place-card-header">
        <div>
          <h3 className="place-card-title">{place.name}</h3>
          <p className="place-card-slug">/{place.slug}</p>
        </div>

        <div className="place-badges">
          {place.indoor ? (
            <span className="place-badge">{ru.places.badgeIndoor}</span>
          ) : null}
          {place.outdoor ? (
            <span className="place-badge">{ru.places.badgeOutdoor}</span>
          ) : null}
        </div>
      </div>

      <p className="place-card-description">
        {place.description ?? ru.common.descriptionFallback}
      </p>

      <p className="place-card-address">{place.address ?? ru.places.addressFallback}</p>

      <div className="feature-list">
        {place.hasFood ? (
          <span className="feature-chip">{ru.places.features.food}</span>
        ) : null}
        {place.hasWifi ? (
          <span className="feature-chip">{ru.places.features.wifi}</span>
        ) : null}
        {place.canLeaveChild ? (
          <span className="feature-chip">{ru.places.features.childDropOff}</span>
        ) : null}
        {place.animalContact ? (
          <span className="feature-chip">{ru.places.features.animals}</span>
        ) : null}
      </div>

      <div className="place-card-actions">
        <Link href={`${basePath}/places/${place.slug}`} className="place-card-cta">
          <span className="place-card-cta-text">{ru.common.detailsCta}</span>
          <span className="place-card-cta-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
