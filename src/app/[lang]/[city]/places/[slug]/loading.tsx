import { SkeletonDetailPage } from "@/components/common/skeletons";

/** Скелетон детальной места: общая форма деталей (обложка → заголовок →
 *  чипы → текст) — при холодном старте БД вместо белого экрана. */
export default function PlaceDetailsLoading(): React.ReactElement {
  return <SkeletonDetailPage />;
}
