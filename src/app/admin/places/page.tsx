import { placeDisplayName } from "@/lib/places/display-name";
import Link from "next/link";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { firstParam, parseVisibility, type AdminListItem } from "@/lib/admin/list-search";
import { AdminSearchList } from "@/app/admin/admin-search-list";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/** Список всех мест города — включая скрытые (PENDING) и демо, с поиском. */
export default async function AdminPlacesPage({
  searchParams,
}: Props): Promise<React.ReactElement> {
  await requireAdmin();
  const params = (await searchParams) ?? {};

  const places = await prisma.place.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      address: true,
      branchLabel: true,
      branchLabelEn: true,
      branchLabelTh: true,
      status: true,
      isDemo: true,
      imageUrl: true,
      _count: { select: { photos: true } },
    },
  });

  const items: AdminListItem[] = places.map((place) => {
    const displayName = placeDisplayName(place, "ru");
    return {
      id: place.id,
      href: `/admin/places/${place.id}`,
      name: displayName,
      meta:
        `/${place.slug} · фото: ${place._count.photos + (place.imageUrl ? 1 : 0)}` +
        (place.status !== "APPROVED" ? " · скрыто с сайта" : "") +
        (place.isDemo ? " · демо" : ""),
      hidden: place.status !== "APPROVED",
      searchText: [displayName, place.name, place.slug, place.address].join(" "),
    };
  });

  return (
    <section>
      <div className="admin-title-row">
        <h1>Места ({places.length})</h1>
        <Link href="/admin/places/new" className="admin-button">
          + Новое место
        </Link>
      </div>

      <AdminSearchList
        items={items}
        initialQuery={firstParam(params.q)}
        initialShow={parseVisibility(firstParam(params.show))}
        placeholder="Название, адрес или slug"
      />
    </section>
  );
}
