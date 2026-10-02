/**
 * Пределы длины текстовых полей в формах админки. Пишет туда только владелица,
 * поэтому это не защита от злоумышленника, а страховка от случайности:
 * вставленная в «Название» простыня разнесла бы карточки по всему сайту.
 *
 * Одни и те же числа стоят и в самих полях (maxLength — браузер не даст
 * вписать больше), и на сервере (форму можно отправить и в обход браузера).
 * Сервер не обрезает молча, а возвращает форму с объяснением.
 */

export const ADMIN_FIELDS = {
  name: { label: "Название", max: 150 },
  nameEn: { label: "Name (en)", max: 150 },
  title: { label: "Название", max: 150 },
  titleEn: { label: "Title (en)", max: 150 },
  description: { label: "Описание (рус)", max: 5000 },
  descriptionEn: { label: "Description (en)", max: 5000 },
  address: { label: "Адрес", max: 300 },
  // полная ссылка Карт с параметрами бывает длинной — предел с запасом
  googleMapsUrl: { label: "Ссылка на карточку Google Maps", max: 1000 },
  locationName: { label: "Название площадки", max: 150 },
  venueName: { label: "Площадка", max: 150 },
  venueNameEn: { label: "Venue (en)", max: 150 },
  venueAddress: { label: "Адрес площадки", max: 300 },
  priceUnit: { label: "Подпись к цене", max: 60 },
  priceUnitEn: { label: "Price unit (en)", max: 60 },
  birthdayNotes: { label: "Заметки о дне рождения (рус)", max: 2000 },
  birthdayNotesEn: { label: "Notes (en)", max: 2000 },
  caption: { label: "Подпись к фото", max: 200 },
} as const;

export type AdminField = keyof typeof ADMIN_FIELDS;

/** какие поля проверяет каждая форма */
export const PLACE_FIELDS = [
  "name",
  "description",
  "descriptionEn",
  "address",
  "googleMapsUrl",
  "birthdayNotes",
  "birthdayNotesEn",
] as const satisfies readonly AdminField[];

export const EVENT_FIELDS = [
  "title",
  "titleEn",
  "description",
  "descriptionEn",
  "locationName",
  "address",
] as const satisfies readonly AdminField[];

export const ACTIVITY_FIELDS = [
  "name",
  "nameEn",
  "description",
  "descriptionEn",
  "priceUnit",
  "priceUnitEn",
  "venueName",
  "venueNameEn",
  "venueAddress",
] as const satisfies readonly AdminField[];

const ERROR_PREFIX = "long-";

/**
 * Первое поле длиннее предела — кодом ошибки для адреса («long-name»), или
 * null, если всё в порядке. Длину считаем после обрезки пробелов по краям —
 * так же, как значение потом сохраняется.
 */
export function tooLongError(
  read: (field: AdminField) => string | null | undefined,
  fields: readonly AdminField[],
): string | null {
  for (const field of fields) {
    const value = (read(field) ?? "").trim();
    if (value.length > ADMIN_FIELDS[field].max) {
      return `${ERROR_PREFIX}${field}`;
    }
  }
  return null;
}

/** Код ошибки из адреса → текст для формы; чужой код — null. */
export function tooLongMessage(error: string | undefined): string | null {
  if (!error?.startsWith(ERROR_PREFIX)) {
    return null;
  }
  const field = error.slice(ERROR_PREFIX.length);
  if (!Object.hasOwn(ADMIN_FIELDS, field)) {
    return null;
  }
  const { label, max } = ADMIN_FIELDS[field as AdminField];
  return `Слишком длинно: «${label}» — не больше ${max} знаков. Ничего не сохранено — сократите текст и сохраните ещё раз.`;
}
