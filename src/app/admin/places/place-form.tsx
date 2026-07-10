import type { Category, Place, PlacePhoto, PlaceSchedule } from "@prisma/client";
import {
  addPlacePhotoAction,
  deletePlaceAction,
  deletePlacePhotoAction,
  savePlaceAction,
} from "@/app/admin/actions";

/**
 * Форма места: создание и редактирование (place=null → создание).
 * Обычная SSR-форма без клиентского state — server action всё разбирает сам.
 */

type PlaceFormProps = {
  place:
    | (Place & {
        photos: PlacePhoto[];
        schedules: PlaceSchedule[];
        categories: Array<{ categoryId: string }>;
      })
    | null;
  allCategories: Category[];
  error?: string;
};

const DAYS: Array<{ code: string; label: string }> = [
  { code: "MON", label: "Пн" },
  { code: "TUE", label: "Вт" },
  { code: "WED", label: "Ср" },
  { code: "THU", label: "Чт" },
  { code: "FRI", label: "Пт" },
  { code: "SAT", label: "Сб" },
  { code: "SUN", label: "Вс" },
];

const TRI_STATE_FIELDS: Array<{ name: keyof Place; label: string }> = [
  { name: "hasFood", label: "Еда" },
  { name: "hasWifi", label: "Wi-Fi" },
  { name: "hasAirCon", label: "Кондиционер" },
  { name: "hasParking", label: "Парковка" },
  { name: "hasCafeSeating", label: "Кафе, где посидеть" },
  { name: "hasPowerOutlets", label: "Розетки" },
  { name: "hasCoveredArea", label: "Крытая зона/навес" },
  { name: "hasFans", label: "Вентиляторы" },
  { name: "canLeaveChild", label: "Можно оставить ребёнка" },
  { name: "animalContact", label: "Контакт с животными" },
];

function triStateValue(value: boolean | null | undefined): string {
  if (value === true) return "true";
  if (value === false) return "false";
  return "";
}

function TriStateSelect({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: boolean | null | undefined;
}): React.ReactElement {
  return (
    <label className="admin-field admin-field-inline">
      <span>{label}</span>
      <select name={name} defaultValue={triStateValue(value)}>
        <option value="">уточняется</option>
        <option value="true">есть</option>
        <option value="false">нет</option>
      </select>
    </label>
  );
}

