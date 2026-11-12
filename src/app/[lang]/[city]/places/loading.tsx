import {
  SkeletonCardGrid,
  SkeletonChipFilterRow,
  SkeletonChips,
  SkeletonFiltersPanel,
  SkeletonHero,
  SkeletonPage,
  SkeletonResultsHeader,
} from "@/components/common/skeletons";

/**
 * Скелетон каталога мест — бывший скелетон корня города, переехал сюда вместе
 * с самим каталогом, когда корень стал посадочной. Формы повторяют страницу
 * (hero → вопрос возраста → чипы сценариев → «Тип места» → панель фасетов →
 * сетка карточек) — переход в настоящий контент не прыгает. 6 карточек = размер
 * страницы каталога (LIST_PAGE_SIZE).
 */
export default function CityPlacesLoading(): React.ReactElement {
  return (
    <SkeletonPage>
      <SkeletonHero />

      {/* вопрос возраста и сценарии — два ряда чипов, как на живой странице */}
      <SkeletonChips count={4} withLabel />
      <SkeletonChips count={5} />

      {/* «Тип места» — строка маленьких чипов («Все» + категории) */}
      <SkeletonChipFilterRow count={6} />
      <SkeletonFiltersPanel toggles={6} />

      <SkeletonResultsHeader />
      <SkeletonCardGrid gridClassName="places-grid" count={6} />
    </SkeletonPage>
  );
}
