import Link from "next/link";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  COURSE: "курс",
  CAMP: "лагерь",
  MEMBERSHIP: "абонемент",
};

/** Все занятия (курсы, лагеря, абонементы) — включая демо. */
export default async function AdminActivitiesPage(): Promise<React.ReactElement> {
  await requireAdmin();

  const activities = await prisma.placeProgram.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      type: true,
      isDemo: true,
      imageUrl: true,
      place: { select: { name: true } },
      venueName: true,
      _count: { select: { classes: true } },
    },
  });

  return (
    <section>
      <div className="admin-title-row">
        <h1>Занятия ({activities.length})</h1>
        <Link href="/admin/activities/new" className="admin-button">
          + Новое занятие
        </Link>
      </div>

      <ul className="admin-list">
        {activities.map((activity) => (
          <li key={activity.id} className="admin-list-item">
            <Link href={`/admin/activities/${activity.id}`} className="admin-item-link">
              <span className="admin-item-name">{activity.name}</span>
              <span className="admin-item-meta">
                {TYPE_LABEL[activity.type] ?? activity.type}
                {(activity.place?.name ?? activity.venueName)
                  ? ` · ${activity.place?.name ?? activity.venueName}`
                  : ""}
                {activity._count.classes > 0
                  ? ` · классов: ${activity._count.classes}`
                  : ""}
                {!activity.imageUrl ? " · без фото" : ""}
                {activity.isDemo ? " · демо" : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
