/**
 * Блок «День рождения» формы места: разбор и проверка полей.
 * Чистая функция — всё, что пришло из формы, приходит строками.
 */

export type BirthdayFormRaw = {
  /** чекбокс «Здесь проводят дни рождения» */
  enabled: boolean;
  hasPackages: boolean;
  minGuests: string;
  maxGuests: string;
  /** "true" / "false" / "" (уточняется) */
  depositRequired: string;
  preBookingDays: string;
  notes: string;
  notesEn: string;
};

export type BirthdayInfoData = {
  hasPackages: boolean;
  minGuests: number | null;
  maxGuests: number | null;
  depositRequired: boolean | null;
  preBookingDays: number | null;
  notes: string | null;
  notesEn: string | null;
};

export type BirthdayParseResult =
  | { ok: true; info: BirthdayInfoData | null }
  | { ok: false; error: "guests" };

/** целое число ≥ min; пусто, мусор, дроби и отрицательные → null */
export function parseWholeNumber(raw: string, min: number): number | null {
  const value = raw.trim();
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= min ? parsed : null;
}

function textOrNull(raw: string): string | null {
  const value = raw.trim();
  return value === "" ? null : value;
}

/**
 * enabled снят → info: null (запись о ДР у места удаляется).
 * minGuests > maxGuests → ошибка «guests»: молча менять числа местами нельзя.
 */
export function parseBirthdayForm(raw: BirthdayFormRaw): BirthdayParseResult {
  if (!raw.enabled) return { ok: true, info: null };

  const minGuests = parseWholeNumber(raw.minGuests, 1);
  const maxGuests = parseWholeNumber(raw.maxGuests, 1);
  if (minGuests !== null && maxGuests !== null && minGuests > maxGuests) {
    return { ok: false, error: "guests" };
  }

  return {
    ok: true,
    info: {
      hasPackages: raw.hasPackages,
      minGuests,
      maxGuests,
      depositRequired:
        raw.depositRequired === "true"
          ? true
          : raw.depositRequired === "false"
            ? false
            : null,
      preBookingDays: parseWholeNumber(raw.preBookingDays, 0),
      notes: textOrNull(raw.notes),
      notesEn: textOrNull(raw.notesEn),
    },
  };
}
