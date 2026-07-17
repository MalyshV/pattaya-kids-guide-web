import Link from "next/link";
import { getDictionary, langFromPath } from "@/content/dictionary";

type EventsPaginationProps = {
  currentPage: number;
  totalPages: number;
  type?: string;
  /// выбранный возраст (?age=) — переживает листание
  age?: string;
  basePath: string;
};

function buildPageHref(
  page: number,
  type: string | undefined,
  age: string | undefined,
  basePath: string,
): string {
  const searchParams = new URLSearchParams();

  if (type) {
    searchParams.set("type", type);
  }
  if (age) {
    searchParams.set("age", age);
  }

  searchParams.set("page", String(page));

  // #results: новая страница начинается с карточек, а не с шапки и стека
  // фильтров (Next сам подводит к якорю после навигации)
  return `${basePath}/events?${searchParams.toString()}#results`;
}

export function EventsPagination({
  currentPage,
  totalPages,
  type,
  age,
  basePath,
}: EventsPaginationProps): React.ReactElement | null {
  const dict = getDictionary(langFromPath(basePath));

  if (totalPages <= 1) {
    return null;
  }

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className="pagination" aria-label={dict.pagination.eventsAria}>
      <div className="pagination-info">
        {dict.pagination.pageOf(currentPage, totalPages)}
      </div>

      <div className="pagination-actions">
        {hasPrevious ? (
          <Link
            className="pagination-link"
            href={buildPageHref(currentPage - 1, type, age, basePath)}
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
            href={buildPageHref(currentPage + 1, type, age, basePath)}
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
