import Link from "next/link";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

/** Список всех мест города — включая скрытые (PENDING) и демо. */
export default async function AdminPlacesPage(): Promise<React.ReactElement> {
  await requireAdmin();

  const places = await prisma.place.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      isDemo: true,
      imageUrl: true,
      _count: { select: { photos: true } },
    },
  });

  return (
    <section>
      <div className="admin-title-row">
        <h1>Места ({places.length})</h1>
        <Link href="/admin/places/new" className="admin-button">
          + Новое место
        </Link>
      </div>

      <ul className="admin-list">
        {places.map((place) => (
          <li key={place.id} className="admin-list-item">
            <Link href={`/admin/places/${place.id}`} className="admin-item-link">
              <span className="admin-item-name">{place.name}</span>
              <span className="admin-item-meta">
                /{place.slug} · фото: {place._count.photos + (place.imageUrl ? 1 : 0)}
                {place.status !== "APPROVED" ? " · скрыто с сайта" : ""}
                {place.isDemo ? " · демо" : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
