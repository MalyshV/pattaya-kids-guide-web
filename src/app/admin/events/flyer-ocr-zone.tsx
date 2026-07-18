"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cleanOcrText } from "@/lib/import/ocr-text";

/**
 * OCR-зона над «Разобрать афишу»: скрин/фото афиши → текст в поле парсера.
 *
 * Распознавание целиком в браузере (tesseract.js динамическим импортом):
 * файл не покидает компьютер, серверу и ключам ничего не нужно. Первый
 * запуск докачивает движок и словари (~15 МБ) с CDN — честно предупреждаем
 * про паузу вместо молчаливого «зависло». Результат не подменяет глаза:
 * текст попадает в редактируемое поле, человек правит и жмёт «Разобрать».
 *
 * Пока зона на экране, картинку можно и вставить (⌘V), и уронить в любое
 * место страницы: дроп мимо зоны по умолчанию УВОДИЛ бы вкладку на файл,
 * теряя заполненную форму. Скрины, прилетевшие во время распознавания,
 * не пропадают — дозабираются тем же воркером из очереди.
 */

type OcrPhase =
  | { kind: "idle" }
  | { kind: "working"; message: string }
  | { kind: "done"; message: string }
  | { kind: "error"; message: string };

/// афиши Паттайи — латиница и кириллица; тайский добавим, когда встретится
const OCR_LANGS = ["eng", "rus"];

/// форматы, которые ядро tesseract (leptonica) читает как есть; остальное
/// (HEIC с iPhone, AVIF) пробуем перегнать в PNG силами браузера
const NATIVE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/bmp",
  "image/gif",
  "image/webp",
]);

/// первый запуск на медленной сети — до минуты; вдвое больше — уже обрыв
const INIT_TIMEOUT_MS = 120_000;

async function toRecognizable(file: File): Promise<Blob> {
  if (NATIVE_TYPES.has(file.type)) {
    return file;
  }
  // Chrome HEIC не декодирует — createImageBitmap упадёт, и файл честно
  // попадёт в «не прочитался» (а не в ложное «проверьте интернет»)
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("canvas 2d context unavailable");
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) {
    throw new Error("canvas png encode failed");
  }
  return blob;
}

