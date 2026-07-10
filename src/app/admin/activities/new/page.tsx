import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { ActivityForm } from "@/app/admin/activities/activity-form";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminActivityNewPage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  await requireAdmin();

  const resolvedSearch = (await searchParams) ?? {};
  const error =
    typeof resolvedSearch.error === "string" ? resolvedSearch.error : undefined;
  const places = await prisma.place.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return <ActivityForm activity={null} places={places} error={error} />;
}
