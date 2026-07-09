/** Площадка дня рождения на лендинге «Дни рождения». */
export type BirthdayPlaceDto = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  address: string | null;
  minGuests: number | null;
  maxGuests: number | null;
  /** tri-state: null = «уточняется» */
  depositRequired: boolean | null;
  preBookingDays: number | null;
  /** пакеты и цены свободным текстом (как на постере места) */
  notes: string | null;
  contacts: {
    id: string;
    type: string;
    value: string;
  }[];
};
