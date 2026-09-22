import Link from "next/link";
import type { ListView } from "@/lib/params/view-href";

type ViewToggleProps = {
  view: ListView;
  listHref: string;
  mapHref: string;
  labels: { list: string; map: string; aria: string };
};

/**
 * «Список | Карта» — общий для мест, событий и дней рождения. Без хуков:
 * работает и в серверной странице, и в клиентском компоненте (подписи
 * приходят пропом). scroll={false}: переключение не бросает в начало страницы.
 */
export function ViewToggle({
  view,
  listHref,
  mapHref,
  labels,
}: ViewToggleProps): React.ReactElement {
  const showMap = view === "map";

  return (
    <div className="view-toggle" role="group" aria-label={labels.aria}>
      <Link
        href={listHref}
        scroll={false}
        className={`view-toggle-option${!showMap ? " view-toggle-active" : ""}`}
        aria-current={!showMap ? "true" : undefined}
      >
        {labels.list}
      </Link>
      <Link
        href={mapHref}
        scroll={false}
        className={`view-toggle-option${showMap ? " view-toggle-active" : ""}`}
        aria-current={showMap ? "true" : undefined}
      >
        {labels.map}
      </Link>
    </div>
  );
}
