import Link from "next/link";
import { ru } from "@/content/ru";

type PlacesPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  openNow?: string;
  shelter?: string;
  workFriendly?: string;
  indoor?: string;
  outdoor?: string;
  hasFood?: string;
  hasWifi?: string;
  canLeaveChild?: string;
  animalContact?: string;
};

function buildPageHref(
  page: number,
  params: Record<string, string | undefined>,
  basePath: string,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  searchParams.set("page", String(page));

  return `${basePath}?${searchParams.toString()}`;
}

export function PlacesPagination({
  currentPage,
  totalPages,
  basePath,
  openNow,
  shelter,
  workFriendly,
  indoor,
  outdoor,
  hasFood,
  hasWifi,
  canLeaveChild,
  animalContact,
}: PlacesPaginationProps): React.ReactElement | null {
  if (totalPages <= 1) {
    return null;
  }

  const baseParams = {
    openNow,
    shelter,
    workFriendly,
    indoor,
    outdoor,
    hasFood,
    hasWifi,
    canLeaveChild,
    animalContact,
  };

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className="pagination" aria-label={ru.pagination.placesAria}>
      <div className="pagination-info">
        {ru.pagination.pageOf(currentPage, totalPages)}
      </div>

      <div className="pagination-actions">
        {hasPrevious ? (
          <Link
            className="pagination-link"
            href={buildPageHref(currentPage - 1, baseParams, basePath)}
          >
            ← {ru.pagination.previous}
          </Link>
        ) : (
          <span className="pagination-link pagination-link-disabled">
            ← {ru.pagination.previous}
          </span>
        )}

        {hasNext ? (
          <Link
            className="pagination-link"
            href={buildPageHref(currentPage + 1, baseParams, basePath)}
          >
            {ru.pagination.next} →
          </Link>
        ) : (
          <span className="pagination-link pagination-link-disabled">
            {ru.pagination.next} →
          </span>
        )}
      </div>
    </nav>
  );
}
