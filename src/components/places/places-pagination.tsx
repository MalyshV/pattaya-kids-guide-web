import Link from "next/link";

type PlacesPaginationProps = {
  currentPage: number;
  totalPages: number;
  indoor?: string;
  hasFood?: string;
  hasWifi?: string;
  canLeaveChild?: string;
  animalContact?: string;
};

function buildPageHref(page: number, params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  searchParams.set("page", String(page));

  return `/?${searchParams.toString()}`;
}

export function PlacesPagination({
  currentPage,
  totalPages,
  indoor,
  hasFood,
  hasWifi,
  canLeaveChild,
  animalContact,
}: PlacesPaginationProps): React.ReactElement | null {
  if (totalPages <= 1) {
    return null;
  }

  const baseParams = {
    indoor,
    hasFood,
    hasWifi,
    canLeaveChild,
    animalContact,
  };

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className="pagination" aria-label="Places pagination">
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>

      <div className="pagination-actions">
        {hasPrevious ? (
          <Link
            className="pagination-link"
            href={buildPageHref(currentPage - 1, baseParams)}
          >
            ← Previous
          </Link>
        ) : (
          <span className="pagination-link pagination-link-disabled">← Previous</span>
        )}

        {hasNext ? (
          <Link
            className="pagination-link"
            href={buildPageHref(currentPage + 1, baseParams)}
          >
            Next →
          </Link>
        ) : (
          <span className="pagination-link pagination-link-disabled">Next →</span>
        )}
      </div>
    </nav>
  );
}
