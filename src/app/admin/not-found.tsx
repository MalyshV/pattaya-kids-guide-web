import { NotFoundContent } from "@/components/layout/not-found-content";

/** 404 админки: опечатки в /admin/* (ловит catch-all). Уводит в каталог. */
export default function AdminNotFound(): React.ReactElement {
  return <NotFoundContent />;
}
