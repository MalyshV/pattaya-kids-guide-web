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

function minChildPrice(
  prices: readonly SiblingEntryPrice[],
): { amount: number; currency: string } | null {
  const known = prices.filter(
    (tier): tier is SiblingEntryPrice & { childPrice: number } => tier.childPrice != null,
  );
  if (known.length === 0) {
    return null;
  }
  const cheapest = known.reduce((best, tier) =>
    tier.childPrice < best.childPrice ? tier : best,
  );
  return { amount: cheapest.childPrice, currency: cheapest.currency };
}

function firstLabel(prices: readonly SiblingEntryPrice[], lang: string): string | null {
  const first = [...prices].sort((a, b) => a.order - b.order)[0];
  if (!first) {
    return null;
  }
  const label = pickLocalized(first.label, first.labelEn, first.labelTh, lang).trim();
  return label || null;
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
        entryFrom: minChildPrice(sibling.entryPrices),
        sessionLabel: firstLabel(sibling.entryPrices, lang),
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
