import { notFound } from "next/navigation";

/**
 * Ловушка путей мимо роутов админки: без корневого layout в src/app
 * глобальный not-found недоступен — несовпавшие /admin/* ловим здесь.
 * Обязательный catch-all (не опциональный): /admin занят page.tsx.
 */
export default function AdminCatchAllPage(): never {
  notFound();
}
