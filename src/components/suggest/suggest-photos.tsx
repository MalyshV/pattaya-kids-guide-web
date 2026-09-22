"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { SUGGEST_PHOTOS } from "@/lib/suggest/photos";
import { shrinkPhoto } from "@/lib/suggest/shrink-photo";

/**
 * Фото в форме «Предложить своё»: выбрать, посмотреть превью, убрать лишнее.
 * Каждое фото сразу сжимается в браузере (lib/suggest/shrink-photo) — в форму
 * уходят уже лёгкие JPEG, и отправка не упирается в лимит запроса Vercel.
 *
 * Галочка «вправе делиться» появляется вместе с первым фото и не стоит заранее
 * (решение Вероники 22.09); рядом — подсказка «лучше без чужих детей в кадре».
 */

export type SuggestPhoto =
  | { id: number; status: "processing" }
  | { id: number; status: "ready"; blob: Blob; previewUrl: string };

/** оба сообщения могут быть сразу: «лишние не взяли» и «это не открылось» */
type PhotoNotice = { tooMany: boolean; unreadable: string[] };
const NO_NOTICE: PhotoNotice = { tooMany: false, unreadable: [] };

export type SuggestPhotosState = {
  items: SuggestPhoto[];
  notice: PhotoNotice;
  add: (files: readonly File[]) => void;
  remove: (id: number) => void;
  clear: () => void;
};

