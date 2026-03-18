import type { PlaceDto } from "@/dto/place.dto";

type PlaceCardProps = {
  place: PlaceDto;
};

function formatFeature(value: boolean, trueLabel: string, falseLabel: string): string {
  return value ? trueLabel : falseLabel;
}

export function PlaceCard({ place }: PlaceCardProps): React.ReactElement {
  return (
    <article className="place-card">
      <div className="place-card-header">
        <div>
          <h3 className="place-card-title">{place.name}</h3>
          <p className="place-card-slug">/{place.slug}</p>
        </div>
        <span className="place-badge">{place.indoor ? "Indoor" : "Outdoor"}</span>
      </div>

      <p className="place-card-description">
        {place.description ?? "No description yet."}
      </p>

      <p className="place-card-address">{place.address ?? "Address not specified"}</p>

      <div className="feature-list">
        <span className="feature-chip">
          {formatFeature(place.hasFood, "Food available", "No food info")}
        </span>
        <span className="feature-chip">
          {formatFeature(place.hasWifi, "Wi-Fi", "No Wi-Fi info")}
        </span>
        <span className="feature-chip">
          {formatFeature(place.canLeaveChild, "Child can stay", "Stay-with-parent")}
        </span>
        <span className="feature-chip">
          {formatFeature(place.animalContact, "Animal contact", "No animal contact")}
        </span>
      </div>
    </article>
  );
}
