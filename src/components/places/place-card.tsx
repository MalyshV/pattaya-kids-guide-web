import Link from "next/link";
import type { PlaceListItemDto } from "@/dto/place-list-item.dto";
import { OpenStatusBadge } from "@/components/places/open-status-badge";
import { LiveOpenStatusBadge } from "@/components/places/live-open-status-badge";
import { PlaceImage } from "@/components/places/place-image";
import { MemoryButtons } from "@/components/memory/memory-buttons";
import type { OpenStatus, ScheduleInput } from "@/lib/schedule/open-status";
import { getDictionary, langFromPath } from "@/content/dictionary";
import { pickLocalized } from "@/lib/i18n/localize";
import { isClosureStatus } from "@/lib/places/closure";

type PlaceCardProps = {
  place: PlaceListItemDto;
  basePath: string;
  status?: OpenStatus;
  /** расписание и пояс города — бейдж статуса живёт (пересчёт раз в минуту) */
  schedules?: ScheduleInput[];
  timezone?: string;
  /** «≈ 800 м» в режиме «Рядом со мной»; расстояние по прямой */
  distanceLabel?: string;
};

export function PlaceCard({
  place,
  basePath,
  status,
  schedules,
  timezone,
  distanceLabel,
}: PlaceCardProps): React.ReactElement {
  const lang = langFromPath(basePath);
  const dict = getDictionary(lang);
  // приглушаем «сегодня закрыто» и закрытые на время/насовсем — не прячем
  const isClosedToday =
    status !== undefined && (status.kind === "closedToday" || isClosureStatus(status));

  // одной строкой: район · В помещении · На улице (+ расстояние в «Рядом»)
  const formats = [
    place.district?.name ?? null,
    place.indoor ? dict.places.badgeIndoor : null,
    place.outdoor ? dict.places.badgeOutdoor : null,
  ].filter((label): label is string => label !== null);
  // удобства — тихой строкой через точку, а не россыпью чипов
  const facts = [
    place.hasAirCon ? dict.placeFilters.labels.hasAirCon : null,
    place.hasFood ? dict.places.features.food : null,
    place.hasWifi ? dict.places.features.wifi : null,
    place.canLeaveChild ? dict.places.features.childDropOff : null,
    place.animalContact ? dict.places.features.animals : null,
  ].filter((label): label is string => label !== null);

  return (
    <article className={`place-card${isClosedToday ? " place-card-closed" : ""}`}>
      <PlaceImage url={place.imageUrl} alt={place.name} />
      <MemoryButtons
        compact
        entity="place"
        slug={place.slug}
        name={place.name}
        imageUrl={place.imageUrl}
      />

      {status && status.kind !== "unknown" ? (
        <div className="place-card-status">
          {schedules && timezone ? (
            <LiveOpenStatusBadge
              initial={status}
              schedules={schedules}
              timezone={timezone}
              lang={lang}
            />
          ) : (
            <OpenStatusBadge status={status} lang={lang} />
          )}
        </div>
      ) : null}

      <h3 className="place-card-title">
        <Link href={`${basePath}/places/${place.slug}`} className="card-title-link">
          {place.name}
        </Link>
      </h3>

      {formats.length > 0 || distanceLabel ? (
        <p className="place-card-meta">
          {formats.join(" · ")}
          {distanceLabel ? (
            <span className="place-card-distance">
              {formats.length > 0 ? " · " : ""}
              {distanceLabel}
            </span>
          ) : null}
        </p>
      ) : null}

      <p className="place-card-description">
        {pickLocalized(
          place.description,
          place.descriptionEn,
          place.descriptionTh,
          lang,
        ) ?? dict.common.descriptionFallback}
      </p>

      <div className="place-card-actions">
        <div className="place-card-foot">
          <p className="place-card-facts">{facts.join(" · ")}</p>
          {/* вся карточка уже кликабельна ссылкой-заголовком (растянута ::after);
              этот CTA — визуальный дубль той же ссылки, поэтому прячем его от
              скринридера и с клавиатуры, чтобы не было двух одинаковых «Подробнее» */}
          <Link
            href={`${basePath}/places/${place.slug}`}
            className="place-card-cta"
            aria-hidden="true"
            tabIndex={-1}
          >
            <span className="place-card-cta-text">{dict.common.detailsCta}</span>
            <span className="place-card-cta-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
