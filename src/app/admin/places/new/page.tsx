import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { PlaceForm } from "@/app/admin/places/place-form";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPlaceNewPage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  await requireAdmin();

  const resolvedSearch = (await searchParams) ?? {};
  const error =
    typeof resolvedSearch.error === "string" ? resolvedSearch.error : undefined;
  const allCategories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return <PlaceForm place={null} allCategories={allCategories} error={error} />;
}
