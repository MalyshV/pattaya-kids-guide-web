"use client";

import { useEffect, useId, useRef, useState } from "react";
import { assessCover, coverHint, type CoverKind } from "@/lib/admin/cover-fit";
import { jpegFileName, needsBrowserShrink } from "@/lib/admin/photo-file";
import { shrinkPhoto } from "@/lib/suggest/shrink-photo";

/**
 * Поле выбора фото в формах админки (обложка, фото в галерею). Большое фото
 * браузер сразу уменьшает и подменяет им выбранный файл — иначе на проде
 * Vercel отбил бы всю форму ещё до нашего кода (почему — lib/admin/photo-file).
 * Пока фото уменьшается, форма не отправится: поле на это время «невалидно»,
 * и браузер сам скажет подождать.
 *
 * С coverKind поле — обложка: рядом постоянная подсказка, какой кадр
 * подходит, а после выбора файла — тихая оценка кадра (lib/admin/cover-fit).
 * Это не ошибка и сохранение не блокирует.
 */

type PhotoFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  /** Задан — поле обложки: показываем подсказку и оценку кадра. */
  coverKind?: CoverKind;
};

type Status = "idle" | "working" | "done" | "unreadable";

const STATUS_TEXT: Record<Status, string> = {
  idle: "",
  working: "Уменьшаю фото…",
  done: "Готово: фото уменьшено для загрузки.",
  unreadable:
    "Не получилось открыть это фото в браузере. Сохраните снимок как JPEG " +
    "и выберите его.",
};

/** Размер кадра так, как его увидит сервер (EXIF-поворот <img> учитывает сам). */
async function readPhotoSize(
  file: File,
): Promise<{ width: number; height: number } | null> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

const WAIT_MESSAGE = "Фото ещё уменьшается — подождите пару секунд";

export function PhotoField({
  name,
  label,
  required = false,
  coverKind,
}: PhotoFieldProps): React.ReactElement {
  const statusId = useId();
  const hintId = useId();
  const verdictId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [verdict, setVerdict] = useState("");
  // выбрали другое фото, пока первое ещё уменьшалось, — старый результат не нужен
  const pickId = useRef(0);

  // После сохранения React сбрасывает форму (а при ошибке — редирект на ту же
  // страницу), поле пустеет — «Готово» рядом с пустым полем путало бы.
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) {
      return;
    }
    const onReset = (): void => {
      pickId.current += 1;
      inputRef.current?.setCustomValidity("");
      setStatus("idle");
      setVerdict("");
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  // оценка обложки по файлу, который реально уйдёт на сервер
  async function assess(file: File | undefined, id: number): Promise<void> {
    if (!coverKind || !file) {
      setVerdict("");
      return;
    }
    const size = await readPhotoSize(file);
    if (id !== pickId.current) {
      return;
    }
    setVerdict(size ? (assessCover({ ...size, kind: coverKind })?.message ?? "") : "");
  }

  async function onPick(input: HTMLInputElement): Promise<void> {
    const id = ++pickId.current;
    const file = input.files?.[0];
    input.setCustomValidity("");
    setVerdict("");
    if (!file || !needsBrowserShrink(file)) {
      setStatus("idle");
      void assess(file, id);
      return;
    }

    setStatus("working");
    input.setCustomValidity(WAIT_MESSAGE);
    try {
      const blob = await shrinkPhoto(file);
      if (id !== pickId.current) {
        return;
      }
      const picked = new DataTransfer();
      picked.items.add(new File([blob], jpegFileName(file.name), { type: "image/jpeg" }));
      input.files = picked.files;
      setStatus("done");
      void assess(input.files?.[0], id);
    } catch {
      if (id !== pickId.current) {
        return;
      }
      // оригинал не оставляем: большой всё равно не пройдёт, а форма упала бы целиком
      input.value = "";
      setStatus("unreadable");
    } finally {
      if (id === pickId.current) {
        input.setCustomValidity("");
      }
    }
  }

  return (
    <div className="admin-photo-field">
      <label className="admin-field">
        <span>{label}</span>
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          required={required}
          aria-describedby={[coverKind ? hintId : null, statusId, verdictId]
            .filter(Boolean)
            .join(" ")}
          onChange={(event) => void onPick(event.currentTarget)}
        />
      </label>
      {coverKind ? (
        <p id={hintId} className="admin-muted">
          {coverHint(coverKind)}
        </p>
      ) : null}
      <p
        id={statusId}
        className={`admin-photo-status${status === "unreadable" ? " is-error" : ""}`}
        aria-live="polite"
      >
        {STATUS_TEXT[status]}
      </p>
      <p id={verdictId} className="admin-photo-status" aria-live="polite">
        {verdict}
      </p>
    </div>
  );
}
