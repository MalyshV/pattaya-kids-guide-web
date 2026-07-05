import Link from "next/link";
import { ru } from "@/content/ru";

type EventsPaginationProps = {
  currentPage: number;
  totalPages: number;
  type?: string;
  basePath: string;
};

function buildPageHref(page: number, type: string | undefined, basePath: string): string {
  const searchParams = new URLSearchParams();

  if (type) {
    searchParams.set("type", type);
  }

  searchParams.set("page", String(page));

  return `${basePath}/events?${searchParams.toString()}`;
}

export function EventsPagination({
  currentPage,
  totalPages,
  type,
  basePath,
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
          <Link
            className="pagination-link"
            href={buildPageHref(currentPage - 1, type, basePath)}
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
            href={buildPageHref(currentPage + 1, type, basePath)}
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
