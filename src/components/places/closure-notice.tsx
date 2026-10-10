import Link from "next/link";
import type { Dictionary } from "@/content/dictionary";
import { dateLocale } from "@/content/dictionary";
import type { BrandSiblingDto } from "@/dto/brand-sibling.dto";
import type { Closure } from "@/lib/places/closure";
import { formatDistance } from "@/lib/geo/distance";

type ClosureNoticeProps = {
  closure: Closure;
  /** ближайшая другая точка сети (первая строка блока «Другие …»); null = не сеть или точек нет */
  nearest: BrandSiblingDto | null;
  /** других точек ровно одна — «Другая точка» вместо «Ближайшая другая точка» */
  onlyOne: boolean;
  basePath: string;
  lang: string;
  /** часовой пояс города: день закрытия считаем по нему, а не по серверу */
  timezone: string;
  dict: Dictionary;
};

function formatSince(date: Date, lang: string, timezone: string): string {
  return date.toLocaleDateString(dateLocale(lang), {
    timeZone: timezone,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Плашка закрытого места (docs/CHAINS_PLAN.md; решение 08.10): «Временно
 * закрыто · с 1 июля 2026 · дата открытия уточняется», фраза от руки и, если
 * место в сети, ближайшая другая точка — родитель сразу видит, куда ехать
 * вместо. Порядок «статус · с даты · про открытие» одинаков в трёх локалях.
 * Спокойно, без красного: закрытие — факт, а не тревога.
 */
export function ClosureNotice({
  closure,
  nearest,
  onlyOne,
  basePath,
  lang,
  timezone,
  dict,
}: ClosureNoticeProps): React.ReactElement {
  const status = dict.openStatus;
  const texts = dict.placeDetails.closure;
  const parts: string[] = [];
  if (closure.since) {
    parts.push(texts.since(formatSince(closure.since, lang, timezone)));
  }
  if (closure.kind === "temporarily") {
    parts.push(texts.reopenUnknown);
  }

  return (
    <div className="closure-notice" role="note">
      <p className="closure-line">
        <span className="open-status open-status-closed">
          {closure.kind === "permanently"
            ? status.closedPermanently
            : status.closedTemporarily}
        </span>
        {parts.map((part) => (
          <span key={part} className="closure-part">
            {part}
          </span>
        ))}
      </p>
      {closure.note ? <p className="closure-note">{closure.note}</p> : null}
      {nearest ? (
        <p className="closure-nearest">
          <span className="closure-nearest-label">
            {onlyOne ? texts.other : texts.nearest}:
          </span>{" "}
          <Link
            href={`${basePath}/places/${nearest.slug}`}
            className="closure-nearest-link"
          >
            {nearest.name}
          </Link>
          <span className="closure-nearest-distance">
            {" · "}
            {nearest.sameMall
              ? dict.placeDetails.chain.sameMall
              : formatDistance(nearest.distanceM, lang)}
          </span>
        </p>
      ) : null}
    </div>
  );
}
