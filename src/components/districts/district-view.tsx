"use client";

import { useState } from "react";
import Link from "next/link";
import { PlaceImage } from "@/components/places/place-image";
import { MapPinIcon, PlacesMap, type MapLabel } from "@/components/places/places-map";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import type { DistrictItemDto } from "@/dto/district-item.dto";
import type { MapPointKind } from "@/dto/map-point.dto";

/**
 * Страница района: слева — что это за район и всё, что в нём есть, справа —
 * карта, где район остаётся белым листом, а остальной город слегка приглушён.
 * Переключатели «Места / События / Занятия» действуют сразу на список и на
 * карту, поэтому обе половины живут в одном клиентском компоненте.
 */

/** порядок групп — как в навигации сайта */
const KIND_ORDER: readonly MapPointKind[] = ["place", "event", "activity"];

type DistrictViewProps = {
  basePath: string;
  name: string;
  /** «12 мест · 4 занятия · 1 событие» */
  countsLabel: string | null;
  /** 2–3 строки о районе для семьи; пока текста нет — блока нет */
  note: string | null;
  items: DistrictItemDto[];
  boundary: Array<[number, number]>;
  frame: Array<[number, number]>;
  labels: MapLabel[];
  /** каталог мест с фильтром по этому району */
  catalogHref: string;
  /** якорь списка всех районов внизу страницы */
  allDistrictsHref: string;
};

export function DistrictView({
  basePath,
  name,
  countsLabel,
  note,
  items,
  boundary,
  frame,
  labels,
  catalogHref,
  allDistrictsHref,
}: DistrictViewProps): React.ReactElement {
  const dict = useDictionary();
  const text = dict.districtPage;
  const [hidden, setHidden] = useState<ReadonlySet<MapPointKind>>(new Set());

  const kindLabel: Record<MapPointKind, string> = {
    place: dict.nav.places,
    event: dict.nav.events,
    activity: dict.nav.activities,
  };
  const groups = KIND_ORDER.map((kind) => ({
    kind,
    items: items.filter((item) => item.kind === kind),
  })).filter((group) => group.items.length > 0);
  const presentKinds = groups.map((group) => group.kind);
  const shownGroups = groups.filter((group) => !hidden.has(group.kind));
  const shownItems = items.filter((item) => !hidden.has(item.kind));
  const hasPlaces = presentKinds.includes("place");

  const toggle = (kind: MapPointKind): void => {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(kind)) {
        next.delete(kind);
      } else {
        next.add(kind);
      }
      return next;
    });
  };

  return (
    <div className="district-layout">
      <div className="district-aside">
        <div className="district-head">
          <div className="district-head-top">
            <p className="eyebrow district-eyebrow">
              <span className="district-dot" aria-hidden="true" />
              {dict.districts.title}
            </p>
            <a href={allDistrictsHref} className="district-all-link">
              {text.allDistricts}
            </a>
          </div>
          <h1 className="district-title">{name}</h1>
          {countsLabel ? <p className="district-counts">{countsLabel}</p> : null}
        </div>

        {note ? <p className="district-note">{note}</p> : null}

        {/* переключатели нужны, только когда в районе больше одного типа */}
        {presentKinds.length > 1 ? (
          <div className="district-kinds" role="group" aria-label={text.kindsAria}>
            {presentKinds.map((kind) => (
              <button
                key={kind}
                type="button"
                className="district-kind"
                aria-pressed={!hidden.has(kind)}
                onClick={() => toggle(kind)}
              >
                <MapPinIcon kind={kind} />
                {kindLabel[kind]}
              </button>
            ))}
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="district-empty">
            <p className="district-empty-title">{text.emptyTitle}</p>
            <p>{text.emptyHint}</p>
          </div>
        ) : shownGroups.length === 0 ? (
          <p className="district-empty" role="status">
            {text.emptyKinds}
          </p>
        ) : (
          shownGroups.map((group) => (
            <section key={group.kind} className="district-group">
              <h2 className="district-group-title">
                {kindLabel[group.kind]}
                <span className="district-group-count">{group.items.length}</span>
              </h2>
              <ul className="district-rows">
                {group.items.map((item) => (
                  <li key={`${item.kind}:${item.id}`}>
                    <Link
                      href={item.href}
                      className={`district-row${item.muted ? " district-row-muted" : ""}`}
                    >
                      <PlaceImage
                        url={item.imageUrl}
                        alt=""
                        sizes="72px"
                        placeholderSeed={item.name}
                      />
                      <span className="district-row-text">
                        <span className="district-row-name">{item.name}</span>
                        {item.meta ? (
                          <span className="district-row-meta">{item.meta}</span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}

        {hasPlaces ? (
          <Link href={catalogHref} className="district-catalog-link">
            {text.catalogLink}
            <span aria-hidden="true"> →</span>
          </Link>
        ) : null}
      </div>

      <div className="district-map">
        <PlacesMap
          className="district-map-wrap"
          markers={shownItems}
          userPoint={null}
          basePath={basePath}
          regionLabel={text.mapAria(name)}
          focusBoundary={boundary}
          frame={frame}
          labels={labels}
        />
      </div>
    </div>
  );
}
