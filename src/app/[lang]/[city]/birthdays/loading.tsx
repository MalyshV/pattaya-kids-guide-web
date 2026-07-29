import {
  SkeletonCardGrid,
  SkeletonHero,
  SkeletonPage,
} from "@/components/common/skeletons";

/**
 * Скелетон лендинга «Дни рождения»: формы повторяют страницу (hero → вертикаль
 * широких карточек площадок), чтобы при холодном старте БД родитель видел
 * знакомый каркас. Чипов и фильтров у лендинга нет — их нет и здесь; карточек
 * три: список вертикальный, простыня выше экрана скелетону ни к чему.
 */
export default function CityBirthdaysLoading(): React.ReactElement {
  return (
    <SkeletonPage>
      <SkeletonHero />
      <SkeletonCardGrid gridClassName="birthday-list" count={3} />
    </SkeletonPage>
  );
}
