import { ADMIN_FIELDS, tooLongMessage } from "@/lib/admin/field-limits";
import { CoverPreview, RotateButton } from "@/app/admin/rotate-button";
import { TipsFields } from "@/app/admin/tips-fields";
import Link from "next/link";
import type {
  Category,
  Place,
  PlaceBirthdayInfo,
  PlacePhoto,
  PlaceSchedule,
} from "@prisma/client";
import {
  addPlacePhotoAction,
  deletePlaceAction,
  deletePlacePhotoAction,
  savePlaceAction,
} from "@/app/admin/actions";
import { OcrScratchpad } from "@/app/admin/ocr-scratchpad";
import { PhotoField } from "@/app/admin/photo-field";
import { SubmitButton } from "@/app/admin/submit-button";
import type { PlacePrefill } from "@/lib/admin/submission-card";

/**
 * Форма места: создание и редактирование (place=null → создание).
 * Обычная SSR-форма без клиентского state — server action всё разбирает сам.
 *
 * fromSubmission — пришли со страницы предложения: поля уже заполнены
 * присланным, а фото перенесутся при сохранении (их переносит savePlaceAction:
 * галереи у несозданной карточки ещё нет).
 */

export type PlaceFormSubmission = {
  id: string;
  name: string;
  photoCount: number;
  prefill: PlacePrefill;
};

