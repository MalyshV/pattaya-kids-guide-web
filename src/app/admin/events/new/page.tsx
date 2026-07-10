import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { EventForm } from "@/app/admin/events/event-form";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminEventNewPage({
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

  return <EventForm event={null} places={places} error={error} />;
}
