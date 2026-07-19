"use client";

import { useState } from "react";
import { OcrZone } from "@/app/admin/ocr-zone";

/**
 * OCR-черновик для форм без парсера (место, занятие): распознанный со
 * скрина текст попадает в редактируемое поле РЯДОМ с формой — скопировать
 * часы/цены/адрес в поля быстрее, чем перепечатывать с картинки. В базу
 * черновик не попадает: форма серверная, это поле в ней не участвует.
 * Появится парсер «раскидать по полям» — встанет сюда же, как у событий.
 */
export function OcrScratchpad({ subject }: { subject: string }): React.ReactElement {
  const [text, setText] = useState("");

  return (
    <div className="admin-ocr-scratchpad">
      <OcrZone
        subject={subject}
        doneMessage="Черновик ниже: скопируйте нужное в поля формы."
        onText={(recognized) =>
          setText((prev) =>
            prev.trim() === "" ? recognized : `${prev.trimEnd()}\n\n${recognized}`,
          )
        }
      />
      {text === "" ? null : (
        <div className="admin-field">
          <span className="admin-ocr-scratchpad-head">
            Черновик из скрина — в базу не попадает
            <button type="button" className="admin-ocr-clear" onClick={() => setText("")}>
              очистить
            </button>
          </span>
          <textarea
            rows={6}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>
      )}
    </div>
  );
}
