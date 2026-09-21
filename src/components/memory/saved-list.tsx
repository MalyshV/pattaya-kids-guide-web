"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
 */
export function SavedList({ age }: { age?: string | null }): React.ReactElement {
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
      { entity: item.entity, slug: item.slug, name: item.name, imageUrl: item.imageUrl },
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

  // #visited из меню шапки: до гидрации раздела ещё нет в разметке, и
  // браузер не докручивает — докручиваем сами, когда память прочитана
  useEffect(() => {
    if (!hydrated || !window.location.hash) {
      return;
    }
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
  }, [hydrated]);

  const saved = listByKind(items, "saved");
  const visited = listByKind(items, "visited");
  const isEmpty = hydrated && saved.length === 0 && visited.length === 0;
  const visitedKeys = new Set(visited.map((item) => `${item.entity}:${item.slug}`));
  const likedVisitedCount = saved.filter((item) =>
    visitedKeys.has(`${item.entity}:${item.slug}`),
  ).length;

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

  const renderSection = (
    title: string,
    list: MemoryItem[],
    kind: MemoryKind,
  ): React.ReactElement | null => {
    if (list.length === 0) {
      // секция не исчезает молча: пришедший по «✓ Уже были» из меню шапки
      // должен увидеть, куда попал и как сюда попадают записи
      return (
        <section className="saved-section" id={kind}>
          <h2 className="saved-section-title">{title}</h2>
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
        ? list.filter((item) => !visitedKeys.has(`${item.entity}:${item.slug}`))
        : list;
    return (
      // id — якорь для пунктов меню шапки (♡ → #saved, ✓ → #visited)
      <section className="saved-section" id={kind}>
        <h2 className="saved-section-title">
          {title} <span className="saved-count">{shown.length}</span>
        </h2>
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
                key={itemKey(item.entity, item.slug, item.kind)}
                className="saved-item interactive-surface"
              >
                <Link
                  href={`${basePath}/${ENTITY_PATH[item.entity]}/${item.slug}`}
                  className="saved-item-link"
                >
                  <PlaceImage url={item.imageUrl} alt={item.name} />
                  <span className="saved-item-type">{entityLabel(item.entity)}</span>
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
          {renderSection(dict.memory.savedSection, saved, "saved")}
          {renderSection(dict.memory.visitedSection, visited, "visited")}
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