type PlaceFormProps = {
  place:
    | (Place & {
        photos: PlacePhoto[];
        schedules: PlaceSchedule[];
        birthdayInfo?: PlaceBirthdayInfo | null;
        categories: Array<{ categoryId: string }>;
        tips: Array<{ text: string; textEn: string | null }>;
      })
    | null;
  allCategories: Category[];
  error?: string;
  fromSubmission?: PlaceFormSubmission;
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
  fromSubmission,
}: PlaceFormProps): React.ReactElement {
  const scheduleByDay = new Map(
    (place?.schedules ?? []).map((row) => [row.day as string, row]),
  );
  // форма держит один интервал на день; если в данных есть день с двумя
  // окнами (например, перерыв на обед) — честно предупреждаем о перезаписи
  const hasMultiIntervalDay =
    (place?.schedules ?? []).length >
    new Set((place?.schedules ?? []).map((r) => r.day)).size;
  const birthday = place?.birthdayInfo ?? null;
  const checkedCategories = new Set(
    (place?.categories ?? []).map((link) => link.categoryId),
  );

  return (
    <section className="admin-card">
      <h1>{place ? `Место: ${place.name}` : "Новое место"}</h1>
      {place ? <p className="admin-muted">/{place.slug}</p> : null}

      {tooLongMessage(error) ? (
        <p className="admin-error">{tooLongMessage(error)}</p>
      ) : null}
      {error === "name" ? <p className="admin-error">Название обязательно.</p> : null}
      {error === "upload" ? (
        <p className="admin-error">Фото не загрузилось — проверьте формат и размер.</p>
      ) : null}
      {error === "schedule" ? (
        <p className="admin-error">
          В часах работы есть день, где заполнено только открытие или только закрытие —
          допишите второе время или отметьте «закрыто».
        </p>
      ) : null}
      {error === "birthdayGuests" ? (
        <p className="admin-error">
          В дне рождения «гостей от» больше, чем «гостей до» — поправьте числа.
        </p>
      ) : null}
      {error === "coords" ? (
        <p className="admin-error">
          Нужны координаты (широта и долгота) — без них место окажется «в океане» на
          карте. Их можно скопировать из Google Maps: правый клик по месту → первая строка
          меню.
        </p>
      ) : null}

      {/* парсера «раскидать по полям» у мест нет — распознанное попадает в
          черновик, из него копируется по полям; печатать с картинки не надо */}
      <OcrScratchpad subject="Скрин с инфой места (часы, цены, адрес)" />

      {fromSubmission ? (
        <p className="admin-from-submission">
          Заполнено из предложения «{fromSubmission.name}» — проверьте и дополните.
          {fromSubmission.photoCount > 0
            ? ` Фото (${fromSubmission.photoCount}) перенесутся при сохранении: первое станет обложкой.`
            : ""}{" "}
          Сайт, «когда» и контакт в форму не переносятся —{" "}
          <Link href={`/admin/suggestions/${fromSubmission.id}`}>
            они остались в предложении
          </Link>
          .
        </p>
      ) : null}

      <form action={savePlaceAction} className="admin-form">
        {place ? <input type="hidden" name="id" value={place.id} /> : null}
        {fromSubmission ? (
          <input type="hidden" name="fromSubmission" value={fromSubmission.id} />
        ) : null}

        <label className="admin-field">
          <span>Название *</span>
          <input
            type="text"
            name="name"
            maxLength={ADMIN_FIELDS.name.max}
            defaultValue={place?.name ?? fromSubmission?.prefill.name ?? ""}
            required
          />
        </label>

        <label className="admin-field">
          <span>Описание (рус)</span>
          <textarea
            name="description"
            maxLength={ADMIN_FIELDS.description.max}
            rows={5}
            defaultValue={place?.description ?? fromSubmission?.prefill.description ?? ""}
          />
        </label>

        <label className="admin-field">
          <span>Description (en) — пусто = показываем русское</span>
          <textarea
            name="descriptionEn"
            maxLength={ADMIN_FIELDS.descriptionEn.max}
            rows={5}
            defaultValue={place?.descriptionEn ?? ""}
          />
        </label>

        <TipsFields tips={place?.tips ?? []} />

        <label className="admin-field">
          <span>Адрес</span>
          <input
            type="text"
            name="address"
            maxLength={ADMIN_FIELDS.address.max}
            defaultValue={place?.address ?? fromSubmission?.prefill.address ?? ""}
          />
        </label>

        <div className="admin-row">
          <label className="admin-field">
            <span>Широта (latitude) *</span>
            <input
              type="text"
              name="latitude"
              defaultValue={place?.latitude ?? fromSubmission?.prefill.latitude ?? ""}
              required
            />
          </label>
          <label className="admin-field">
            <span>Долгота (longitude) *</span>
            <input
              type="text"
              name="longitude"
              defaultValue={place?.longitude ?? fromSubmission?.prefill.longitude ?? ""}
              required
            />
          </label>
        </div>

        <label className="admin-field">
          <span>Ссылка на карточку Google Maps</span>
          <input
            type="url"
            name="googleMapsUrl"
            maxLength={ADMIN_FIELDS.googleMapsUrl.max}
            defaultValue={
              place?.googleMapsUrl ?? fromSubmission?.prefill.googleMapsUrl ?? ""
            }
          />
        </label>

        <PhotoField
          name="coverFile"
          label={`Обложка ${place?.imageUrl ? "(файл заменит текущую)" : "(файл)"}`}
        />

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
          <legend>День рождения</legend>
          {/* метка «блок был в форме»: без неё снятая галочка неотличима от
              старой вкладки без этого блока — та стёрла бы данные о ДР */}
          <input type="hidden" name="birthdayPresent" value="1" />
          <label className="admin-check">
            <input
              type="checkbox"
              name="birthdayEnabled"
              defaultChecked={birthday !== null}
            />
            <span>Здесь проводят дни рождения</span>
          </label>
          <p className="admin-muted">
            Снять галочку и сохранить — данные о дне рождения у этого места удалятся.
          </p>
          <label className="admin-check">
            <input
              type="checkbox"
              name="birthdayHasPackages"
              defaultChecked={birthday?.hasPackages ?? false}
            />
            <span>Есть готовые пакеты</span>
          </label>
          <p className="admin-muted">
            На странице «Дни рождения» показываются только места с этой галочкой.
          </p>
          <div className="admin-row">
            <label className="admin-field admin-field-inline">
              <span>Гостей от</span>
              <input
                type="number"
                name="birthdayMinGuests"
                min={1}
                defaultValue={birthday?.minGuests ?? ""}
              />
            </label>
            <label className="admin-field admin-field-inline">
              <span>Гостей до</span>
              <input
                type="number"
                name="birthdayMaxGuests"
                min={1}
                defaultValue={birthday?.maxGuests ?? ""}
              />
            </label>
          </div>
          <TriStateSelect
            name="birthdayDepositRequired"
            label="Залог"
            value={birthday?.depositRequired}
          />
          <label className="admin-field admin-field-inline">
            <span>Бронировать за (дней)</span>
            <input
              type="number"
              name="birthdayPreBookingDays"
              min={0}
              defaultValue={birthday?.preBookingDays ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Заметки о дне рождения (рус)</span>
            <textarea
              name="birthdayNotes"
              maxLength={ADMIN_FIELDS.birthdayNotes.max}
              rows={3}
              defaultValue={birthday?.notes ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Notes (en) — пусто = показываем русские</span>
            <textarea
              name="birthdayNotesEn"
              maxLength={ADMIN_FIELDS.birthdayNotesEn.max}
              rows={3}
              defaultValue={birthday?.notesEn ?? ""}
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
          {hasMultiIntervalDay ? (
            <p className="admin-error">
              У этого места есть день с двумя интервалами (например, перерыв) — форма пока
              держит один интервал на день, сохранение оставит только его. Второе окно
              можно вернуть через меня.
            </p>
          ) : null}
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

        <SubmitButton>Сохранить</SubmitButton>
      </form>

      {place ? (
        <>
          <CoverPreview target="placeCover" id={place.id} imageUrl={place.imageUrl} />

          <hr className="admin-divider" />

          <h2 id="gallery">Галерея ({place.photos.length})</h2>
          <ul className="admin-photo-grid">
            {place.photos.map((photo) => (
              <li key={photo.id} className="admin-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.caption ?? ""} loading="lazy" />
                <RotateButton target="placePhoto" id={photo.id} />
                <form action={deletePlacePhotoAction}>
                  <input type="hidden" name="photoId" value={photo.id} />
                  <input type="hidden" name="placeId" value={place.id} />
                  <SubmitButton className="admin-danger-link" pendingLabel="Удаляю…">
                    Удалить фото
                  </SubmitButton>
                </form>
              </li>
            ))}
          </ul>

          <form action={addPlacePhotoAction} className="admin-form admin-form-inline">
            <input type="hidden" name="placeId" value={place.id} />
            <PhotoField name="photoFile" label="Добавить фото в галерею" required />
            <label className="admin-field">
              <span>Подпись (необязательно)</span>
              <input type="text" name="caption" maxLength={ADMIN_FIELDS.caption.max} />
            </label>
            <SubmitButton pendingLabel="Загружаю…">Загрузить</SubmitButton>
          </form>

          <hr className="admin-divider" />

          <form action={deletePlaceAction}>
            <input type="hidden" name="id" value={place.id} />
            <SubmitButton className="admin-danger-button" pendingLabel="Удаляю…">
              Удалить место навсегда (вместе с занятиями, фото и часами)
            </SubmitButton>
          </form>
        </>
      ) : null}
    </section>
  );
}
