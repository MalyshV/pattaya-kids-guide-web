"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { PlaceImage } from "@/components/places/place-image";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useParentMemory } from "@/lib/memory/use-parent-memory";
import {
  itemKey,
  listByKind,
  type MemoryEntity,
  type MemoryItem,
  type MemoryKind,
} from "@/lib/memory/parent-memory";
import {
  parseSavedTab,
  SAVED_TAB_PARAM,
  SAVED_TABS,
  savedPageHref,
} from "@/lib/memory/saved-tab";
import { cityBasePath, DEFAULT_CITY_SLUG, DEFAULT_LANG } from "@/lib/geo/base-path";

const ENTITY_PATH: Record<MemoryEntity, string> = {
  place: "places",
  activity: "activities",
  event: "events",
};

/**
 * Страница «Нравится · Уже были» — рисуется целиком из localStorage (снимки
 * name/imageUrl сохранены при клике), поэтому не ходит в БД. Ссылка ведёт на
 * актуальную страницу, где данные свежие. До гидрации показываем только
 * заголовок и вступление: разделы появляются, когда память прочитана, —
 * иначе после перезагрузки мигало «Пока пусто», будто всё пропало.
 *
 * Два списка — две вкладки (решение 10.11): меню шапки предлагает выбор
 * «Нравится» или «Уже были», и страница показывает именно выбранный список,
 * а не оба сразу. Вкладка живёт в URL (?tab=visited).
 *
 * Закладки общие для всех городов: ссылка ведёт в город записи, а подпись
 * города появляется, только когда в списке больше одного города.
 */
