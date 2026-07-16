"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlaceCard } from "@/components/places/place-card";
import { PlacesMap, type PlaceMapMarker } from "@/components/places/places-map";
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
  /** ?view=map — карта вместо списка (уважает те же фильтры) */
  view: "list" | "map";
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
  view,
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
  const sortedTopRef = useRef<HTMLParagraphElement | null>(null);

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

  // Чипы — над списком: на телефоне сортировка происходит за нижним краем
  // экрана, и без скролла кажется, что нажатие не сработало. Как только
  // ближайшие отсортированы — плавно подводим к результатам.
  useEffect(() => {
    if (!nearActive) {
      return;
    }
    // behavior "auto": мгновенный скролл выполняется синхронно и не может
    // быть отменён — smooth-анимацию браузер гасил из-за одновременной
    // перестройки списка (проверено: она не начиналась вовсе)
    const timer = window.setTimeout(() => {
      sortedTopRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [nearActive]);

  // Ответ системы на «Рядом со мной» без успеха (отказ/ошибка/недоступно/
  // приглашение) рендерится ниже панели фильтров — на 375px он за экраном,
  // и чип выглядит сломанным. Подводим к сообщению так же, как к результатам.
  const nearStatusRef = useRef<HTMLDivElement | null>(null);
  const nearFeedbackKind =
    near && ["invite", "denied", "failed", "unavailable"].includes(geo.kind)
      ? geo.kind
      : null;
  useEffect(() => {
    if (!nearFeedbackKind) {
      return;
    }
    const timer = window.setTimeout(() => {
      nearStatusRef.current?.scrollIntoView({ behavior: "auto", block: "center" });
    }, 150);
    return () => {
      window.clearTimeout(timer);
    };
  }, [nearFeedbackKind]);

  const showMap = view === "map";

  // ссылка переключателя Список|Карта: те же фильтры, без page (карта
  // показывает всё, а список честно начинается с первой страницы)
  function buildViewHref(nextView: "list" | "map"): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(pagination)) {
      if (value) {
        params.set(key, value);
      }
    }
    params.delete("page");
    if (nextView === "map") {
      params.set("view", "map");
    } else {
      params.delete("view");
    }
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const viewToggle = (
    <div className="view-toggle" role="group" aria-label={dict.places.viewToggleAria}>
      <Link
        href={buildViewHref("list")}
        scroll={false}
        className={`view-toggle-option${!showMap ? " view-toggle-active" : ""}`}
        aria-current={!showMap ? "true" : undefined}
      >
        {dict.places.viewList}
      </Link>
      <Link
        href={buildViewHref("map")}
        scroll={false}
        className={`view-toggle-option${showMap ? " view-toggle-active" : ""}`}
        aria-current={showMap ? "true" : undefined}
      >
        {dict.places.viewMap}
      </Link>
    </div>
  );

  // Статусы геолокации — общие для списка и карты
  const nearStatus = (
    <div ref={nearStatusRef}>
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
    </div>
  );

  if (showMap) {
    // Карта показывает ВСЕ отфильтрованные места; при активном «Рядом со мной»
    // добавляются расстояния в попапах и точка «вы здесь».
    const withDistance = nearActive
      ? sortByDistance(items, geo.origin, ({ place }) =>
          Number.isFinite(place.latitude) && Number.isFinite(place.longitude)
            ? { latitude: place.latitude, longitude: place.longitude }
            : null,
        )
      : items.map((item) => ({ item, distanceM: null as number | null }));

    const markers: PlaceMapMarker[] = withDistance
      .filter(
        ({ item }) =>
          Number.isFinite(item.place.latitude) && Number.isFinite(item.place.longitude),
      )
      .map(({ item, distanceM }) => ({
        id: item.place.id,
        name: item.place.name,
        slug: item.place.slug,
        latitude: item.place.latitude,
        longitude: item.place.longitude,
        distanceLabel: distanceM !== null ? formatDistance(distanceM, lang) : undefined,
      }));

    // честность: место без координат на карте не покажешь — говорим об этом
    const missingCount = items.length - markers.length;

    return (
      <>
        {viewToggle}
        {nearStatus}
        {nearActive ? <p className="near-status">{dict.scenarios.nearMeActive}</p> : null}

        <PlacesMap
          markers={markers}
          userPoint={nearActive ? geo.origin : null}
          basePath={basePath}
        />

        {missingCount > 0 ? (
          <p className="near-status map-missing-note">
            {dict.places.mapMissingNote(missingCount)}
          </p>
        ) : null}
      </>
    );
  }

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
        {viewToggle}
        {/* подсказка про сортировку живёт здесь, а не у чипа: чип не знает,
            дал ли браузер позицию, и обещал бы «ближайшие» даже при отказе */}
        <p className="near-status near-sorted-anchor" ref={sortedTopRef}>
          {dict.scenarios.nearMeActive}
        </p>

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
      {viewToggle}
      {nearStatus}

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
