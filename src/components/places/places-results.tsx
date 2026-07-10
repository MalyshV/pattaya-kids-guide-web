"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlaceCard } from "@/components/places/place-card";
import { PlacesPagination } from "@/components/places/places-pagination";
import { formatDistance, sortByDistance, type GeoPoint } from "@/lib/geo/distance";
import { useDictionary, useLang } from "@/lib/i18n/use-dictionary";
import type { PlaceListItemDto } from "@/dto/place-list-item.dto";
import type { OpenStatus } from "@/lib/schedule/open-status";

/**
 * Результаты списка мест. Обычный режим — серверная сортировка и пагинация,
 * как раньше. Режим «Рядом со мной» (?near=true) — геопозиция запрашивается
 * ТОЛЬКО в браузере и никуда не отправляется: сортировка по близости и
 * расстояния считаются на клиенте, в URL и на сервер координаты не попадают.
 *
 * Промпт геолокации появляется только после жеста пользователя: клик по чипу
 * или по кнопке-приглашению. Чужая ссылка ?near=true промпт сама не вызывает.
 */

type PlaceWithStatus = {
  place: PlaceListItemDto;
  status: OpenStatus;
};

type PlacesResultsProps = {
  /** ВСЕ отфильтрованные места в серверном порядке (открытые выше) */
  items: PlaceWithStatus[];
  near: boolean;
  basePath: string;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  /** параметры для ссылок пагинации (сохраняются между страницами) */
  pagination: Record<string, string | undefined>;
};

type GeoState =
  | { kind: "idle" }
  /** ссылка ?near=true открыта без жеста — ждём явного согласия кнопкой */
  | { kind: "invite" }
  | { kind: "locating" }
  | { kind: "ready"; origin: GeoPoint }
  | { kind: "denied" }
  | { kind: "failed" }
  | { kind: "unavailable" };

export function PlacesResults({
  items,
  near,
  basePath,
  currentPage,
  totalPages,
  pageSize,
  pagination,
}: PlacesResultsProps): React.ReactElement {
  const dict = useDictionary();
  const lang = useLang();
  const router = useRouter();
  const [geo, setGeo] = useState<GeoState>({ kind: "idle" });
  // Подстройка состояния при смене пропа near — во время рендера (паттерн
  // React «adjusting state when props change», эффект для этого не нужен).
  const [prevNearProp, setPrevNearProp] = useState(near);
  // true = режим включили чипом при живом компоненте (это жест пользователя);
  // false = компонент смонтирован уже с near=true (открыли ссылку)
  const [activatedByGesture, setActivatedByGesture] = useState(false);

  if (near !== prevNearProp) {
    setPrevNearProp(near);
    if (near) {
      setActivatedByGesture(true);
    } else {
      // режим выключили — позицию забываем: при следующем включении честно
      // перезапросим (свежий замер ≤5 минут браузер отдаст из кэша сам)
      setActivatedByGesture(false);
      setGeo({ kind: "idle" });
    }
  }

  const requestPosition = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGeo({ kind: "unavailable" });
      return;
    }

    setGeo({ kind: "locating" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeo({
          kind: "ready",
          origin: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => {
        setGeo({
          kind: error.code === error.PERMISSION_DENIED ? "denied" : "failed",
        });
      },
      // высокая точность не нужна — округляем до 50 м; кэш позиции на 5 минут
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  }, []);

  useEffect(() => {
    // работаем только из «покоя»: locating/ready/denied/… не трогаем
    if (!near || geo.kind !== "idle") {
      return;
    }

    // Сначала спрашиваем у браузера состояние разрешения (это внешняя система,
    // отвечает колбэком). Запрос позиции:
    //  - разрешение уже дано — запрашиваем молча, промпта не будет;
    //  - включили чипом (жест) — запрашиваем, промпт уместен;
    //  - чужая ссылка ?near=true без разрешения — только спокойное приглашение,
    //    системный промпт без жеста пугает.
    const permissionState: Promise<string> =
      typeof navigator !== "undefined" && "permissions" in navigator
        ? navigator.permissions
            .query({ name: "geolocation" })
            .then((status) => status.state)
            .catch(() => "prompt")
        : Promise.resolve("prompt");

    let cancelled = false;
    void permissionState.then((state) => {
      if (cancelled) {
        return;
      }
      if (state === "denied") {
        setGeo({ kind: "denied" });
      } else if (state === "granted" || activatedByGesture) {
        requestPosition();
      } else {
        setGeo({ kind: "invite" });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [near, geo.kind, activatedByGesture, requestPosition]);

  const nearActive = near && geo.kind === "ready";

  // ?page бессмыслен в режиме «ближайшие» (показываем всё без пагинации) —
  // тихо убираем его из URL, чтобы перезагрузка/шеринг не открывали страницу 3
  useEffect(() => {
    if (!nearActive) {
      return;
    }
    const url = new URL(window.location.href);
    if (!url.searchParams.has("page")) {
      return;
    }
    url.searchParams.delete("page");
    router.replace(`${url.pathname}${url.search}`, { scroll: false });
  }, [nearActive, router]);

  if (nearActive) {
    // Ближайшие сверху, все на одной странице (пагинация по расстоянию
    // сбивала бы с толку); места без координат честно в конце без бейджа.
    const sorted = sortByDistance(items, geo.origin, ({ place }) =>
      Number.isFinite(place.latitude) && Number.isFinite(place.longitude)
        ? { latitude: place.latitude, longitude: place.longitude }
        : null,
    );

    return (
      <>
        {/* подсказка про сортировку живёт здесь, а не у чипа: чип не знает,
            дал ли браузер позицию, и обещал бы «ближайшие» даже при отказе */}
        <p className="near-status">{dict.scenarios.nearMeActive}</p>

        <section className="places-grid">
          {sorted.map(({ item, distanceM }) => (
            <PlaceCard
              key={item.place.id}
              place={item.place}
              basePath={basePath}
              status={item.status}
              distanceLabel={
                distanceM !== null ? formatDistance(distanceM, lang) : undefined
              }
            />
          ))}
        </section>
      </>
    );
  }

  const pageItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      {near && geo.kind === "invite" ? (
        <p className="near-status">
          {dict.places.nearInvite}{" "}
          <button type="button" className="near-cta" onClick={requestPosition}>
            {dict.places.nearInviteCta}
          </button>
        </p>
      ) : null}

      {near && geo.kind === "locating" ? (
        <p className="near-status" role="status" aria-live="polite">
          {dict.places.nearLocating}
        </p>
      ) : null}

      {near && geo.kind === "denied" ? (
        <p className="near-status" role="status">
          {dict.places.nearDenied}
        </p>
      ) : null}

      {near && geo.kind === "failed" ? (
        <p className="near-status" role="status">
          {dict.places.nearFailed}{" "}
          <button type="button" className="near-cta" onClick={requestPosition}>
            {dict.places.nearRetry}
          </button>
        </p>
      ) : null}

      {near && geo.kind === "unavailable" ? (
        <p className="near-status" role="status">
          {dict.places.nearUnavailable}
        </p>
      ) : null}

      <section className="places-grid">
        {pageItems.map(({ place, status }) => (
          <PlaceCard key={place.id} place={place} basePath={basePath} status={status} />
        ))}
      </section>

      <PlacesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
        {...pagination}
      />
    </>
  );
}
