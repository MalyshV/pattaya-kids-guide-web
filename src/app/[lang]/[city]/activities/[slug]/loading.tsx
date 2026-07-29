import { SkeletonDetailPage } from "@/components/common/skeletons";

/** Скелетон детальной занятия: общая форма деталей (обложка → заголовок →
 *  чипы → текст) — при холодном старте БД вместо белого экрана. */
export default function ActivityDetailsLoading(): React.ReactElement {
  return <SkeletonDetailPage />;
}
