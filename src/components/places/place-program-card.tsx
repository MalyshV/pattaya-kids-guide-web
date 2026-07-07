import type { PlaceProgramDto } from "@/dto/place-details.dto";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { computeEventStatus } from "@/lib/events/event-lifecycle";
import { ru } from "@/content/ru";

type PlaceProgramCardProps = {
  program: PlaceProgramDto;
};

function formatMoney(amount: number, currency: string): string {
  return `${amount.toLocaleString("ru-RU")} ${currency}`;
}

export function PlaceProgramCard({ program }: PlaceProgramCardProps): React.ReactElement {
  const typeLabel =
    (ru.placeDetails.programTypes as Record<string, string>)[program.type] ??
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

  return (
    <article className="program-card">
      <div className="program-card-head">
        <span className="program-type">{typeLabel}</span>
        {status ? <EventStatusBadge status={status} /> : null}
      </div>

      <h3 className="program-name">{program.name}</h3>

      {program.price != null ? (
        <p className="program-price">
          {program.oldPrice != null ? (
            <span className="program-old-price">
              {ru.placeDetails.programOldPrice(
                formatMoney(program.oldPrice, program.currency),
              )}
            </span>
          ) : null}
          <span className="program-current-price">
            {formatMoney(program.price, program.currency)}
          </span>
          {program.priceUnit ? (
            <span className="program-price-unit">{program.priceUnit}</span>
          ) : null}
        </p>
      ) : (
        <p className="program-price program-price-unknown">
          {ru.placeDetails.priceUnknown}
        </p>
      )}

      {program.description ? (
        <p className="program-description">{program.description}</p>
      ) : null}
    </article>
  );
}
