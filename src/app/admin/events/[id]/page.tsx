import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { EventForm } from "@/app/admin/events/event-form";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminEventEditPage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  await requireAdmin();

  const { id } = await params;
  const resolvedSearch = (await searchParams) ?? {};
  const error =
    typeof resolvedSearch.error === "string" ? resolvedSearch.error : undefined;

  const [event, places] = await Promise.all([
    prisma.event.findUnique({ where: { id } }),
    prisma.place.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!event) {
    notFound();
  }

  return <EventForm event={event} places={places} error={error} />;
}
