import {
  SkeletonCardGrid,
  SkeletonChips,
  SkeletonFiltersPanel,
  SkeletonHero,
  SkeletonPage,
  SkeletonResultsHeader,
} from "@/components/common/skeletons";

/**
 * Скелетон каталога мест — бывший скелетон корня города, переехал сюда вместе
 * с самим каталогом, когда корень стал посадочной. Формы повторяют страницу
 * (hero → поиск → вопрос возраста → чипы сценариев → панель фасетов → сетка
 * карточек) — переход в настоящий контент не прыгает. 6 карточек = размер
 * страницы каталога (LIST_PAGE_SIZE).
 */
export default function CityPlacesLoading(): React.ReactElement {
  return (
    <SkeletonPage>
      <SkeletonHero />

      <div className="skeleton-search" aria-hidden="true" />

      {/* вопрос возраста и сценарии — два ряда чипов, как на живой странице */}
      <SkeletonChips count={4} withLabel />
      <SkeletonChips count={5} />

      <SkeletonFiltersPanel toggles={6} />

      <SkeletonResultsHeader />
      <SkeletonCardGrid gridClassName="places-grid" count={6} />
    </SkeletonPage>
  );
}
