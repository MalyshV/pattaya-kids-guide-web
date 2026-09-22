import Link from "next/link";

type MapEmptyProps = {
  title: string;
  /** почему пусто — те же строки, что под картой («N прошедших…», «N без адреса…») */
  reasons: string[];
  /** назад к списку с теми же фильтрами */
  listHref: string;
  listLabel: string;
};

/**
 * Карта без единой точки — не рисуем пустую подложку (выглядит сломанной),
 * а спокойно называем настоящую причину (всё прошло / нет адреса) и ведём в
 * список с теми же фильтрами.
 */
export function MapEmpty({
  title,
  reasons,
  listHref,
  listLabel,
}: MapEmptyProps): React.ReactElement {
  return (
    <section className="empty-state" role="status">
      <h3>{title}</h3>
      {reasons.map((reason) => (
        <p key={reason}>{reason}</p>
      ))}
      <Link href={listHref} scroll={false} className="empty-state-cta">
        {listLabel}
      </Link>
    </section>
  );
}
