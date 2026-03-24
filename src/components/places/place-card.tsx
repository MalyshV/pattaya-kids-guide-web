import Link from "next/link";
import type { PlaceListItemDto } from "@/dto/place-list-item.dto";

type PlaceCardProps = {
  place: PlaceListItemDto;
};

export function PlaceCard({ place }: PlaceCardProps): React.ReactElement {
  return (
    <article className="place-card interactive-surface">
      <div className="place-card-header">
        <div>
          <h3 className="place-card-title">{place.name}</h3>
          <p className="place-card-slug">/{place.slug}</p>
        </div>

        <span className="place-badge">{place.indoor ? "Indoor" : "Outdoor"}</span>
      </div>

      <p className="place-card-description">
        {place.description ?? "More details will be added soon."}
      </p>

      <p className="place-card-address">{place.address ?? "Address not specified"}</p>

      <div className="feature-list">
        {place.hasFood ? <span className="feature-chip">Food</span> : null}
        {place.hasWifi ? <span className="feature-chip">Wi-Fi</span> : null}
        {place.canLeaveChild ? (
          <span className="feature-chip">Child drop-off</span>
        ) : null}
        {place.animalContact ? <span className="feature-chip">Animals</span> : null}
      </div>

      <div className="place-card-actions">
        <Link href={`/places/${place.slug}`} className="place-card-cta">
          <span className="place-card-cta-text">View place</span>
          <span className="place-card-cta-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
