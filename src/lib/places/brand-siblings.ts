import type { BrandSiblingDto } from "@/dto/brand-sibling.dto";
import { haversineMeters, type GeoPoint } from "@/lib/geo/distance";
import { pickLocalized } from "@/lib/i18n/localize";
import { placeDisplayName, type BranchLabeled } from "@/lib/places/display-name";
import { DUPLICATE_RADIUS_M } from "@/lib/search/duplicates";

/**
 * Чистое ядро блока «Другие {сеть} в {городе}» (docs/CHAINS_PLAN.md):
 * из других точек сети собирает строки — отображаемое имя, расстояние,
 * автоматические факты (вход от, сеанс, можно оставить) и фразу от руки —
 * и сортирует по близости. Без БД и словаря: подписи к фактам подставляет
 * компонент по языку страницы.
 */

/** Ближе этого — «в этом же ТЦ»: тот же порог, что у дублей и импорта. */
export const SAME_MALL_RADIUS_M = DUPLICATE_RADIUS_M;

/** Сколько строк видно сразу; остальные — под «ещё N». */
export const SIBLINGS_SHOWN = 3;

export type SiblingEntryPrice = {
  label: string;
  labelEn: string | null;
  labelTh: string | null;
  childPrice: number | null;
  currency: string;
  order: number;
};

export type SiblingSource = BranchLabeled & {
  slug: string;
  latitude: number;
  longitude: number;
  canLeaveChild: boolean | null;
  branchNote?: string | null;
  branchNoteEn?: string | null;
  branchNoteTh?: string | null;
  entryPrices: readonly SiblingEntryPrice[];
};

/**
 * Цена и подпись — из ОДНОЙ строки таблицы входа (первой с детской ценой):
 * строка блока читается «60 ฿, сеанс 40 мин», и склеивать цену одной строки с
 * подписью другой нельзя. Детской цены нет ни у одной — цены нет, подпись
 * берём у первой строки.
 */
function entryTier(
  prices: readonly SiblingEntryPrice[],
  lang: string,
): Pick<BrandSiblingDto, "entryFrom" | "sessionLabel"> {
  const sorted = [...prices].sort((a, b) => a.order - b.order);
  const priced = sorted.find((tier) => tier.childPrice != null) ?? null;
  const labelSource = priced ?? sorted[0] ?? null;
  const label = labelSource
    ? pickLocalized(
        labelSource.label,
        labelSource.labelEn,
        labelSource.labelTh,
        lang,
      ).trim()
    : "";
  return {
    entryFrom:
      priced && priced.childPrice != null
        ? { amount: priced.childPrice, currency: priced.currency }
        : null,
    sessionLabel: label || null,
  };
}

/** Строки блока: другие точки сети, отсортированные по расстоянию от текущей. */
export function buildBrandSiblingRows(
  origin: GeoPoint,
  siblings: readonly SiblingSource[],
  lang: string,
): BrandSiblingDto[] {
  return siblings
    .map((sibling): BrandSiblingDto => {
      const distanceM = haversineMeters(origin, sibling);
      const note = pickLocalized(
        sibling.branchNote ?? null,
        sibling.branchNoteEn,
        sibling.branchNoteTh,
        lang,
      );
      return {
        slug: sibling.slug,
        name: placeDisplayName(sibling, lang),
        distanceM,
        sameMall: distanceM <= SAME_MALL_RADIUS_M,
        ...entryTier(sibling.entryPrices, lang),
        canLeaveChild: sibling.canLeaveChild === true,
        note: note?.trim() ? note.trim() : null,
      };
    })
    .sort((a, b) => a.distanceM - b.distanceM || a.name.localeCompare(b.name));
}

/** Первые N — сразу, остальные — под «ещё N». */
export function splitBrandSiblingRows(
  rows: readonly BrandSiblingDto[],
  shown: number = SIBLINGS_SHOWN,
): { shown: BrandSiblingDto[]; more: BrandSiblingDto[] } {
  return { shown: rows.slice(0, shown), more: rows.slice(shown) };
}
