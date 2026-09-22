/**
 * Форма «Предложить своё»: чистая проверка присланного (без БД и сети).
 * Сервер не доверяет ничему из браузера: тип — из белого списка, длины
 * ограничены, контакт — только у владельца, фото — только с галочкой «вправе
 * делиться».
 *
 * Обязательных полей два — название и «где» (ссылка Google Карт или адрес):
 * решение Вероники 22.09, форма должна быть максимально простой.
 */

export const SUGGEST_KINDS = ["place", "event", "activity", "birthday"] as const;
export type SuggestKind = (typeof SUGGEST_KINDS)[number];

/** Куда ведёт «← Назад» и «Вернуться к списку»: каталог того типа, откуда пришли. */
export const KIND_LIST_PATH: Record<SuggestKind, string> = {
  place: "/places",
  event: "/events",
  activity: "/activities",
  birthday: "/birthdays",
};

/** черновик формы в localStorage (чистит страница «Спасибо») */
export const SUGGEST_DRAFT_KEY = "pkg-suggest-draft";

export function parseSuggestKind(value: unknown): SuggestKind | null {
  return typeof value === "string" && (SUGGEST_KINDS as readonly string[]).includes(value)
    ? (value as SuggestKind)
    : null;
}

export const SUGGEST_LIMITS = {
  name: 150,
  location: 600,
  when: 200,
  tip: 2000,
  birthday: 2000,
  link: 500,
  contact: 200,
  /** подсказки «похоже», которые видел человек (для админки) */
  shownMatches: 5,
  shownMatchLength: 80,
} as const;

export const MIN_NAME_LENGTH = 2;
export const MIN_LOCATION_LENGTH = 3;

export type SuggestField =
  | "kind"
  | "name"
  | "location"
  | "when"
  | "tip"
  | "birthday"
  | "link"
  | "contact"
  /** галочка «это мои фото или я вправе ими делиться» */
  | "photoRights";
export type SuggestError = "required" | "tooShort" | "tooLong";
export type SuggestErrors = Partial<Record<SuggestField, SuggestError>>;

export type SuggestionValue = {
  kind: SuggestKind;
  /** тип, выставленный страницей, — видно, поменял ли его человек */
  presetKind: SuggestKind | null;
  name: string;
  location: string;
  whenText: string | null;
  tip: string | null;
  birthdayIncludes: string | null;
  link: string | null;
  isOwner: boolean;
  contact: string | null;
  shownMatches: string[];
  /** человек подтвердил права на приложенные фото (без фото — всегда false) */
  photoRightsOk: boolean;
};

export type RawSuggestion = Record<string, string | undefined>;

// управляющие символы (кроме перевода строки в многострочных полях) — мусор
// копипаста и ботов; в админке их всё равно не видно
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function singleLine(value: string | undefined): string {
  return (value ?? "").replace(CONTROL, "").replace(/\s+/g, " ").trim();
}

function multiLine(value: string | undefined): string {
  return (value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function validateSuggestion(
  raw: RawSuggestion,
  /** сколько фото пришло вместе с формой (сами файлы проверяются отдельно) */
  photoCount = 0,
): { ok: true; value: SuggestionValue } | { ok: false; errors: SuggestErrors } {
  const errors: SuggestErrors = {};

  const kind = parseSuggestKind(raw.kind);
  if (!kind) {
    errors.kind = "required";
  }

  const name = singleLine(raw.name);
  if (!name) {
    errors.name = "required";
  } else if (name.length < MIN_NAME_LENGTH) {
    errors.name = "tooShort";
  } else if (name.length > SUGGEST_LIMITS.name) {
    errors.name = "tooLong";
  }

  const location = singleLine(raw.location);
  if (!location) {
    errors.location = "required";
  } else if (location.length < MIN_LOCATION_LENGTH) {
    errors.location = "tooShort";
  } else if (location.length > SUGGEST_LIMITS.location) {
    errors.location = "tooLong";
  }

  const optional = (field: SuggestField, value: string, limit: number): string | null => {
    if (!value) {
      return null;
    }
    if (value.length > limit) {
      errors[field] = "tooLong";
    }
    return value;
  };

  // «когда» и «что входит в праздник» храним при любом типе: форма оставляет
  // поле с текстом на экране и после смены типа — написанное не пропадает
  const whenText = optional("when", singleLine(raw.when), SUGGEST_LIMITS.when);
  const tip = optional("tip", multiLine(raw.tip), SUGGEST_LIMITS.tip);
  const birthdayIncludes = optional(
    "birthday",
    multiLine(raw.birthday),
    SUGGEST_LIMITS.birthday,
  );
  const link = optional("link", singleLine(raw.link), SUGGEST_LIMITS.link);
  const isOwner = raw.isOwner === "on" || raw.isOwner === "true";
  const contact = isOwner
    ? optional("contact", singleLine(raw.contact), SUGGEST_LIMITS.contact)
    : null;

  // решение Вероники: одна галочка «моё фото или вправе делиться» — без неё
  // фото не принимаем (и не держим галочку заранее отмеченной)
  const photoRightsOk =
    photoCount > 0 && (raw.photoRightsOk === "on" || raw.photoRightsOk === "true");
  if (photoCount > 0 && !photoRightsOk) {
    errors.photoRights = "required";
  }

  const shownMatches = (raw.shownMatches ?? "")
    .split("\n")
    .map((item) => singleLine(item).slice(0, SUGGEST_LIMITS.shownMatchLength))
    .filter(Boolean)
    .slice(0, SUGGEST_LIMITS.shownMatches);

  if (Object.keys(errors).length > 0 || !kind) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      kind,
      presetKind: parseSuggestKind(raw.presetKind),
      name,
      location,
      whenText,
      tip,
      birthdayIncludes,
      link,
      isOwner,
      contact,
      shownMatches,
      photoRightsOk,
    },
  };
}

/** имя скрытого поля-ловушки: нейтральное, чтобы автозаполнение браузера и
    менеджеры паролей (они ищут «website», «url», «email») его не трогали */
export const HONEYPOT_FIELD = "pkg_extra";

/**
 * Бот? Заполнено скрытое поле-ловушка (людям его не видно). Проверку «слишком
 * быстро заполнил» сознательно не делаем: восстановленный черновик законно
 * отправляют через секунду после открытия — и предложение молча терялось бы.
 * Главная защита — лимит отправок в час.
 */
export function looksLikeBot(raw: RawSuggestion): boolean {
  return (raw[HONEYPOT_FIELD] ?? "").trim() !== "";
}
