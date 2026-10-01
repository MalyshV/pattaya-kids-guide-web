/** Совет «Полезно знать» — одинаковый у места, события и занятия. */
export type TipDto = {
  id: string;
  text: string;
  topic: string | null;
  verifiedAt: Date | null;
};
