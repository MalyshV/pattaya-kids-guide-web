import { notFound } from "next/navigation";

/**
 * Ловушка путей мимо роутов (в т.ч. `/ru` без города и глубокие опечатки):
 * без корневого layout в src/app глобальный not-found недоступен, поэтому
 * несовпавшие адреса ловим здесь и отдаём стилизованную 404 сегмента [lang].
 * Конкретные роуты ([city] и глубже) выигрывают у catch-all по специфичности.
 */
export default function CatchAllPage(): never {
  notFound();
}
