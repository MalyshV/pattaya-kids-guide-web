import Link from "next/link";
import type { SuggestKind } from "@/lib/suggest/submission";

type SuggestLinkProps = {
  basePath: string;
  /** тип, который форма выставит заранее (человек может поменять) */
  kind: SuggestKind;
  label: string;
};

/**
 * «Предложить своё» — справа от заголовка списка на каталогах (решение
 * Вероники 22.09). Тихая пилюля, как «Поделиться»: не спорит с контентом.
 * Без хуков — работает из серверной страницы.
 */
export function SuggestLink({
  basePath,
  kind,
  label,
}: SuggestLinkProps): React.ReactElement {
  return (
    <Link href={`${basePath}/suggest?type=${kind}`} className="suggest-cta">
      <span className="suggest-cta-plus" aria-hidden="true">
        +
      </span>
      {label}
    </Link>
  );
}
