import Link from "next/link";

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
    <nav className="pagination" aria-label="Events pagination">
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>

      <div className="pagination-actions">
        {hasPrevious ? (
          <Link className="pagination-link" href={buildPageHref(currentPage - 1, type)}>
            ← Previous
          </Link>
        ) : (
          <span className="pagination-link pagination-link-disabled">← Previous</span>
        )}

        {hasNext ? (
          <Link className="pagination-link" href={buildPageHref(currentPage + 1, type)}>
            Next →
          </Link>
        ) : (
          <span className="pagination-link pagination-link-disabled">Next →</span>
        )}
      </div>
    </nav>
  );
}
