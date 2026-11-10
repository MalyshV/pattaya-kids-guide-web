import Link from "next/link";
import { getDictionary, langFromPath } from "@/content/dictionary";
import type { SuggestKind } from "@/lib/suggest/submission";

type DistrictEmptyStateProps = {
  basePath: string;
  /** что искали в районе — от этого зависят текст и тип в форме */
  kind: Exclude<SuggestKind, "birthday">;
  /** тот же каталог без фильтров */
  allHref: string;
  allLabel: string;
};

/**
 * В выбранном районе ничего не нашлось (решение 10.11). Пустые районы из
 * выбора не прячем: пустой район — не тупик, а приглашение рассказать о
 * месте, занятии или событии, которого на сайте ещё нет. Главная кнопка
 * ведёт в форму «Предложить своё» с уже выбранным типом. Без хуков —
 * работает из серверной страницы.
 */
export function DistrictEmptyState({
  basePath,
  kind,
  allHref,
  allLabel,
}: DistrictEmptyStateProps): React.ReactElement {
  const text = getDictionary(langFromPath(basePath)).districts;

  return (
    <section className="empty-state">
      <h3>{text.emptyTitle}</h3>
      <p>{text.emptyInvite[kind]}</p>
      <div className="empty-state-actions">
        <Link href={`${basePath}/suggest?type=${kind}`} className="empty-state-cta">
          {text.emptySuggest[kind]}
        </Link>
        <Link href={allHref} className="empty-state-link">
          {allLabel}
        </Link>
      </div>
    </section>
  );
}
