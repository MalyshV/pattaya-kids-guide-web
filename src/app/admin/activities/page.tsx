import { placeDisplayName } from "@/lib/places/display-name";
import Link from "next/link";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { firstParam, parseVisibility, type AdminListItem } from "@/lib/admin/list-search";
import { AdminSearchList } from "@/app/admin/admin-search-list";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  COURSE: "курс",
  CAMP: "лагерь",
  MEMBERSHIP: "абонемент",
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/** Все занятия (курсы, лагеря, абонементы) — включая скрытые и демо, с поиском. */
export default async function AdminActivitiesPage({
  searchParams,
}: Props): Promise<React.ReactElement> {
  await requireAdmin();
  const params = (await searchParams) ?? {};

  const activities = await prisma.placeProgram.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      isDemo: true,
      status: true,
      imageUrl: true,
      place: {
        select: {
          name: true,
          branchLabel: true,
          branchLabelEn: true,
          branchLabelTh: true,
        },
      },
      venueName: true,
      venueAddress: true,
      _count: { select: { classes: true } },
    },
  });

  const items: AdminListItem[] = activities.map((activity) => {
    const where = activity.place
      ? placeDisplayName(activity.place, "ru")
      : (activity.venueName ?? "");
    const typeLabel = TYPE_LABEL[activity.type] ?? activity.type;
    return {
      id: activity.id,
      href: `/admin/activities/${activity.id}`,
      name: activity.name,
      meta:
        typeLabel +
        (where ? ` · ${where}` : "") +
        (activity._count.classes > 0 ? ` · классов: ${activity._count.classes}` : "") +
        (!activity.imageUrl ? " · без фото" : "") +
        (activity.status !== "APPROVED" ? " · скрыто" : "") +
        (activity.isDemo ? " · демо" : ""),
      hidden: activity.status !== "APPROVED",
      searchText: [
        activity.name,
        activity.slug ?? "",
        typeLabel,
        where,
        activity.venueAddress ?? "",
      ].join(" "),
    };
  });

  return (
    <section>
      <div className="admin-title-row">
        <h1>Занятия ({activities.length})</h1>
        <Link href="/admin/activities/new" className="admin-button">
          + Новое занятие
        </Link>
      </div>

      <AdminSearchList
        items={items}
        initialQuery={firstParam(params.q)}
        initialShow={parseVisibility(firstParam(params.show))}
        placeholder="Название, место проведения или вид"
      />
    </section>
  );
}
