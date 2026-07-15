"use client";

import { useState } from "react";
import type { Event } from "@prisma/client";
import { deleteEventAction, saveEventAction } from "@/app/admin/actions";
import { parseEventFlyer, type FlyerDraft } from "@/lib/import/event-flyer";

/**
 * Форма события (event=null → создание). Даты вводятся по времени Паттайи —
 * action сам переводит их в UTC (см. pattayaDateOrNull).
 *
 * «Разобрать афишу»: вставляешь текст поста/флаера → чистый парсер
 * (event-flyer.ts) раскидывает факты по полям (дата/время/возраст), человек
 * проверяет и дополняет. Заполненные поля пересоздаются через key-ремаунт
 * (форма остаётся неконтролируемой). Автозаполненное событие получает
 * sourceType=IMPORT — провенанс: в данных участвовала машина.
 */

type PlaceOption = { id: string; name: string };

type EventFormProps = {
  event: Event | null;
  places: PlaceOption[];
  error?: string;
};

/** Date из БД → значение для <input type="datetime-local"> по Паттайе */
function pattayaLocalValue(date: Date | null | undefined): string {
  if (!date) {
    return "";
  }
  // sv-SE даёт "YYYY-MM-DD HH:mm" — ровно формат datetime-local после replace
  return date
    .toLocaleString("sv-SE", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(" ", "T");
}

/// заготовка фактов для пустого описания: цена и запись живут в тексте
/// (у Event нет полей цены/записи); тон Вероника доводит руками
function draftDescription(draft: FlyerDraft): string | null {
  const lines: string[] = [];
  if (draft.priceThb !== null) {
    lines.push(`Стоимость — ${draft.priceThb} ฿.`);
  }
  if (draft.needsBooking) {
    lines.push("Нужна запись.");
  }
  return lines.length > 0 ? lines.join(" ") : null;
}

export function EventForm({ event, places, error }: EventFormProps): React.ReactElement {
  const [flyerText, setFlyerText] = useState("");
  const [draft, setDraft] = useState<FlyerDraft | null>(null);
  /// ремаунт формы после разбора: defaultValue подхватываются заново
  const [autofillVersion, setAutofillVersion] = useState(0);

  const applyFlyer = (): void => {
    if (!flyerText.trim()) {
      return;
    }
    setDraft(parseEventFlyer(flyerText, new Date()));
    setAutofillVersion((version) => version + 1);
  };

  const autofilled = draft !== null;

  return (
    <section className="admin-card">
      <h1>{event ? `Событие: ${event.title}` : "Новое событие"}</h1>
      {event ? <p className="admin-muted">/{event.slug}</p> : null}

      {error === "required" ? (
        <p className="admin-error">Название и дата начала обязательны.</p>
      ) : null}
      {error === "upload" ? (
        <p className="admin-error">Фото не загрузилось — проверьте формат и размер.</p>
      ) : null}

      {event ? null : (
        <div className="admin-flyer">
          <label className="admin-field">
            <span>Текст афиши (вставьте пост из Instagram или текст флаера)</span>
            <textarea
              rows={5}
              value={flyerText}
              onChange={(e) => setFlyerText(e.target.value)}
              placeholder={
                "KID PILATES\nAges 10 – 15\nONLY 699 BAHT\nSATURDAY 18 JULY\n15.00 - 16.00"
              }
            />
          </label>
          <button type="button" className="admin-button" onClick={applyFlyer}>
            Разобрать афишу
          </button>
          {draft ? (
            <ul className="admin-muted admin-flyer-notes">
              {draft.notes.length > 0 ? (
                draft.notes.map((note) => <li key={note}>{note}</li>)
              ) : (
                <li>ничего не распозналось — заполните поля руками</li>
              )}
              <li>
                проверьте каждое поле ниже: парсер достаёт факты, но не заменяет глаза
              </li>
            </ul>
          ) : null}
        </div>
      )}

      <form action={saveEventAction} className="admin-form" key={autofillVersion}>
        {event ? <input type="hidden" name="id" value={event.id} /> : null}
        {/* провенанс: черновик собран парсером афиши */}
        {autofilled && !event ? (
          <input type="hidden" name="sourceType" value="IMPORT" />
        ) : null}

        <label className="admin-field">
          <span>Название (рус) *</span>
          <input
            type="text"
            name="title"
            defaultValue={event?.title ?? draft?.titleCandidate ?? ""}
            required
          />
        </label>

        <label className="admin-field">
          <span>Title (en)</span>
          <input type="text" name="titleEn" defaultValue={event?.titleEn ?? ""} />
        </label>

        <label className="admin-field">
          <span>Описание (рус)</span>
          <textarea
            name="description"
            rows={4}
            defaultValue={
              event?.description ?? (draft ? (draftDescription(draft) ?? "") : "")
            }
          />
        </label>

        <label className="admin-field">
          <span>Description (en)</span>
          <textarea
            name="descriptionEn"
            rows={4}
            defaultValue={event?.descriptionEn ?? ""}
          />
        </label>

        <div className="admin-row">
          <label className="admin-field">
            <span>Начало (время Паттайи) *</span>
            <input
              type="datetime-local"
              name="startDate"
              defaultValue={pattayaLocalValue(event?.startDate ?? draft?.startDate)}
              required
            />
          </label>
          <label className="admin-field">
            <span>Конец (пусто = однодневное)</span>
            <input
              type="datetime-local"
              name="endDate"
              defaultValue={pattayaLocalValue(event?.endDate ?? draft?.endDate)}
            />
          </label>
        </div>

        <div className="admin-row">
          <label className="admin-field">
            <span>Возраст от (месяцев)</span>
            <input
              type="number"
              name="minAgeMonths"
              min={0}
              defaultValue={event?.minAgeMonths ?? draft?.minAgeMonths ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Возраст до (месяцев; 5 лет = 60)</span>
            <input
              type="number"
              name="maxAgeMonths"
              min={0}
              defaultValue={event?.maxAgeMonths ?? draft?.maxAgeMonths ?? ""}
            />
          </label>
        </div>

        <label className="admin-field">
          <span>Место из каталога (или заполните поля ниже)</span>
          <select name="placeId" defaultValue={event?.placeId ?? ""}>
            <option value="">— не из каталога —</option>
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
        </label>

        <div className="admin-row">
          <label className="admin-field">
            <span>Название площадки (текстом)</span>
            <input
              type="text"
              name="locationName"
              defaultValue={event?.locationName ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Адрес</span>
            <input type="text" name="address" defaultValue={event?.address ?? ""} />
          </label>
        </div>

        <label className="admin-field">
          <span>
            Афиша/обложка {event?.imageUrl ? "(файл заменит текущую)" : "(файл)"}
          </span>
          <input type="file" name="coverFile" accept="image/*" />
        </label>

        <div className="admin-row">
          <label className="admin-field admin-field-inline">
            <span>Видимость</span>
            <select
              name="status"
              defaultValue={event?.status ?? (autofilled ? "PENDING" : "APPROVED")}
            >
              <option value="APPROVED">на сайте</option>
              <option value="PENDING">скрыто</option>
            </select>
          </label>
          <label className="admin-check">
            <input
              type="checkbox"
              name="isDemo"
              defaultChecked={event?.isDemo ?? false}
            />
            <span>демо-запись</span>
          </label>
        </div>

        <button type="submit" className="admin-button">
          Сохранить
        </button>
      </form>

      {event ? (
        <>
          <hr className="admin-divider" />
          <form action={deleteEventAction}>
            <input type="hidden" name="id" value={event.id} />
            <button type="submit" className="admin-danger-button">
              Удалить событие навсегда
            </button>
          </form>
        </>
      ) : null}
    </section>
  );
}
