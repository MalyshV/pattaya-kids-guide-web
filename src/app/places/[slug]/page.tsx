import { notFound } from "next/navigation";
import type { PlaceDetailsDto } from "@/dto/place-details.dto";
import { mapPlaceDetailsToDto } from "@/mappers/place-details.mapper";
import { getApprovedPlaceBySlug } from "@/services/places.service";

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
      <section className="hero">
        <p className="eyebrow">Place</p>
        <h1 className="hero-title">{dto.name}</h1>
        <p className="hero-description">{dto.description ?? "No description yet."}</p>
      </section>

      <section className="details-section">
        <h2>Details</h2>

        <ul>
          <li>Slug: {dto.slug}</li>
          <li>Indoor: {dto.indoor ? "Yes" : "No"}</li>
          <li>Food: {dto.hasFood ? "Yes" : "No"}</li>
          <li>Wi-Fi: {dto.hasWifi ? "Yes" : "No"}</li>
          <li>Can leave child: {dto.canLeaveChild ? "Yes" : "No"}</li>
          <li>Animal contact: {dto.animalContact ? "Yes" : "No"}</li>
        </ul>
      </section>
    </main>
  );
}
