import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { PlaceForm } from "@/app/admin/places/place-form";

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

  const [place, allCategories] = await Promise.all([
    prisma.place.findUnique({
      where: { id },
      include: {
        photos: { orderBy: { order: "asc" } },
        schedules: true,
        categories: { select: { categoryId: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!place) {
    notFound();
  }

  return <PlaceForm place={place} allCategories={allCategories} error={error} />;
}
