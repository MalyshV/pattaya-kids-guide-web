import Link from "next/link";
import { getDictionary, langFromPath } from "@/content/dictionary";

type PlacesPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  age?: string;
  openNow?: string;
  openMorning?: string;
  shelter?: string;
  workFriendly?: string;
  indoor?: string;
  outdoor?: string;
  hasFood?: string;
  hasWifi?: string;
  hasAirCon?: string;
  hasParking?: string;
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
  age,
  openNow,
  openMorning,
  shelter,
  workFriendly,
  indoor,
  outdoor,
  hasFood,
  hasWifi,
  hasAirCon,
  hasParking,
  canLeaveChild,
  animalContact,
}: PlacesPaginationProps): React.ReactElement | null {
  const dict = getDictionary(langFromPath(basePath));

  if (totalPages <= 1) {
    return null;
  }

  const baseParams = {
    age,
    openNow,
    openMorning,
    shelter,
    workFriendly,
    indoor,
    outdoor,
    hasFood,
    hasWifi,
    hasAirCon,
    hasParking,
    canLeaveChild,
    animalContact,
  };

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className="pagination" aria-label={dict.pagination.placesAria}>
      <div className="pagination-info">
        {dict.pagination.pageOf(currentPage, totalPages)}
      </div>

      <div className="pagination-actions">
        {hasPrevious ? (
          <Link
            className="pagination-link"
            href={buildPageHref(currentPage - 1, baseParams, basePath)}
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
            href={buildPageHref(currentPage + 1, baseParams, basePath)}
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
