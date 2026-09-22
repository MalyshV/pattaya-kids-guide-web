"use client";

import { useEffect, useId, useRef, useState } from "react";
import { jpegFileName, needsBrowserShrink } from "@/lib/admin/photo-file";
import { shrinkPhoto } from "@/lib/suggest/shrink-photo";

/**
 * Поле выбора фото в формах админки (обложка, фото в галерею). Большое фото
 * браузер сразу уменьшает и подменяет им выбранный файл — иначе на проде
 * Vercel отбил бы всю форму ещё до нашего кода (почему — lib/admin/photo-file).
 * Пока фото уменьшается, форма не отправится: поле на это время «невалидно»,
 * и браузер сам скажет подождать.
 */

type PhotoFieldProps = {
  name: string;
  label: string;
  required?: boolean;
};

type Status = "idle" | "working" | "done" | "unreadable";

const STATUS_TEXT: Record<Status, string> = {
  idle: "",
  working: "Уменьшаю фото…",
  done: "Готово: фото уменьшено для загрузки.",
  unreadable:
    "Не получилось открыть это фото в браузере. Если это HEIC с айфона — " +
    "откройте админку в Safari или сохраните снимок как JPEG.",
};

const WAIT_MESSAGE = "Фото ещё уменьшается — подождите пару секунд";

export function PhotoField({
  name,
  label,
  required = false,
}: PhotoFieldProps): React.ReactElement {
  const statusId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
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
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  async function onPick(input: HTMLInputElement): Promise<void> {
    const id = ++pickId.current;
    const file = input.files?.[0];
    input.setCustomValidity("");
    if (!file || !needsBrowserShrink(file)) {
      setStatus("idle");
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
          aria-describedby={statusId}
          onChange={(event) => void onPick(event.currentTarget)}
        />
      </label>
      <p
        id={statusId}
        className={`admin-photo-status${status === "unreadable" ? " is-error" : ""}`}
        aria-live="polite"
      >
        {STATUS_TEXT[status]}
      </p>
    </div>
  );
}