export function PlaceForm({
  place,
  allCategories,
  error,
}: PlaceFormProps): React.ReactElement {
  const scheduleByDay = new Map(
    (place?.schedules ?? []).map((row) => [row.day as string, row]),
  );
  const checkedCategories = new Set(
    (place?.categories ?? []).map((link) => link.categoryId),
  );

  return (
    <section className="admin-card">
      <h1>{place ? `Место: ${place.name}` : "Новое место"}</h1>
      {place ? <p className="admin-muted">/{place.slug}</p> : null}

      {error === "name" ? <p className="admin-error">Название обязательно.</p> : null}
      {error === "upload" ? (
        <p className="admin-error">Фото не загрузилось — проверьте формат и размер.</p>
      ) : null}

      <form action={savePlaceAction} className="admin-form">
        {place ? <input type="hidden" name="id" value={place.id} /> : null}

        <label className="admin-field">
          <span>Название *</span>
          <input type="text" name="name" defaultValue={place?.name ?? ""} required />
        </label>

        <label className="admin-field">
          <span>Описание (рус)</span>
          <textarea name="description" rows={5} defaultValue={place?.description ?? ""} />
        </label>

        <label className="admin-field">
          <span>Description (en) — пусто = показываем русское</span>
          <textarea
            name="descriptionEn"
            rows={5}
            defaultValue={place?.descriptionEn ?? ""}
          />
        </label>

        <label className="admin-field">
          <span>Адрес</span>
          <input type="text" name="address" defaultValue={place?.address ?? ""} />
        </label>

        <div className="admin-row">
          <label className="admin-field">
            <span>Широта (latitude)</span>
            <input type="text" name="latitude" defaultValue={place?.latitude ?? ""} />
          </label>
          <label className="admin-field">
            <span>Долгота (longitude)</span>
            <input type="text" name="longitude" defaultValue={place?.longitude ?? ""} />
          </label>
        </div>

        <label className="admin-field">
          <span>Ссылка на карточку Google Maps</span>
          <input
            type="url"
            name="googleMapsUrl"
            defaultValue={place?.googleMapsUrl ?? ""}
          />
        </label>

        <label className="admin-field">
          <span>
            Обложка {place?.imageUrl ? "(выбери файл — заменит текущую)" : "(файл)"}
          </span>
          <input type="file" name="coverFile" accept="image/*" />
        </label>

        <fieldset className="admin-fieldset">
          <legend>Формат места</legend>
          <label className="admin-check">
            <input
              type="checkbox"
              name="indoor"
              defaultChecked={place?.indoor ?? false}
            />
            <span>В помещении</span>
          </label>
          <label className="admin-check">
            <input
              type="checkbox"
              name="outdoor"
              defaultChecked={place?.outdoor ?? false}
            />
            <span>На улице</span>
          </label>
        </fieldset>

        <fieldset className="admin-fieldset">
          <legend>Факты (пусто = «уточняется» — честнее, чем гадать)</legend>
          <div className="admin-tri-grid">
            {TRI_STATE_FIELDS.map((field) => (
              <TriStateSelect
                key={field.name}
                name={field.name}
                label={field.label}
                value={place?.[field.name] as boolean | null | undefined}
              />
            ))}
          </div>
          <label className="admin-field admin-field-inline">
            <span>Оставить ребёнка можно с (месяцев)</span>
            <input
              type="number"
              name="leaveChildFromMonths"
              min={0}
              defaultValue={place?.leaveChildFromMonths ?? ""}
            />
          </label>
        </fieldset>

        <fieldset className="admin-fieldset">
          <legend>Категории</legend>
          <div className="admin-tri-grid">
            {allCategories.map((category) => (
              <label key={category.id} className="admin-check">
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={category.id}
                  defaultChecked={checkedCategories.has(category.id)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="admin-fieldset">
          <legend>Часы работы (пусто = день не показываем; «закрыто» — выходной)</legend>
          <div className="admin-schedule">
            {DAYS.map((day) => {
              const row = scheduleByDay.get(day.code);
              return (
                <div key={day.code} className="admin-schedule-row">
                  <span className="admin-schedule-day">{day.label}</span>
                  <input
                    type="time"
                    name={`open_${day.code}`}
                    defaultValue={row?.isClosed ? "" : (row?.openTime ?? "")}
                  />
                  <span>—</span>
                  <input
                    type="time"
                    name={`close_${day.code}`}
                    defaultValue={row?.isClosed ? "" : (row?.closeTime ?? "")}
                  />
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      name={`closed_${day.code}`}
                      defaultChecked={row?.isClosed ?? false}
                    />
                    <span>закрыто</span>
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>

        <div className="admin-row">
          <label className="admin-field admin-field-inline">
            <span>Видимость</span>
            <select name="status" defaultValue={place?.status ?? "APPROVED"}>
              <option value="APPROVED">на сайте</option>
              <option value="PENDING">скрыто</option>
            </select>
          </label>
          <label className="admin-check">
            <input
              type="checkbox"
              name="isDemo"
              defaultChecked={place?.isDemo ?? false}
            />
            <span>демо-запись</span>
          </label>
        </div>

        <button type="submit" className="admin-button">
          Сохранить
        </button>
      </form>

      {place ? (
        <>
          <hr className="admin-divider" />

          <h2>Галерея ({place.photos.length})</h2>
          <ul className="admin-photo-grid">
            {place.photos.map((photo) => (
              <li key={photo.id} className="admin-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.caption ?? ""} loading="lazy" />
                <form action={deletePlacePhotoAction}>
                  <input type="hidden" name="photoId" value={photo.id} />
                  <input type="hidden" name="placeId" value={place.id} />
                  <button type="submit" className="admin-danger-link">
                    Удалить фото
                  </button>
                </form>
              </li>
            ))}
          </ul>

          <form action={addPlacePhotoAction} className="admin-form admin-form-inline">
            <input type="hidden" name="placeId" value={place.id} />
            <label className="admin-field">
              <span>Добавить фото в галерею</span>
              <input type="file" name="photoFile" accept="image/*" required />
            </label>
            <label className="admin-field">
              <span>Подпись (необязательно)</span>
              <input type="text" name="caption" />
            </label>
            <button type="submit" className="admin-button">
              Загрузить
            </button>
          </form>

          <hr className="admin-divider" />

          <form action={deletePlaceAction}>
            <input type="hidden" name="id" value={place.id} />
            <button type="submit" className="admin-danger-button">
              Удалить место навсегда (вместе с занятиями, фото и часами)
            </button>
          </form>
        </>
      ) : null}
    </section>
  );
}
