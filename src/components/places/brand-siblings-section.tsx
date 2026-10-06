import Link from "next/link";
import type { BrandSiblingDto } from "@/dto/brand-sibling.dto";
import type { Dictionary } from "@/content/dictionary";
import { MemoryRowMarks } from "@/components/memory/memory-row-marks";
import { formatDistance } from "@/lib/geo/distance";
import { splitBrandSiblingRows } from "@/lib/places/brand-siblings";

type BrandSiblingsSectionProps = {
  /** имя сети как на вывеске («Skippy Land») */
  brandName: string;
  /** город на языке страницы — словарь сам ставит предлог («в Паттайе») */
  cityName: string;
  /** строки — уже отсортированы по расстоянию (buildBrandSiblingRows) */
  rows: BrandSiblingDto[];
  basePath: string;
  lang: string;
  dict: Dictionary;
};

function currencySymbol(code: string): string {
  return code === "THB" ? "฿" : code;
}

/**
 * Факты строки одной фразой через « · »: расстояние (или «в этом же ТЦ»),
 * «вход от 60 ฿», подпись сеанса, «можно оставить ребёнка». Чего нет —
 * пропускаем молча: «уточняется» в короткой строке только шумит, подробности
 * на странице самой точки.
 */
function factsLine(row: BrandSiblingDto, lang: string, dict: Dictionary): string {
  const s = dict.placeDetails.summary;
  const facts: string[] = [
    row.sameMall ? dict.placeDetails.chain.sameMall : formatDistance(row.distanceM, lang),
  ];
  if (row.entryFrom) {
    facts.push(
      s.entryFrom(`${row.entryFrom.amount} ${currencySymbol(row.entryFrom.currency)}`),
    );
  }
  if (row.sessionLabel) {
    facts.push(row.sessionLabel);
  }
  if (row.canLeaveChild) {
    facts.push(s.canLeave);
  }
  return facts.join(" · ");
}

function SiblingRow({
  row,
  basePath,
  lang,
  dict,
}: {
  row: BrandSiblingDto;
  basePath: string;
  lang: string;
  dict: Dictionary;
}): React.ReactElement {
  return (
    <li className="brand-sibling">
      <div className="brand-sibling-head">
        <Link href={`${basePath}/places/${row.slug}`} className="brand-sibling-name">
          {row.name}
        </Link>
        <MemoryRowMarks entity="place" slug={row.slug} />
      </div>
      <p className="brand-sibling-facts">{factsLine(row, lang, dict)}</p>
      {row.note ? <p className="brand-sibling-note">{row.note}</p> : null}
    </li>
  );
}

/**
 * Блок «Другие {сеть} в {городе}» (docs/CHAINS_PLAN.md): короткие строки про
 * остальные точки сети в этом городе — сравнение простым языком, без
 * таблицы (на телефоне с тайским текстом она разваливается) и без страницы
 * бренда. Больше трёх — первые три, остальные под «ещё N» (нативный
 * <details>: без JS, спокойно). Нет других точек — секции нет вовсе.
 */
export function BrandSiblingsSection({
  brandName,
  cityName,
  rows,
  basePath,
  lang,
  dict,
}: BrandSiblingsSectionProps): React.ReactElement | null {
  if (rows.length === 0) {
    return null;
  }

  const { shown, more } = splitBrandSiblingRows(rows);
  const chain = dict.placeDetails.chain;

  return (
    <section className="details-section" aria-labelledby="brand-siblings-title">
      <h2 className="section-title" id="brand-siblings-title">
        {chain.title(brandName, dict.common.inCity(cityName))}
      </h2>
      <ul className="brand-siblings">
        {shown.map((row) => (
          <SiblingRow
            key={row.slug}
            row={row}
            basePath={basePath}
            lang={lang}
            dict={dict}
          />
        ))}
      </ul>
      {more.length > 0 ? (
        <details className="brand-siblings-more">
          <summary className="brand-siblings-more-summary">
            {chain.more(more.length)}
          </summary>
          <ul className="brand-siblings">
            {more.map((row) => (
              <SiblingRow
                key={row.slug}
                row={row}
                basePath={basePath}
                lang={lang}
                dict={dict}
              />
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
