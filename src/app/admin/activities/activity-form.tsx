import { ADMIN_FIELDS, tooLongMessage } from "@/lib/admin/field-limits";
import { CoverPreview } from "@/app/admin/rotate-button";
import { TipsFields } from "@/app/admin/tips-fields";
import type { PlaceProgram } from "@prisma/client";
import { deleteActivityAction, saveActivityAction } from "@/app/admin/actions";
import { OcrScratchpad } from "@/app/admin/ocr-scratchpad";
import { PhotoField } from "@/app/admin/photo-field";
import { SubmitButton } from "@/app/admin/submit-button";

/**
 * Форма занятия (activity=null → создание). Возраст — в месяцах, как в БД
 * (чтобы 4-месячные малыши не терялись в «годах»). Возрастные классы
 * (таблица Little Gym) редактируются пока не здесь — они меняются редко.
 */

type PlaceOption = { id: string; name: string };

type ActivityFormProps = {
  activity:
    | (PlaceProgram & {
        _count?: { classes: number };
        tips?: Array<{ text: string; textEn: string | null }>;
      })
    | null;
  places: PlaceOption[];
  error?: string;
};

function pattayaLocalValue(date: Date | null | undefined): string {
  if (!date) {
    return "";
  }
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

export function ActivityForm({
  activity,
  places,
  error,
}: ActivityFormProps): React.ReactElement {
  return (
    <section className="admin-card">
      <h1>{activity ? `Занятие: ${activity.name}` : "Новое занятие"}</h1>
      {activity?.slug ? <p className="admin-muted">/{activity.slug}</p> : null}

      {tooLongMessage(error) ? (
        <p className="admin-error">{tooLongMessage(error)}</p>
      ) : null}
      {error === "name" ? <p className="admin-error">Название обязательно.</p> : null}
      {error === "upload" ? (
        <p className="admin-error">Фото не загрузилось — проверьте формат и размер.</p>
      ) : null}

      {/* как у мест: распознанный текст — в черновик для копирования */}
      <OcrScratchpad subject="Скрин расписания или прайса" />

      <form action={saveActivityAction} className="admin-form">
        {activity ? <input type="hidden" name="id" value={activity.id} /> : null}

        <label className="admin-field">
          <span>Название (рус) *</span>
          <input
            type="text"
            name="name"
            maxLength={ADMIN_FIELDS.name.max}
            defaultValue={activity?.name ?? ""}
            required
          />
        </label>

        <label className="admin-field">
          <span>Name (en)</span>
          <input
            type="text"
            name="nameEn"
            maxLength={ADMIN_FIELDS.nameEn.max}
            defaultValue={activity?.nameEn ?? ""}
          />
        </label>

        <label className="admin-field admin-field-inline">
          <span>Тип</span>
          <select name="type" defaultValue={activity?.type ?? "COURSE"}>
            <option value="COURSE">курс (регулярные занятия)</option>
            <option value="CAMP">лагерь (с датами)</option>
            <option value="MEMBERSHIP">абонемент (без своей страницы)</option>
          </select>
        </label>

        <label className="admin-field">
          <span>Описание (рус)</span>
          <textarea
            name="description"
            maxLength={ADMIN_FIELDS.description.max}
            rows={4}
            defaultValue={activity?.description ?? ""}
          />
        </label>

        <label className="admin-field">
          <span>Description (en)</span>
          <textarea
            name="descriptionEn"
            maxLength={ADMIN_FIELDS.descriptionEn.max}
            rows={4}
            defaultValue={activity?.descriptionEn ?? ""}
          />
        </label>

        <TipsFields tips={activity?.tips ?? []} />

        <div className="admin-row">
          <label className="admin-field">
            <span>Цена (THB)</span>
            <input type="text" name="price" defaultValue={activity?.price ?? ""} />
          </label>
          <label className="admin-field">
            <span>Старая цена (для акции)</span>
            <input type="text" name="oldPrice" defaultValue={activity?.oldPrice ?? ""} />
          </label>
        </div>

        <div className="admin-row">
          <label className="admin-field">
            <span>Подпись к цене (рус): «/ неделя», «за ребёнка»</span>
            <input
              type="text"
              name="priceUnit"
              maxLength={ADMIN_FIELDS.priceUnit.max}
              defaultValue={activity?.priceUnit ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Price unit (en)</span>
            <input
              type="text"
              name="priceUnitEn"
              maxLength={ADMIN_FIELDS.priceUnitEn.max}
              defaultValue={activity?.priceUnitEn ?? ""}
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
              defaultValue={activity?.minAgeMonths ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Возраст до (месяцев)</span>
            <input
              type="number"
              name="maxAgeMonths"
              min={0}
              defaultValue={activity?.maxAgeMonths ?? ""}
            />
          </label>
        </div>

        <div className="admin-row">
          <label className="admin-field">
            <span>Начало (для лагеря, время Паттайи)</span>
            <input
              type="datetime-local"
              name="startDate"
              defaultValue={pattayaLocalValue(activity?.startDate)}
            />
          </label>
          <label className="admin-field">
            <span>Конец</span>
            <input
              type="datetime-local"
              name="endDate"
              defaultValue={pattayaLocalValue(activity?.endDate)}
            />
          </label>
        </div>

        <label className="admin-field">
          <span>Место из каталога (или площадка текстом ниже)</span>
          <select name="placeId" defaultValue={activity?.placeId ?? ""}>
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
            <span>Площадка текстом (рус)</span>
            <input
              type="text"
              name="venueName"
              maxLength={ADMIN_FIELDS.venueName.max}
              defaultValue={activity?.venueName ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Venue (en)</span>
            <input
              type="text"
              name="venueNameEn"
              maxLength={ADMIN_FIELDS.venueNameEn.max}
              defaultValue={activity?.venueNameEn ?? ""}
            />
          </label>
        </div>

        <label className="admin-field">
          <span>Адрес площадки</span>
          <input
            type="text"
            name="venueAddress"
            maxLength={ADMIN_FIELDS.venueAddress.max}
            defaultValue={activity?.venueAddress ?? ""}
          />
        </label>

        <PhotoField
          name="coverFile"
          label={`Обложка ${activity?.imageUrl ? "(файл заменит текущую)" : "(файл)"}`}
        />

        <div className="admin-row">
          <label className="admin-field admin-field-inline">
            <span>Видимость</span>
            <select name="status" defaultValue={activity?.status ?? "APPROVED"}>
              <option value="APPROVED">на сайте</option>
              <option value="PENDING">скрыто</option>
            </select>
          </label>
          <label className="admin-check">
            <input
              type="checkbox"
              name="isDemo"
              defaultChecked={activity?.isDemo ?? false}
            />
            <span>демо-запись</span>
          </label>
        </div>

        <SubmitButton>Сохранить</SubmitButton>
      </form>

      {activity ? (
        <>
          <CoverPreview
            target="activityCover"
            id={activity.id}
            imageUrl={activity.imageUrl}
          />
          <hr className="admin-divider" />
          <form action={deleteActivityAction}>
            <input type="hidden" name="id" value={activity.id} />
            <SubmitButton className="admin-danger-button" pendingLabel="Удаляю…">
              Удалить занятие навсегда
              {activity._count && activity._count.classes > 0
                ? ` (вместе с ${activity._count.classes} классами)`
                : ""}
            </SubmitButton>
          </form>
        </>
      ) : null}
    </section>
  );
}
