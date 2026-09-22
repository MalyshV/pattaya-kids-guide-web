import { SHORT_MAPS_HOSTS, isGoogleMapsHost, isMapsUrl } from "@/lib/geo/maps-link";

/**
 * Раскрытие короткой ссылки «Поделиться» (maps.app.goo.gl/…) в полную — только
 * на сервере. Сервер ходит по ссылке, которую прислал посторонний человек,
 * поэтому защита от SSRF: на КАЖДОМ шаге — только https и хост из точного
 * списка Google; тело ответа не читаем; не больше MAX_HOPS переходов и
 * HOP_TIMEOUT_MS на каждый. Любая неудача — null (форма спокойно проверит
 * дубли только по названию).
 */

const MAX_HOPS = 4;
const HOP_TIMEOUT_MS = 3000;
const CONSENT_HOST = "consent.google.com";

type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

function allowedHop(url: URL): boolean {
  if (
    url.protocol !== "https:" ||
    url.port !== "" ||
    url.username !== "" ||
    url.password !== ""
  ) {
    return false;
  }
  return (
    isGoogleMapsHost(url.hostname) ||
    SHORT_MAPS_HOSTS.has(url.hostname) ||
    url.hostname === CONSENT_HOST
  );
}

export async function resolveShortMapsLink(
  raw: string,
  fetchImpl: FetchLike = fetch,
): Promise<string | null> {
  let current: URL;
  try {
    current = new URL(
      /^https?:\/\//i.test(raw.trim()) ? raw.trim() : `https://${raw.trim()}`,
    );
  } catch {
    return null;
  }
  if (!SHORT_MAPS_HOSTS.has(current.hostname) || !allowedHop(current)) {
    return null;
  }

  for (let hop = 0; hop < MAX_HOPS; hop += 1) {
    // страница согласия Google: полная ссылка — в параметре continue
    if (current.hostname === CONSENT_HOST) {
      const next = current.searchParams.get("continue");
      if (!next) {
        return null;
      }
      try {
        current = new URL(next);
      } catch {
        return null;
      }
      if (!allowedHop(current)) {
        return null;
      }
    }

    if (isGoogleMapsHost(current.hostname)) {
      return isMapsUrl(current) ? current.toString() : null;
    }

    let response: Response;
    try {
      response = await fetchImpl(current.toString(), {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(HOP_TIMEOUT_MS),
        headers: { "user-agent": "PattayaKidsGuide/1.0 (+link check)" },
      });
    } catch {
      return null;
    }
    const location = response.headers.get("location");
    // тело не нужно — закрываем, чтобы не держать соединение
    await response.body?.cancel().catch(() => {});
    if (response.status < 300 || response.status >= 400 || !location) {
      return null;
    }
    try {
      current = new URL(location, current);
    } catch {
      return null;
    }
    if (!allowedHop(current)) {
      return null;
    }
  }
  return null;
}
