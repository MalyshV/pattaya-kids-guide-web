import Link from "next/link";
import { getDictionary, langFromPath } from "@/content/dictionary";

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

  // #results: новая страница начинается с карточек, а не с шапки и стека
  // фильтров (Next сам подводит к якорю после навигации)
  return `${basePath}/activities?${searchParams.toString()}#results`;
}

export function ActivitiesPagination({
  currentPage,
  totalPages,
  basePath,
  age,
  category,
}: ActivitiesPaginationProps): React.ReactElement | null {
  const dict = getDictionary(langFromPath(basePath));

  if (totalPages <= 1) {
    return null;
  }

  const params = { age, category };
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className="pagination" aria-label={dict.pagination.activitiesAria}>
      <div className="pagination-info">
        {dict.pagination.pageOf(currentPage, totalPages)}
      </div>

      <div className="pagination-actions">
        {hasPrevious ? (
          <Link
            className="pagination-link"
            href={buildPageHref(currentPage - 1, params, basePath)}
          >
            ← {dict.pagination.previous}
          </Link>
        ) : (
          <span className="pagination-link pagination-link-disabled">
            ← {dict.pagination.previous}
          </span>
        )}

        {hasNext ? (
          <Link
            className="pagination-link"
            href={buildPageHref(currentPage + 1, params, basePath)}
          >
            {dict.pagination.next} →
          </Link>
        ) : (
          <span className="pagination-link pagination-link-disabled">
            {dict.pagination.next} →
          </span>
        )}
      </div>
    </nav>
  );
}
