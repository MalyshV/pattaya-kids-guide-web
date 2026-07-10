import Link from "next/link";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";

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

/** Все события (включая прошедшие, скрытые и демо) — новые сверху. */
export default async function AdminEventsPage(): Promise<React.ReactElement> {
  await requireAdmin();

  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      title: true,
      startDate: true,
      status: true,
      isDemo: true,
      imageUrl: true,
      place: { select: { name: true } },
      locationName: true,
    },
  });

  return (
    <section>
      <div className="admin-title-row">
        <h1>События ({events.length})</h1>
        <Link href="/admin/events/new" className="admin-button">
          + Новое событие
        </Link>
      </div>

      <ul className="admin-list">
        {events.map((event) => (
          <li key={event.id} className="admin-list-item">
            <Link href={`/admin/events/${event.id}`} className="admin-item-link">
              <span className="admin-item-name">{event.title}</span>
              <span className="admin-item-meta">
                {pattayaDateLabel(event.startDate)}
                {(event.place?.name ?? event.locationName)
                  ? ` · ${event.place?.name ?? event.locationName}`
                  : ""}
                {!event.imageUrl ? " · без фото" : ""}
                {event.status !== "APPROVED" ? " · скрыто" : ""}
                {event.isDemo ? " · демо" : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
