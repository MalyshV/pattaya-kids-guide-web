import { NotFoundContent } from "@/components/layout/not-found-content";

/**
 * Городская 404: notFound() со страниц места/события и несуществующие пути
 * внутри города. Рендерится в city layout — шапка с навигацией остаётся.
 */
export default function CityNotFound(): React.ReactElement {
  return <NotFoundContent />;
}
