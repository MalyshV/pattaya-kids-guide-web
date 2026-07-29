import { SkeletonDetailPage } from "@/components/common/skeletons";

/** Скелетон детальной события: общая форма деталей (обложка → заголовок →
 *  чипы → текст) — при холодном старте БД вместо белого экрана. */
export default function EventDetailsLoading(): React.ReactElement {
  return <SkeletonDetailPage />;
}
