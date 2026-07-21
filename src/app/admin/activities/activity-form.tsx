import type { PlaceProgram } from "@prisma/client";
import { deleteActivityAction, saveActivityAction } from "@/app/admin/actions";
import { OcrScratchpad } from "@/app/admin/ocr-scratchpad";
import { SubmitButton } from "@/app/admin/submit-button";

/**
 * Форма занятия (activity=null → создание). Возраст — в месяцах, как в БД
 * (чтобы 4-месячные малыши не терялись в «годах»). Возрастные классы
 * (таблица Little Gym) редактируются пока не здесь — они меняются редко.
 */

type PlaceOption = { id: string; name: string };

type ActivityFormProps = {
  activity: (PlaceProgram & { _count?: { classes: number } }) | null;
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
          <input type="text" name="name" defaultValue={activity?.name ?? ""} required />
        </label>

        <label className="admin-field">
          <span>Name (en)</span>
          <input type="text" name="nameEn" defaultValue={activity?.nameEn ?? ""} />
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
            rows={4}
            defaultValue={activity?.description ?? ""}
          />
        </label>

        <label className="admin-field">
          <span>Description (en)</span>
          <textarea
            name="descriptionEn"
            rows={4}
            defaultValue={activity?.descriptionEn ?? ""}
          />
        </label>

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
              defaultValue={activity?.priceUnit ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Price unit (en)</span>
            <input
              type="text"
              name="priceUnitEn"
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
              defaultValue={activity?.venueName ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Venue (en)</span>
            <input
              type="text"
              name="venueNameEn"
              defaultValue={activity?.venueNameEn ?? ""}
            />
          </label>
        </div>

        <label className="admin-field">
          <span>Адрес площадки</span>
          <input
            type="text"
            name="venueAddress"
            defaultValue={activity?.venueAddress ?? ""}
          />
        </label>

        <label className="admin-field">
          <span>Обложка {activity?.imageUrl ? "(файл заменит текущую)" : "(файл)"}</span>
          <input type="file" name="coverFile" accept="image/*" />
        </label>

        <label className="admin-check">
          <input
            type="checkbox"
            name="isDemo"
            defaultChecked={activity?.isDemo ?? false}
          />
          <span>демо-запись</span>
        </label>

        <SubmitButton>Сохранить</SubmitButton>
      </form>

      {activity ? (
        <>
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
