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

type PhotoNotice = { kind: "tooMany" } | { kind: "unreadable"; names: string[] };

export type SuggestPhotosState = {
  items: SuggestPhoto[];
  notice: PhotoNotice | null;
  add: (files: readonly File[]) => void;
  remove: (id: number) => void;
  clear: () => void;
};

export function useSuggestPhotos(): SuggestPhotosState {
  const [items, setItems] = useState<SuggestPhoto[]>([]);
  const [notice, setNotice] = useState<PhotoNotice | null>(null);
  // зеркало для асинхронных колбэков: сжатие заканчивается позже, и к этому
  // моменту фото могли уже убрать
  const itemsRef = useRef<SuggestPhoto[]>([]);
  const nextId = useRef(1);

  const commit = useCallback((next: SuggestPhoto[]): void => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const add = useCallback(
    (files: readonly File[]): void => {
      setNotice(null);
      const room = SUGGEST_PHOTOS.maxCount - itemsRef.current.length;
      const accepted = files.slice(0, Math.max(0, room));
      if (files.length > accepted.length) {
        setNotice({ kind: "tooMany" });
      }
      const added = accepted.map((file) => ({ file, id: nextId.current++ }));
      commit([
        ...itemsRef.current,
        ...added.map(({ id }) => ({ id, status: "processing" as const })),
      ]);

      for (const { file, id } of added) {
        shrinkPhoto(file)
          .then((blob) => {
            if (!itemsRef.current.some((item) => item.id === id)) {
              return; // убрали, пока сжималось
            }
            const previewUrl = URL.createObjectURL(blob);
            commit(
              itemsRef.current.map((item) =>
                item.id === id ? { id, status: "ready", blob, previewUrl } : item,
              ),
            );
          })
          .catch(() => {
            commit(itemsRef.current.filter((item) => item.id !== id));
            setNotice((current) => ({
              kind: "unreadable",
              names: [
                ...(current?.kind === "unreadable" ? current.names : []),
                file.name,
              ],
            }));
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
      setNotice(null);
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
    setNotice(null);
  }, [commit]);

  // ушли со страницы — превью больше не нужны
  useEffect(
    () => () => {
      for (const item of itemsRef.current) {
        if (item.status === "ready") {
          URL.revokeObjectURL(item.previewUrl);
        }
      }
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

  function onPick(event: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(event.target.files ?? []);
    // сбрасываем выбор: то же фото можно будет выбрать снова после «Убрать»
    event.target.value = "";
    if (files.length > 0) {
      photos.add(files);
    }
  }

  const noticeText =
    notice?.kind === "tooMany"
      ? t.tooMany(SUGGEST_PHOTOS.maxCount)
      : notice?.kind === "unreadable"
        ? t.unreadable(notice.names.map((name) => `«${name}»`).join(", "))
        : null;

  return (
    <div
      className="suggest-field"
      role="group"
      aria-labelledby={`${idPrefix}-photos-label`}
    >
      <p id={`${idPrefix}-photos-label`} className="suggest-label">
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
                onClick={() => photos.remove(item.id)}
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
            aria-describedby={hintId}
            onChange={onPick}
          />
          <span>{items.length > 0 ? t.addMore : t.add}</span>
        </label>
      ) : null}

      <div aria-live="polite">
        {noticeText ? <p className="suggest-photo-notice">{noticeText}</p> : null}
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
