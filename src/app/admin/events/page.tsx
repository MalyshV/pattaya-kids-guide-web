import { placeDisplayName } from "@/lib/places/display-name";
import Link from "next/link";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { firstParam, parseVisibility, type AdminListItem } from "@/lib/admin/list-search";
import { AdminSearchList } from "@/app/admin/admin-search-list";

export const dynamic = "force-dynamic";

function pattayaDateLabel(date: Date): string {
  return date.toLocaleString("ru-RU", {
    timeZone: "Asia/Bangkok",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/** Все события (включая прошедшие, скрытые и демо) — новые сверху, с поиском. */
export default async function AdminEventsPage({
  searchParams,
}: Props): Promise<React.ReactElement> {
  await requireAdmin();
  const params = (await searchParams) ?? {};

  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      startDate: true,
      status: true,
      isDemo: true,
      imageUrl: true,
      place: {
        select: {
          name: true,
          branchLabel: true,
          branchLabelEn: true,
          branchLabelTh: true,
        },
      },
      locationName: true,
    },
  });

  const items: AdminListItem[] = events.map((event) => {
    const where = event.place
      ? placeDisplayName(event.place, "ru")
      : (event.locationName ?? "");
    const date = pattayaDateLabel(event.startDate);
    return {
      id: event.id,
      href: `/admin/events/${event.id}`,
      name: event.title,
      meta:
        date +
        (where ? ` · ${where}` : "") +
        (!event.imageUrl ? " · без фото" : "") +
        (event.status !== "APPROVED" ? " · скрыто" : "") +
        (event.isDemo ? " · демо" : ""),
      hidden: event.status !== "APPROVED",
      searchText: [event.title, event.slug, where, date].join(" "),
    };
  });

  return (
    <section>
      <div className="admin-title-row">
        <h1>События ({events.length})</h1>
        <Link href="/admin/events/new" className="admin-button">
          + Новое событие
        </Link>
      </div>

      <AdminSearchList
        items={items}
        initialQuery={firstParam(params.q)}
        initialShow={parseVisibility(firstParam(params.show))}
        placeholder="Название, место или месяц"
      />
    </section>
  );
}
