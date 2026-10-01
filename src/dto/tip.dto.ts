/** Совет «Полезно знать» — одинаковый у места, события и занятия. */
export type TipDto = {
  id: string;
  text: string;
  topic: string | null;
  verifiedAt: Date | null;
  /**
   * Чей это совет, если он показан не на своей странице: на странице места —
   * советы его событий и занятий, с названием и ссылкой («Kids Pilates: …»).
   */
  source?: { label: string; href: string | null };
};
