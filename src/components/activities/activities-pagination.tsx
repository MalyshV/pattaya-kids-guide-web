import Link from "next/link";
import { ru } from "@/content/ru";

type ActivitiesPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  age?: string;
  category?: string;
};

function buildPageHref(
  page: number,
  params: { age?: string; category?: string },
  basePath: string,
): string {
  const searchParams = new URLSearchParams();

  if (params.age) {
    searchParams.set("age", params.age);
  }
  if (params.category) {
    searchParams.set("category", params.category);
  }

  searchParams.set("page", String(page));

  return `${basePath}/activities?${searchParams.toString()}`;
}

export function ActivitiesPagination({
  currentPage,
  totalPages,
  basePath,
  age,
  category,
}: ActivitiesPaginationProps): React.ReactElement | null {
  if (totalPages <= 1) {
    return null;
  }

  const params = { age, category };
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className="pagination" aria-label={ru.pagination.activitiesAria}>
      <div className="pagination-info">
        {ru.pagination.pageOf(currentPage, totalPages)}
      </div>

      <div className="pagination-actions">
        {hasPrevious ? (
          <Link
            className="pagination-link"
            href={buildPageHref(currentPage - 1, params, basePath)}
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
            href={buildPageHref(currentPage + 1, params, basePath)}
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
