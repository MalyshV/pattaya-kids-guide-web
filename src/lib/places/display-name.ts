import { pickLocalized } from "@/lib/i18n/localize";

/**
 * Отображаемое имя места. У точки сети (docs/CHAINS_PLAN.md) `name` — это
 * бренд как на вывеске («Skippy Land»), а метка точки переводится:
 * «Skippy Land · Lotus's North, у фудкорта» / «… by the food court» /
 * «… ติดฟู้ดคอร์ท». Единственное место, где имя и метка склеиваются, —
 * карточка, страница, карта, поиск, «Избранное», Telegram и JSON-LD зовут
 * сюда. Место без метки показывается как есть.
 */

export type BranchLabeled = {
  name: string;
  branchLabel?: string | null;
  branchLabelEn?: string | null;
  branchLabelTh?: string | null;
};

/** Разделитель бренда и метки — средняя точка с пробелами, как в названиях сетей. */
export const BRANCH_SEPARATOR = " · ";

export function placeDisplayName(place: BranchLabeled, lang: string): string {
  const label = pickLocalized(
    place.branchLabel ?? null,
    place.branchLabelEn,
    place.branchLabelTh,
    lang,
  );
  const trimmed = label?.trim() ?? "";
  return trimmed ? `${place.name}${BRANCH_SEPARATOR}${trimmed}` : place.name;
}

/** Все написания имени точки (ru/en/th) — для поиска и проверки на дубли. */
export function placeDisplayNames(place: BranchLabeled): string[] {
  return [...new Set(["ru", "en", "th"].map((lang) => placeDisplayName(place, lang)))];
}
