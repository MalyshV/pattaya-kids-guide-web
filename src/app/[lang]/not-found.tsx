import { NotFoundContent } from "@/components/layout/not-found-content";

/**
 * 404 уровня языка: адреса мимо всех роутов (catch-all ниже), неизвестный
 * город и notFound() из city layout. Рендерится в layout сегмента [lang] —
 * <html lang> корректный, шапки нет (город неизвестен или невалиден).
 */
export default function LangNotFound(): React.ReactElement {
  return <NotFoundContent />;
}
