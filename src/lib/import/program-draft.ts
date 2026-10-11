export type DraftSources = {
  googleMapsUrl: string;
  website: string | null;
  facebookUrl: string | null;
};

/**
 * Служебная пометка в описании черновика занятия. У занятия нет полей
 * контактов, поэтому источники кладём в описание: автор карточки видит, откуда
 * взять сайт и Facebook, и заменяет пометку настоящим описанием. Начало
 * «[черновик]» отличает её при вычитке.
 */
export function buildDraftNote(sources: DraftSources): string {
  const lines = [
    "[черновик] Заменить описанием. Источники для вычитки:",
    `Карта: ${sources.googleMapsUrl}`,
  ];
  if (sources.website) {
    lines.push(`Сайт: ${sources.website}`);
  }
  if (sources.facebookUrl) {
    lines.push(`Facebook: ${sources.facebookUrl}`);
  }
  return lines.join("\n");
}

/** Описание всё ещё служебная пометка — карточку нельзя публиковать. */
export function isDraftNote(description: string | null | undefined): boolean {
  return Boolean(description && description.trimStart().startsWith("[черновик]"));
}
