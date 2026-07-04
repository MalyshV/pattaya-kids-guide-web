import Link from "next/link";
import { ru } from "@/content/ru";

type EventsPaginationProps = {
  currentPage: number;
  totalPages: number;
  type?: string;
};

function buildPageHref(page: number, type?: string): string {
  const searchParams = new URLSearchParams();

  if (type) {
    searchParams.set("type", type);
  }

  searchParams.set("page", String(page));

  return `/events?${searchParams.toString()}`;
}

export function EventsPagination({
  currentPage,
  totalPages,
  type,
}: EventsPaginationProps): React.ReactElement | null {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className="pagination" aria-label={ru.pagination.eventsAria}>
      <div className="pagination-info">
        {ru.pagination.pageOf(currentPage, totalPages)}
      </div>

      <div className="pagination-actions">
        {hasPrevious ? (
          <Link className="pagination-link" href={buildPageHref(currentPage - 1, type)}>
            ← {ru.pagination.previous}
          </Link>
        ) : (
          <span className="pagination-link pagination-link-disabled">
            ← {ru.pagination.previous}
          </span>
        )}

        {hasNext ? (
          <Link className="pagination-link" href={buildPageHref(currentPage + 1, type)}>
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
