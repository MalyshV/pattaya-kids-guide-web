import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { ActivityForm } from "@/app/admin/activities/activity-form";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminActivityEditPage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  await requireAdmin();

  const { id } = await params;
  const resolvedSearch = (await searchParams) ?? {};
  const error =
    typeof resolvedSearch.error === "string" ? resolvedSearch.error : undefined;

  const [activity, places] = await Promise.all([
    prisma.placeProgram.findUnique({
      where: { id },
      include: { _count: { select: { classes: true } } },
    }),
    prisma.place.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!activity) {
    notFound();
  }

  return <ActivityForm activity={activity} places={places} error={error} />;
}
