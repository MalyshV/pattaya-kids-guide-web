import {
  SkeletonCardGrid,
  SkeletonChips,
  SkeletonFiltersPanel,
  SkeletonHero,
  SkeletonPage,
  SkeletonResultsHeader,
} from "@/components/common/skeletons";

/**
 * Скелетон занятий: формы повторяют страницу (hero → вопрос возраста → фильтр
 * по типу занятий → сетка карточек), чтобы при холодном старте БД родитель
 * видел знакомый каркас, а переход в контент не прыгал.
 */
export default function CityActivitiesLoading(): React.ReactElement {
  return (
    <SkeletonPage>
      <SkeletonHero />

      <SkeletonChips count={4} withLabel />

      {/* панель «Тип занятий» — чипы категорий, как в ActivityFilters */}
      <SkeletonFiltersPanel toggles={4} />

      <SkeletonResultsHeader />
      <SkeletonCardGrid gridClassName="activities-grid" count={6} />
    </SkeletonPage>
  );
}
