import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { PlaceForm } from "@/app/admin/places/place-form";
import { buildDistrictField } from "@/lib/districts/choose-district";
import { getCityDistrictDefinitions } from "@/lib/districts/city-districts";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPlaceEditPage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  await requireAdmin();

  const { id } = await params;
  const resolvedSearch = (await searchParams) ?? {};
  const error =
    typeof resolvedSearch.error === "string" ? resolvedSearch.error : undefined;

  const [place, allCategories, allBrands] = await Promise.all([
    prisma.place.findUnique({
      where: { id },
      include: {
        photos: { orderBy: { order: "asc" } },
        schedules: true,
        birthdayInfo: true,
        categories: { select: { categoryId: true } },
        tips: { orderBy: { order: "asc" }, select: { text: true, textEn: true } },
        district: { select: { slug: true } },
        city: { select: { slug: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!place) {
    notFound();
  }

  return (
    <PlaceForm
      place={place}
      allCategories={allCategories}
      allBrands={allBrands}
      districtField={buildDistrictField({
        districts: getCityDistrictDefinitions(place.city.slug),
        place: {
          latitude: place.latitude,
          longitude: place.longitude,
          districtManual: place.districtManual,
          districtSlug: place.district?.slug ?? null,
        },
      })}
      error={error}
    />
  );
}
