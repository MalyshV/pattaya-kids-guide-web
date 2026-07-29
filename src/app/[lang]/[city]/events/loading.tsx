import {
  SkeletonCardGrid,
  SkeletonChips,
  SkeletonFiltersPanel,
  SkeletonHero,
  SkeletonPage,
  SkeletonResultsHeader,
} from "@/components/common/skeletons";

/**
 * Скелетон афиши: формы повторяют страницу (hero → вопрос возраста → вкладки
 * идёт/будущие/прошедшие → сетка карточек), чтобы при холодном старте БД
 * родитель видел знакомый каркас, а переход в контент не прыгал.
 */
export default function CityEventsLoading(): React.ReactElement {
  return (
    <SkeletonPage>
      <SkeletonHero />

      <SkeletonChips count={4} withLabel />

      {/* панель вкладок жизненного цикла — три плитки, как в EventFilters */}
      <SkeletonFiltersPanel toggles={3} />

      <SkeletonResultsHeader />
      <SkeletonCardGrid gridClassName="events-grid" count={6} />
    </SkeletonPage>
  );
}
