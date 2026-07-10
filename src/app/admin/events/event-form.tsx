import type { Event } from "@prisma/client";
import { deleteEventAction, saveEventAction } from "@/app/admin/actions";

/**
 * Форма события (event=null → создание). Даты вводятся по времени Паттайи —
 * action сам переводит их в UTC (см. pattayaDateOrNull).
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

export function EventForm({ event, places, error }: EventFormProps): React.ReactElement {
  return (
    <section className="admin-card">
      <h1>{event ? `Событие: ${event.title}` : "Новое событие"}</h1>
      {event ? <p className="admin-muted">/{event.slug}</p> : null}

      {error === "required" ? (
        <p className="admin-error">Название и дата начала обязательны.</p>
      ) : null}

      <form action={saveEventAction} className="admin-form">
        {event ? <input type="hidden" name="id" value={event.id} /> : null}

        <label className="admin-field">
          <span>Название (рус) *</span>
          <input type="text" name="title" defaultValue={event?.title ?? ""} required />
        </label>

        <label className="admin-field">
          <span>Title (en)</span>
          <input type="text" name="titleEn" defaultValue={event?.titleEn ?? ""} />
        </label>

        <label className="admin-field">
          <span>Описание (рус)</span>
          <textarea name="description" rows={4} defaultValue={event?.description ?? ""} />
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
              defaultValue={pattayaLocalValue(event?.startDate)}
              required
            />
          </label>
          <label className="admin-field">
            <span>Конец (пусто = однодневное)</span>
            <input
              type="datetime-local"
              name="endDate"
              defaultValue={pattayaLocalValue(event?.endDate)}
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
            <select name="status" defaultValue={event?.status ?? "APPROVED"}>
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
