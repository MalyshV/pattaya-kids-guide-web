import { NotFoundContent } from "@/components/layout/not-found-content";

/** Корневая 404: адреса мимо всех роутов (например, опечатка в самом пути). */
export default function NotFound(): React.ReactElement {
  return <NotFoundContent />;
}
