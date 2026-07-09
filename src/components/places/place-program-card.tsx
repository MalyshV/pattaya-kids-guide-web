import Link from "next/link";
import type { PlaceProgramDto } from "@/dto/place-details.dto";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { computeEventStatus } from "@/lib/events/event-lifecycle";
import { dateLocale, getDictionary, langFromPath } from "@/content/dictionary";

type PlaceProgramCardProps = {
  program: PlaceProgramDto;
  basePath: string;
};

function formatMoney(amount: number, currency: string, lang: string): string {
  return `${amount.toLocaleString(dateLocale(lang))} ${currency}`;
}

export function PlaceProgramCard({
  program,
  basePath,
}: PlaceProgramCardProps): React.ReactElement {
  const lang = langFromPath(basePath);
  const dict = getDictionary(lang);
  const typeLabel =
    (dict.placeDetails.programTypes as Record<string, string>)[program.type] ??
    program.type;

  // Сезонная программа (лагерь) с датами показывает живой статус — тот же расчёт,
  // что у событий (идёт сейчас / скоро / прошло).
  const status =
    program.type === "CAMP" && program.startDate
      ? computeEventStatus(
          new Date(program.startDate),
          program.endDate ? new Date(program.endDate) : null,
          new Date(),
        )
      : undefined;

  const content = (
    <>
      <div className="program-card-head">
        <span className="program-type">{typeLabel}</span>
        {status ? <EventStatusBadge status={status} lang={lang} /> : null}
      </div>

      <h3 className="program-name">{program.name}</h3>

      {program.price != null ? (
        <p className="program-price">
          {program.oldPrice != null ? (
            <span className="program-old-price">
              {dict.placeDetails.programOldPrice(
                formatMoney(program.oldPrice, program.currency, lang),
              )}
            </span>
          ) : null}
          <span className="program-current-price">
            {formatMoney(program.price, program.currency, lang)}
          </span>
          {program.priceUnit ? (
            <span className="program-price-unit">{program.priceUnit}</span>
          ) : null}
        </p>
      ) : (
        <p className="program-price program-price-unknown">
          {dict.placeDetails.priceUnknown}
        </p>
      )}

      {program.description ? (
        <p className="program-description">{program.description}</p>
      ) : null}
    </>
  );

  // У занятий (COURSE/CAMP) есть своя страница — карточка ведёт на неё.
  // У абонементов страницы нет (slug=null) — остаются некликабельными.
  return program.slug ? (
    <Link
      href={`${basePath}/activities/${program.slug}`}
      className="program-card interactive-surface"
    >
      {content}
    </Link>
  ) : (
    <article className="program-card">{content}</article>
  );
}
