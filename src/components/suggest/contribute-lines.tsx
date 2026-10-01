import Link from "next/link";
import type { Dictionary } from "@/content/dictionary";
import { aboutFormPath, type AboutRef } from "@/lib/suggest/about";

type ContributeLinesProps = {
  basePath: string;
  about: AboutRef;
  dict: Dictionary;
};

/**
 * Две тихие строки внизу карточки места, события или занятия: родителям —
 * «Были здесь?», владельцам — «Это ваше место?» (решение Вероники 01.10).
 * Обе ведут в форму «Дополнить карточку»; владельцу галочка «я представляю»
 * ставится заранее. Без хуков — работает из серверной страницы.
 */
export function ContributeLines({
  basePath,
  about,
  dict,
}: ContributeLinesProps): React.ReactElement {
  const t = dict.suggest.about;
  return (
    <section className="contribute-lines" aria-label={t.linesLabel}>
      <p className="contribute-line">
        {t.parentQuestion[about.kind]}{" "}
        {/* форма закрыта от индексации — поисковикам ходить по ссылке незачем */}
        <Link href={`${basePath}${aboutFormPath(about)}`} rel="nofollow">
          {t.parentAction}
        </Link>
      </p>
      <p className="contribute-line">
        {t.ownerQuestion[about.kind]}{" "}
        <Link href={`${basePath}${aboutFormPath(about, true)}`} rel="nofollow">
          {t.ownerAction}
        </Link>
      </p>
    </section>
  );
}
