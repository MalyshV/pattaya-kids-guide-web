import { CLASS_LIMITS, EXTRA_CLASS_ROWS, classFieldName } from "@/lib/admin/class-rows";

export type ClassFieldsItem = {
  id: string;
  name: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  ageLabel: string;
  ageLabelEn: string | null;
  parentRequired: boolean | null;
  schedule: string;
  scheduleEn: string | null;
};

type ClassFieldsProps = {
  classes: readonly ClassFieldsItem[];
};

function parentValue(value: boolean | null): string {
  return value === true ? "true" : value === false ? "false" : "";
}

/**
 * Таблица возрастных классов в форме занятия: существующие классы + пустые
 * строки под новые. Стёрли название — класс удалится при сохранении. Как это
 * сохраняется (и что происходит с тайскими подписями) — lib/admin/class-rows.
 */
export function ClassFields({ classes }: ClassFieldsProps): React.ReactElement {
  const rowCount = Math.min(
    classes.length + EXTRA_CLASS_ROWS,
    CLASS_LIMITS.maxCount + EXTRA_CLASS_ROWS,
  );
  const rows = Array.from({ length: rowCount }, (_, index) => classes[index] ?? null);

  return (
    <fieldset className="admin-fieldset">
      <legend>Классы по возрастам ({classes.length})</legend>
      {/* метка «таблица была в форме»: без неё пустая таблица неотличима от
          старой вкладки без этого блока — та стёрла бы все классы */}
      <input type="hidden" name="classRowCount" value={rowCount} />
      <p className="admin-muted">
        Для занятий с делением по возрастам (как у The Little Gym). Класс — это строка с
        названием: стёрли название и сохранили — класс удалится. Порядок на сайте — как
        здесь. Возраст — в месяцах (5 лет = 60). Подпись возраста можно не писать:
        соберётся из месяцев. Поменяли время в расписании — тайский перевод этой строки
        сбросится.
      </p>
      <div className="admin-classes">
        {rows.map((item, index) => (
          <div key={item?.id ?? `new-${index}`} className="admin-class-row">
            <input
              type="hidden"
              name={classFieldName(index, "id")}
              value={item?.id ?? ""}
            />
            <div className="admin-row">
              <label className="admin-field">
                <span>{item ? `Класс ${index + 1}` : "Новый класс"} — название</span>
                <input
                  type="text"
                  name={classFieldName(index, "name")}
                  maxLength={CLASS_LIMITS.name}
                  defaultValue={item?.name ?? ""}
                />
              </label>
              <label className="admin-field admin-field-inline">
                <span>От (мес)</span>
                <input
                  type="number"
                  name={classFieldName(index, "minAgeMonths")}
                  min={0}
                  max={CLASS_LIMITS.maxAgeMonths}
                  defaultValue={item?.minAgeMonths ?? ""}
                />
              </label>
              <label className="admin-field admin-field-inline">
                <span>До (мес)</span>
                <input
                  type="number"
                  name={classFieldName(index, "maxAgeMonths")}
                  min={0}
                  max={CLASS_LIMITS.maxAgeMonths}
                  defaultValue={item?.maxAgeMonths ?? ""}
                />
              </label>
              <label className="admin-field admin-field-inline">
                <span>С родителем</span>
                <select
                  name={classFieldName(index, "parentRequired")}
                  defaultValue={parentValue(item?.parentRequired ?? null)}
                >
                  <option value="">уточняется</option>
                  <option value="true">да</option>
                  <option value="false">нет</option>
                </select>
              </label>
            </div>
            <div className="admin-row">
              <label className="admin-field">
                <span>Расписание (рус)</span>
                <input
                  type="text"
                  name={classFieldName(index, "schedule")}
                  maxLength={CLASS_LIMITS.schedule}
                  placeholder="Вт 10:00 · Чт 14:00"
                  defaultValue={item?.schedule ?? ""}
                />
              </label>
              <label className="admin-field">
                <span>Schedule (en)</span>
                <input
                  type="text"
                  name={classFieldName(index, "scheduleEn")}
                  maxLength={CLASS_LIMITS.schedule}
                  placeholder="Tue 10:00 · Thu 14:00"
                  defaultValue={item?.scheduleEn ?? ""}
                />
              </label>
            </div>
            <div className="admin-row">
              <label className="admin-field">
                <span>Подпись возраста (рус) — пусто = из месяцев</span>
                <input
                  type="text"
                  name={classFieldName(index, "ageLabel")}
                  maxLength={CLASS_LIMITS.ageLabel}
                  placeholder="4–10 мес"
                  defaultValue={item?.ageLabel ?? ""}
                />
              </label>
              <label className="admin-field">
                <span>Age label (en)</span>
                <input
                  type="text"
                  name={classFieldName(index, "ageLabelEn")}
                  maxLength={CLASS_LIMITS.ageLabel}
                  placeholder="4–10 mo"
                  defaultValue={item?.ageLabelEn ?? ""}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
