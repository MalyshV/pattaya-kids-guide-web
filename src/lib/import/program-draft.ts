export type DraftSources = {
  googleMapsUrl: string;
  website: string | null;
  facebookUrl: string | null;
  instagramUrl?: string | null;
  phone?: string | null;
  lineUrl?: string | null;
  /// что известно из источников (возраст, язык, чем полезно) — для вычитки
  about?: string | null;
  /// где ещё подтверждено, что работает (страницы, на которые опирались)
  otherSources?: readonly string[];
};

/**
 * Служебная пометка в описании черновика. У занятия нет полей контактов,
 * поэтому источники кладём в описание: автор карточки видит, откуда взять
 * сайт и соцсети, и заменяет пометку настоящим описанием. Начало
 * «[черновик]» отличает её при вычитке.
 */
export function buildDraftNote(sources: DraftSources): string {
  const lines = ["[черновик] Заменить описанием. Источники для вычитки:"];
  if (sources.about) {
    lines.push(`Что известно: ${sources.about}`);
  }
  lines.push(`Карта: ${sources.googleMapsUrl}`);
  if (sources.website) {
    lines.push(`Сайт: ${sources.website}`);
  }
  if (sources.facebookUrl) {
    lines.push(`Facebook: ${sources.facebookUrl}`);
  }
  if (sources.instagramUrl) {
    lines.push(`Instagram: ${sources.instagramUrl}`);
  }
  if (sources.phone) {
    lines.push(`Телефон: ${sources.phone}`);
  }
  if (sources.lineUrl) {
    lines.push(`LINE: ${sources.lineUrl}`);
  }
  for (const url of sources.otherSources ?? []) {
    lines.push(`Ещё: ${url}`);
  }
  return lines.join("\n");
}

/** Описание всё ещё служебная пометка — карточку нельзя публиковать. */
export function isDraftNote(description: string | null | undefined): boolean {
  return Boolean(description && description.trimStart().startsWith("[черновик]"));
}
