import {
  SkeletonCardGrid,
  SkeletonChipFilterRow,
  SkeletonChips,
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

      {/* панель «Тип занятий» — строка маленьких чипов, как в ActivityFilters
          («Все» + категории); плитки-фасеты были бы вдвое выше настоящего */}
      <SkeletonChipFilterRow count={5} />

      <SkeletonResultsHeader />
      <SkeletonCardGrid gridClassName="activities-grid" count={6} />
    </SkeletonPage>
  );
}