export function useSuggestPhotos(): SuggestPhotosState {
  const [items, setItems] = useState<SuggestPhoto[]>([]);
  const [notice, setNotice] = useState<PhotoNotice>(NO_NOTICE);
  // зеркало для асинхронных колбэков: сжатие заканчивается позже, и к этому
  // моменту фото могли уже убрать
  const itemsRef = useRef<SuggestPhoto[]>([]);
  const nextId = useRef(1);
  // сжимаем по одному: пять полноразмерных снимков, раскрытых в памяти разом,
  // слабому телефону тяжело (вкладка может перезагрузиться)
  const queue = useRef<Promise<void>>(Promise.resolve());

  const commit = useCallback((next: SuggestPhoto[]): void => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const add = useCallback(
    (files: readonly File[]): void => {
      const room = SUGGEST_PHOTOS.maxCount - itemsRef.current.length;
      const accepted = files.slice(0, Math.max(0, room));
      setNotice({ tooMany: files.length > accepted.length, unreadable: [] });
      const added = accepted.map((file) => ({ file, id: nextId.current++ }));
      commit([
        ...itemsRef.current,
        ...added.map(({ id }) => ({ id, status: "processing" as const })),
      ]);

      // убрали (или «Начать заново», или ушли со страницы), пока ждало/сжималось
      const gone = (id: number): boolean =>
        !itemsRef.current.some((item) => item.id === id);

      for (const { file, id } of added) {
        queue.current = queue.current.then(async () => {
          if (gone(id)) {
            return;
          }
          try {
            const blob = await shrinkPhoto(file);
            if (gone(id)) {
              return;
            }
            const previewUrl = URL.createObjectURL(blob);
            commit(
              itemsRef.current.map((item) =>
                item.id === id ? { id, status: "ready", blob, previewUrl } : item,
              ),
            );
          } catch {
            if (gone(id)) {
              return;
            }
            commit(itemsRef.current.filter((item) => item.id !== id));
            setNotice((current) => ({
              ...current,
              unreadable: [...current.unreadable, file.name],
            }));
          }
        });
      }
    },
    [commit],
  );

  const remove = useCallback(
    (id: number): void => {
      const item = itemsRef.current.find((photo) => photo.id === id);
      if (item?.status === "ready") {
        URL.revokeObjectURL(item.previewUrl);
      }
      commit(itemsRef.current.filter((photo) => photo.id !== id));
      setNotice(NO_NOTICE);
    },
    [commit],
  );

  const clear = useCallback((): void => {
    for (const item of itemsRef.current) {
      if (item.status === "ready") {
        URL.revokeObjectURL(item.previewUrl);
      }
    }
    commit([]);
    setNotice(NO_NOTICE);
  }, [commit]);

  // ушли со страницы — превью больше не нужны, а недосжатые фото, закончив,
  // увидят пустой список и не создадут новых превью
  useEffect(
    () => () => {
      for (const item of itemsRef.current) {
        if (item.status === "ready") {
          URL.revokeObjectURL(item.previewUrl);
        }
      }
      itemsRef.current = [];
    },
    [],
  );

  return { items, notice, add, remove, clear };
}

type SuggestPhotosProps = {
  photos: SuggestPhotosState;
  idPrefix: string;
  rightsChecked: boolean;
  onRightsChange: (checked: boolean) => void;
  /** текст ошибки у галочки (не отметили, а фото есть) */
  rightsError: string | null;
};

export function SuggestPhotos({
  photos,
  idPrefix,
  rightsChecked,
  onRightsChange,
  rightsError,
}: SuggestPhotosProps): React.ReactElement {
  const dict = useDictionary();
  const t = dict.suggest.photos;
  const { items, notice } = photos;
  const hintId = `${idPrefix}-photos-hint`;
  const rightsErrorId = `${idPrefix}-photoRights-error`;

  // Кнопка в фокусе исчезает («Убрать», «Добавить» после пятого фото) —
  // фокус не должен падать в начало страницы: переводим на соседнее.
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const addRef = useRef<HTMLInputElement | null>(null);
  const removeRefs = useRef(new Map<number, HTMLButtonElement>());
  const focusNext = useRef<{ removeId: number } | "add" | "label" | null>(null);
  useEffect(() => {
    const target = focusNext.current;
    if (!target) {
      return;
    }
    focusNext.current = null;
    const element =
      target === "add"
        ? addRef.current
        : target === "label"
          ? labelRef.current
          : removeRefs.current.get(target.removeId);
    (element ?? labelRef.current)?.focus();
  });

  function onPick(event: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(event.target.files ?? []);
    // сбрасываем выбор: то же фото можно будет выбрать снова после «Убрать»
    event.target.value = "";
    if (files.length > 0) {
      if (items.length + files.length >= SUGGEST_PHOTOS.maxCount) {
        focusNext.current = "label"; // «Добавить» сейчас пропадёт
      }
      photos.add(files);
    }
  }

  function onRemove(index: number): void {
    const neighbour = items[index + 1] ?? items[index - 1];
    focusNext.current = neighbour ? { removeId: neighbour.id } : "add";
    photos.remove(items[index].id);
  }

  return (
    <div
      className="suggest-field"
      role="group"
      aria-labelledby={`${idPrefix}-photos-label`}
    >
      <p
        id={`${idPrefix}-photos-label`}
        className="suggest-label"
        ref={labelRef}
        tabIndex={-1}
      >
        {t.label} <span className="suggest-optional">({dict.suggest.optional})</span>
      </p>
      <p id={hintId} className="suggest-hint">
        {t.hint(SUGGEST_PHOTOS.maxCount)}
      </p>

      {items.length > 0 ? (
        <ul className="suggest-photos">
          {items.map((item, index) => (
            <li key={item.id} className="suggest-photo">
              {item.status === "ready" ? (
                // превью — из памяти браузера (blob:), next/image тут не нужен
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="suggest-photo-image"
                  src={item.previewUrl}
                  alt={t.alt(index + 1)}
                />
              ) : (
                <span className="suggest-photo-image suggest-photo-processing">
                  <span className="button-spinner" aria-hidden="true" />
                  {t.processing}
                </span>
              )}
              <button
                type="button"
                className="suggest-text-button suggest-photo-remove"
                aria-label={t.removeLabel(index + 1)}
                ref={(element) => {
                  if (element) {
                    removeRefs.current.set(item.id, element);
                  } else {
                    removeRefs.current.delete(item.id);
                  }
                }}
                onClick={() => onRemove(index)}
              >
                {t.remove}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {items.length < SUGGEST_PHOTOS.maxCount ? (
        <label className="suggest-photo-add">
          <input
            className="suggest-photo-input"
            type="file"
            accept="image/*"
            multiple
            ref={addRef}
            aria-describedby={hintId}
            onChange={onPick}
          />
          <span>{items.length > 0 ? t.addMore : t.add}</span>
        </label>
      ) : null}

      <div aria-live="polite">
        {notice.tooMany ? (
          <p className="suggest-photo-notice">{t.tooMany(SUGGEST_PHOTOS.maxCount)}</p>
        ) : null}
        {notice.unreadable.length > 0 ? (
          <p className="suggest-photo-notice">{t.unreadable(notice.unreadable)}</p>
        ) : null}
      </div>

      {items.length > 0 ? (
        <>
          <label className="suggest-check suggest-photo-rights">
            <input
              type="checkbox"
              name="photoRightsOk"
              checked={rightsChecked}
              aria-invalid={rightsError ? true : undefined}
              aria-describedby={rightsError ? rightsErrorId : undefined}
              onChange={(event) => onRightsChange(event.target.checked)}
            />
            <span>{t.rightsLabel}</span>
          </label>
          {rightsError ? (
            <p id={rightsErrorId} className="suggest-error">
              {rightsError}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