export function SavedList({
  age,
  cityNames,
}: {
  age?: string | null;
  /** slug города → название на языке страницы */
  cityNames: Record<string, string>;
}): React.ReactElement {
  const params = useParams<{ lang?: string; city?: string }>();
  const lang = params.lang ?? DEFAULT_LANG;
  const city = params.city ?? DEFAULT_CITY_SLUG;
  const basePath = cityBasePath(lang, city);
  // назад в каталог (тексты обещают «К местам») — с возрастом, который
  // родитель уже выбирал
  const catalogPath = `${basePath}/places`;
  const backHref = age ? `${catalogPath}?age=${encodeURIComponent(age)}` : catalogPath;
  const dict = useDictionary();
  const { items, hydrated, toggle } = useParentMemory();

  // × убирал запись мгновенно и безвозвратно — промах пальцем терял закладку.
  // Держим снимок последнего удалённого и даём «Вернуть» несколько секунд.
  const [removed, setRemoved] = useState<MemoryItem | null>(null);
  const undoTimerRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (undoTimerRef.current !== null) {
        window.clearTimeout(undoTimerRef.current);
      }
    };
  }, []);

  const removeWithUndo = (item: MemoryItem, kind: MemoryKind): void => {
    toggle(
      {
        entity: item.entity,
        city: item.city,
        slug: item.slug,
        name: item.name,
        imageUrl: item.imageUrl,
      },
      kind,
    );
    setRemoved(item);
    if (undoTimerRef.current !== null) {
      window.clearTimeout(undoTimerRef.current);
    }
    undoTimerRef.current = window.setTimeout(() => setRemoved(null), 6000);
  };

  const restoreRemoved = (): void => {
    if (!removed) {
      return;
    }
    toggle(
      {
        entity: removed.entity,
        city: removed.city,
        slug: removed.slug,
        name: removed.name,
        imageUrl: removed.imageUrl,
      },
      removed.kind,
    );
    setRemoved(null);
  };

  // «Скрыть, где уже были» в разделе «Нравится» (просьба Вероники 21.09):
  // понравившееся остаётся понравившимся, просто не мешает искать новое
  const [hideVisited, setHideVisited] = useState(false);

  const searchParams = useSearchParams();
  const tab = parseSavedTab(searchParams.get(SAVED_TAB_PARAM));
  const tabRefs = useRef<Partial<Record<MemoryKind, HTMLButtonElement | null>>>({});

  // Переключение — без похода на сервер: списки уже в памяти браузера.
  // history.replaceState Next подхватывает сам (useSearchParams обновится).
  const selectTab = (next: MemoryKind): void => {
    window.history.replaceState(null, "", savedPageHref(basePath, { age, tab: next }));
  };

  // старая ссылка из меню шапки вела на якорь #visited — открываем вкладку
  useEffect(() => {
    if (window.location.hash === "#visited") {
      window.history.replaceState(
        null,
        "",
        savedPageHref(basePath, { age, tab: "visited" }),
      );
    }
  }, [basePath, age]);

  // стрелки листают вкладки (как положено tablist), фокус идёт за выбором
  const onTabsKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }
    event.preventDefault();
    const next: MemoryKind = tab === "saved" ? "visited" : "saved";
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  const saved = listByKind(items, "saved");
  const visited = listByKind(items, "visited");
  const isEmpty = hydrated && saved.length === 0 && visited.length === 0;
  // «то же самое» = тот же город + сущность + slug (slug уникален в городе)
  const sameThing = (item: MemoryItem): string =>
    `${item.city}:${item.entity}:${item.slug}`;
  const visitedKeys = new Set(visited.map(sameThing));
  const likedVisitedCount = saved.filter((item) =>
    visitedKeys.has(sameThing(item)),
  ).length;
  // подпись города нужна, только когда закладки из разных городов
  const multiCity = new Set(items.map((item) => item.city)).size > 1;

  // switch без default: добавят сущность в MemoryEntity — TS потребует новую
  // ветку (как исчерпывающий ENTITY_PATH), молчаливого «Событие» не случится
  const entityLabel = (entity: MemoryEntity): string => {
    switch (entity) {
      case "place":
        return dict.memory.entityPlace;
      case "activity":
        return dict.memory.entityActivity;
      case "event":
        return dict.memory.entityEvent;
    }
  };

  const renderPanel = (list: MemoryItem[], kind: MemoryKind): React.ReactElement => {
    // имя панели — её вкладка; пустой список объясняет, как сюда попадают записи
    const panelProps = {
      className: "saved-section",
      role: "tabpanel",
      id: "saved-panel",
      "aria-labelledby": `saved-tab-${kind}`,
    } as const;
    if (list.length === 0) {
      return (
        <section {...panelProps}>
          <p className="saved-section-empty">
            {kind === "saved"
              ? dict.memory.savedSectionEmpty
              : dict.memory.visitedSectionEmpty}
          </p>
        </section>
      );
    }
    // переключатель — только в «Нравится» и только когда есть что скрывать
    const canHide = kind === "saved" && likedVisitedCount > 0;
    const shown =
      canHide && hideVisited
        ? list.filter((item) => !visitedKeys.has(sameThing(item)))
        : list;
    return (
      <section {...panelProps}>
        {canHide ? (
          <div className="saved-section-tools">
            <button
              type="button"
              className={`age-chip${hideVisited ? " age-chip-active" : ""}`}
              aria-pressed={hideVisited}
              onClick={() => setHideVisited((value) => !value)}
            >
              {dict.memory.likedHideVisited} · {likedVisitedCount}
            </button>
          </div>
        ) : null}
        {shown.length === 0 ? (
          <div className="saved-section-empty" role="status">
            <p className="saved-empty-title">{dict.memory.likedAllVisitedTitle}</p>
            <p>{dict.memory.likedAllVisitedHint}</p>
          </div>
        ) : (
          <ul className="saved-grid">
            {shown.map((item) => (
              <li
                key={itemKey(item.entity, item.slug, item.kind, item.city)}
                className="saved-item interactive-surface"
              >
                <Link
                  href={`${cityBasePath(lang, item.city)}/${ENTITY_PATH[item.entity]}/${item.slug}`}
                  className="saved-item-link"
                >
                  <PlaceImage url={item.imageUrl} alt={item.name} />
                  <span className="saved-item-type">
                    {entityLabel(item.entity)}
                    {multiCity ? ` · ${cityNames[item.city] ?? item.city}` : null}
                  </span>
                  <span className="saved-item-name">{item.name}</span>
                </Link>
                <button
                  type="button"
                  className="saved-item-remove"
                  // имя места в подписи: иначе в списке десять неразличимых
                  // «Убрать» — скринридер не поймёт, что именно удаляет
                  aria-label={`${dict.memory.remove}: ${item.name}`}
                  title={`${dict.memory.remove}: ${item.name}`}
                  onClick={() => removeWithUndo(item, kind)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  };

  return (
    <div className="saved-page">
      {/* явный путь назад: страница-хаб не должна быть тупиком, из которого
          «не разжать кнопку» — родитель не обязан догадываться про логотип */}
      <div className="back-link-wrapper">
        <Link href={backHref} className="back-link">
          {dict.memory.backToCatalog}
        </Link>
      </div>

      <h1 className="saved-page-title">{dict.memory.pageTitle}</h1>
      <p className="saved-page-intro">{dict.memory.pageIntro}</p>

      {isEmpty ? (
        <div className="saved-empty">
          <p className="saved-empty-title">{dict.memory.emptyTitle}</p>
          <p className="saved-empty-hint">{dict.memory.emptyHint}</p>
          <Link href={backHref} className="saved-empty-cta">
            {dict.memory.emptyCta}
          </Link>
        </div>
      ) : hydrated ? (
        <>
          <div
            className="view-toggle saved-tabs"
            role="tablist"
            aria-label={dict.memory.menuAria}
            onKeyDown={onTabsKeyDown}
          >
            {SAVED_TABS.map((kind) => {
              const isActive = kind === tab;
              const count = kind === "saved" ? saved.length : visited.length;
              return (
                <button
                  key={kind}
                  ref={(el) => {
                    tabRefs.current[kind] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`saved-tab-${kind}`}
                  aria-selected={isActive}
                  aria-controls="saved-panel"
                  tabIndex={isActive ? 0 : -1}
                  className={`view-toggle-option saved-tab${
                    isActive ? " view-toggle-active" : ""
                  }`}
                  onClick={() => selectTab(kind)}
                >
                  {kind === "saved"
                    ? dict.memory.savedSection
                    : dict.memory.visitedSection}
                  {count > 0 ? <span className="saved-tab-count">{count}</span> : null}
                </button>
              );
            })}
          </div>
          {tab === "saved"
            ? renderPanel(saved, "saved")
            : renderPanel(visited, "visited")}
        </>
      ) : null}

      {removed ? (
        <p className="saved-undo" role="status">
          {dict.memory.removed}: {removed.name}
          <button type="button" className="saved-undo-restore" onClick={restoreRemoved}>
            {dict.memory.restore}
          </button>
        </p>
      ) : null}
    </div>
  );
}
