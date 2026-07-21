import { statusSortRank, type OpenStatus } from "@/lib/schedule/open-status";

/**
 * Порядок каталога мест (решение Вероники 2026-07): открытые сейчас выше
 * закрытых по живому статусу, а среди мест с ОДИНАКОВЫМ статусом — новые
 * (по дате добавления) первыми, чтобы свежие места были заметны и не тонули
 * в алфавите. Компаратор для Array.sort; сравнение чистое.
 */
export function compareCatalogOrder(
  a: { status: OpenStatus; createdAt: Date | string },
  b: { status: OpenStatus; createdAt: Date | string },
): number {
  const byStatus = statusSortRank(a.status) - statusSortRank(b.status);
  if (byStatus !== 0) {
    return byStatus;
  }
  // новее — выше: по убыванию времени создания. new Date() — терпимость к
  // кэш-хиту data-cache, где Prisma-даты уже сериализованы в строки
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}
