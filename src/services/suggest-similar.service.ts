import "server-only";

import { isSupportedLang } from "@/content/dictionary";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { mapsUrlFrom, parseMapsLink, type MapsLink } from "@/lib/geo/maps-link";
import { resolveShortMapsLink } from "@/lib/geo/resolve-maps-link";
import {
  MIN_DUP_NAME_LENGTH,
  findDuplicateCandidates,
  type DupKind,
  type DupReason,
} from "@/lib/search/duplicates";
import { SUGGEST_LIMITS } from "@/lib/suggest/submission";
import { getDupCandidates } from "@/services/suggest.service";

/**
 * Общая серверная часть формы «Предложить своё»: разбор поля «Где» (с
 * раскрытием коротких ссылок) и подсказка «похоже, уже есть». Её зовут и
 * GET /api/suggest/similar (живая подсказка), и сохранение предложения.
 */

// ── короткие ссылки: кэш на инстанс ────────────────────────────────────────
// Удачное раскрытие живёт долго (ссылка не меняется), неудачное — минуту:
// таймаут или сбой Google не должен «отравлять» ссылку до перезапуска.
const RESOLVED_TTL_MS = 24 * 60 * 60 * 1000;
const FAILED_TTL_MS = 60 * 1000;
const SHORT_LINK_CACHE_MAX = 300;
const shortLinkCache = new Map<string, { url: string | null; until: number }>();

async function resolveCached(shortUrl: string): Promise<string | null> {
  // ключ — без хвоста ?g_st=… (одна и та же ссылка из разных приложений)
  let key = shortUrl;
  try {
    const parsed = new URL(shortUrl);
    key = `${parsed.hostname}${parsed.pathname}`;
  } catch {
    // оставляем как есть
  }
  const now = Date.now();
  const hit = shortLinkCache.get(key);
  if (hit && hit.until > now) {
    return hit.url;
  }
  const url = await resolveShortMapsLink(shortUrl);
  if (shortLinkCache.size >= SHORT_LINK_CACHE_MAX) {
    shortLinkCache.clear();
  }
  shortLinkCache.set(key, { url, until: now + (url ? RESOLVED_TTL_MS : FAILED_TTL_MS) });
  return url;
}

export type LocationInfo = {
  link: MapsLink | null;
  /** полная ссылка Карт (короткая — раскрытая), null — не Карты */
  fullUrl: string | null;
};

export async function locationInfo(location: string): Promise<LocationInfo> {
  const url = mapsUrlFrom(location);
  const link = url ? parseMapsLink(url) : null;
  if (!url || !link) {
    return { link: null, fullUrl: null };
  }
  if (!link.isShort) {
    return { link, fullUrl: url };
  }
  const resolved = await resolveCached(url);
  const full = resolved ? parseMapsLink(resolved) : null;
  return { link: full ?? link, fullUrl: resolved ?? url };
}

export type SimilarHint = {
  key: string;
  kind: DupKind;
  /** пусто у чужого предложения — его текст не показываем */
  label: string;
  href: string | null;
  reason: DupReason;
  distanceM: number | null;
  /** событие уже прошло */
  past: boolean;
};

export async function findSimilar(input: {
  lang: string;
  city: string;
  name: string;
  location: string;
}): Promise<SimilarHint[]> {
  if (!isSupportedLang(input.lang)) {
    return [];
  }
  const city = await getCityBySlug(input.city);
  if (!city) {
    return [];
  }
  const typed = input.name.slice(0, SUGGEST_LIMITS.name).trim();
  const { link } = await locationInfo(input.location.slice(0, SUGGEST_LIMITS.location));
  const basePath = cityBasePath(input.lang, city.slug);
  const candidates = await getDupCandidates(city.id, basePath, input.lang);

  const matches = findDuplicateCandidates(
    {
      // своё название, а если оно ещё слишком короткое — из ссылки Карт
      name: typed.length >= MIN_DUP_NAME_LENGTH ? typed : link?.name || typed,
      point: link?.pin ?? link?.viewport ?? null,
      precise: Boolean(link?.pin),
    },
    candidates,
  );

  const hints: SimilarHint[] = [];
  let pendingAdded = false;
  for (const { candidate, reason, distanceM } of matches) {
    if (candidate.kind === "submission") {
      // от чужих предложений — только факт, одной строкой, без id и расстояния
      if (!pendingAdded) {
        pendingAdded = true;
        hints.push({
          key: "submission",
          kind: "submission",
          label: "",
          href: null,
          reason: "name",
          distanceM: null,
          past: false,
        });
      }
      continue;
    }
    hints.push({
      key: candidate.key,
      kind: candidate.kind,
      label: candidate.label,
      href: candidate.href,
      reason,
      distanceM: distanceM === null ? null : Math.round(distanceM),
      past: Boolean(candidate.past),
    });
  }
  return hints;
}
