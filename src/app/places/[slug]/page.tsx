import { notFound } from "next/navigation";
import type { PlaceDetailsDto } from "@/dto/place-details.dto";
import { mapPlaceDetailsToDto } from "@/mappers/place-details.mapper";
import { getApprovedPlaceBySlug } from "@/services/places.service";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PlaceDetailsPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;

  const place = await getApprovedPlaceBySlug(slug);

  if (!place) {
    notFound();
  }

  const dto: PlaceDetailsDto = mapPlaceDetailsToDto(place);

  return (
    <main className="page-shell">
      <div className="back-link-wrapper">
        <Link href="/" className="back-link">
          ← Back to places
        </Link>
      </div>
      <section className="hero">
        <p className="eyebrow">Place</p>
        <h1 className="hero-title">{dto.name}</h1>
        <p className="hero-description">{dto.description ?? "No description yet."}</p>
      </section>

      <section className="details-section">
        <h2 className="section-title">Details</h2>

        <div className="details-grid">
          <div>
            <strong>Type:</strong> {dto.indoor ? "Indoor" : "Outdoor"}
          </div>

          <div>
            <strong>Food:</strong> {dto.hasFood ? "Available" : "No info"}
          </div>

          <div>
            <strong>Wi-Fi:</strong> {dto.hasWifi ? "Yes" : "No info"}
          </div>

          <div>
            <strong>Child drop-off:</strong>{" "}
            {dto.canLeaveChild ? "Allowed" : "Stay with parent"}
          </div>

          <div>
            <strong>Animals:</strong> {dto.animalContact ? "Yes" : "No"}
          </div>
        </div>
      </section>
      {dto.categories.length > 0 && (
        <section className="details-section">
          <h2 className="section-title">Categories</h2>

          <div className="category-list">
            {dto.categories.map((category) => (
              <span key={category.id} className="category-chip">
                {category.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
