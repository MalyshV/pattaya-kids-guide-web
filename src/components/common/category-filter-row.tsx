import Link from "next/link";
import { ScrollToHash } from "@/components/common/scroll-to-hash";
import { listHref } from "@/lib/params/list-href";

type CategoryFilterRowProps = {
  /** Подпись строки: «Тип занятий», «Тип места». */
  title: string;
  /** Подпись чипа «Все». */
  allLabel: string;
  /** Путь списка, на котором стоит строка. */
  pathname: string;
  /** Выбранная категория (?category=). */
  active?: string;
  /**
   * Остальные параметры списка (возраст, район, вид…) — переживают смену
   * типа. Без category: её ставит сама строка.
   */
  preservedParams: Record<string, string | undefined>;
  categories: { slug: string; name: string }[];
  /**
   * id блока — якорь для чипов категорий со страниц мест и занятий: переход
   * ведёт сразу к этой строке, а не к началу страницы.
   */
  anchorId: string;
};

/**
 * Строка чипов «Тип …» над результатами списка: «Все» + категории, одна
 * выбрана. Общая для мест и занятий.
 */
export function CategoryFilterRow({
  title,
  allLabel,
  pathname,
  active,
  preservedParams,
  categories,
  anchorId,
}: CategoryFilterRowProps): React.ReactElement | null {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="filters-panel" id={anchorId}>
      <ScrollToHash id={anchorId} />
      <div className="activity-filter-row">
        <span className="filter-group-label">{title}</span>
        <div className="filter-chips">
          <Link href={listHref(pathname, preservedParams)} className={chipClass(!active)}>
            {allLabel}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={listHref(pathname, { ...preservedParams, category: category.slug })}
              className={chipClass(active === category.slug)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function chipClass(active: boolean): string {
  return `filter-chip${active ? " filter-chip-active" : ""}`;
}