export function FlyerOcrZone({
  onText,
}: {
  onText: (text: string) => void;
}): React.ReactElement {
  const [phase, setPhase] = useState<OcrPhase>({ kind: "idle" });
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  /// одно распознавание за раз; прилетевшее во время работы — в очередь
  const busyRef = useRef(false);
  const queueRef = useRef<File[]>([]);

  const recognizeFiles = useCallback(
    async (files: File[]): Promise<void> => {
      const images = files.filter((file) => file.type.startsWith("image/"));
      if (busyRef.current) {
        // «второй скрин» не теряется молча — дозаберём в текущем прогоне
        if (images.length > 0) {
          queueRef.current.push(...images);
        }
        return;
      }
      if (images.length === 0) {
        setPhase({
          kind: "error",
          message: "Это не картинка — нужен скрин или фото афиши (PNG/JPG).",
        });
        return;
      }
      busyRef.current = true;
      try {
        setPhase({
          kind: "working",
          message:
            "Готовлю распознавание… при первом запуске докачается ~15 МБ, это может занять до минуты",
        });

        // Этап 1 — движок (сеть). tesseract v7 при обрыве скачивания
        // словарей глотает отказ, и промис createWorker не завершается
        // НИКОГДА — без спасательного errorHandler + таймаута зона зависла
        // бы навсегда с занятым busyRef.
        let worker;
        try {
          const { createWorker, OEM } = await import("tesseract.js");
          let breakInit: (error: Error) => void = () => {};
          const initFailed = new Promise<never>((_, reject) => {
            breakInit = reject;
          });
          // поздние вызовы breakInit (ошибки recognize после старта) не
          // должны становиться unhandled rejection
          void initFailed.catch(() => {});
          const timer = window.setTimeout(
            () => breakInit(new Error("ocr init timeout")),
            INIT_TIMEOUT_MS,
          );
          try {
            worker = await Promise.race([
              createWorker(OCR_LANGS, OEM.LSTM_ONLY, {
                logger: (m) => {
                  if (m.status === "recognizing text") {
                    setPhase({
                      kind: "working",
                      message: `Распознаю текст… ${Math.round(m.progress * 100)}%`,
                    });
                  }
                },
                errorHandler: () => breakInit(new Error("ocr init failed")),
              }),
              initFailed,
            ]);
          } finally {
            window.clearTimeout(timer);
          }
        } catch {
          setPhase({
            kind: "error",
            message:
              "Распознавание не запустилось — проверьте интернет и попробуйте ещё раз.",
          });
          return;
        }

        // Этап 2 — сами файлы: ошибка формата (HEIC?) — это не «нет сети»,
        // каждый файл ловим отдельно и честно считаем нечитаемые
        const parts: string[] = [];
        let unreadable = 0;
        try {
          let batch = images;
          while (batch.length > 0) {
            for (const image of batch) {
              try {
                const source = await toRecognizable(image);
                const { data } = await worker.recognize(source);
                const cleaned = cleanOcrText(data.text);
                if (cleaned !== "") {
                  parts.push(cleaned);
                }
              } catch {
                unreadable += 1;
              }
            }
            batch = queueRef.current.splice(0);
          }
        } finally {
          await worker.terminate().catch(() => {});
        }

        if (parts.length > 0) {
          onText(parts.join("\n\n"));
          setPhase({
            kind: "done",
            message:
              unreadable > 0
                ? `Распознано, но часть файлов не прочиталась (${unreadable} шт.) — обычно это HEIC с iPhone, сохраните их как PNG/JPG. Остальное уже в поле ниже: проверьте и нажмите «Разобрать афишу».`
                : "Распознано — проверьте текст в поле ниже, поправьте ошибки и нажмите «Разобрать афишу».",
          });
        } else if (unreadable > 0) {
          setPhase({
            kind: "error",
            message:
              "Файл не прочитался — похоже, формат не поддерживается (частый случай — HEIC с iPhone). Сохраните скрин как PNG или JPG и попробуйте снова.",
          });
        } else {
          setPhase({
            kind: "error",
            message:
              "Текст с картинки не прочитался — попробуйте скрин покрупнее или вставьте текст руками.",
          });
        }
      } finally {
        busyRef.current = false;
        queueRef.current = [];
      }
    },
    [onText],
  );

  // ⌘V со скрином работает из любого места страницы: слушаем paste на
  // документе и реагируем только на картинки — вставку текста не трогаем.
  // Дроп — так же: файл, уроненный мимо зоны (или на занятую зону — она
  // disabled и событий не получает), по умолчанию ЗАМЕНИЛ бы страницу
  // картинкой, потеряв всё введённое; перетаскивание текста не трогаем.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent): void => {
      const files = Array.from(event.clipboardData?.files ?? []).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (files.length > 0) {
        event.preventDefault();
        void recognizeFiles(files);
      }
    };
    const dragHasFiles = (event: DragEvent): boolean =>
      Array.from(event.dataTransfer?.types ?? []).includes("Files");
    const onDragOver = (event: DragEvent): void => {
      if (dragHasFiles(event)) {
        event.preventDefault();
      }
    };
    // единственный обработчик дропа НА ВСЮ страницу — в том числе для самой
    // зоны: в App Router React делегирует события на document, поэтому
    // второй обработчик на кнопке ловил бы тот же файл дважды
    const onDrop = (event: DragEvent): void => {
      if (!dragHasFiles(event)) {
        return;
      }
      event.preventDefault();
      setDragOver(false);
      void recognizeFiles(Array.from(event.dataTransfer?.files ?? []));
    };
    document.addEventListener("paste", onPaste);
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("drop", onDrop);
    return () => {
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("drop", onDrop);
    };
  }, [recognizeFiles]);

  const working = phase.kind === "working";

  return (
    <div className="admin-ocr">
      <button
        type="button"
        className={`admin-ocr-zone${dragOver ? " admin-ocr-zone-active" : ""}`}
        disabled={working}
        aria-busy={working}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          // сам дроп ловит document-слушатель; здесь — только подсветка
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        {working
          ? phase.message
          : "Скрин афиши: нажмите, чтобы выбрать файл, перетащите сюда или вставьте ⌘V"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          // сбрасываем value: тот же файл можно выбрать повторно
          event.target.value = "";
          void recognizeFiles(files);
        }}
      />
      <p className="admin-muted admin-ocr-hint">
        Распознавание происходит в браузере — фото никуда не отправляется.
      </p>
      {phase.kind === "error" ? <p className="admin-error">{phase.message}</p> : null}
      {phase.kind === "done" ? (
        <p className="admin-ocr-done" role="status">
          {phase.message}
        </p>
      ) : null}
    </div>
  );
}
