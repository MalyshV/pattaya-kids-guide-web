import { SUGGEST_DRAFT_KEY } from "@/lib/suggest/submission";

/**
 * «Дополнить карточку»: форма «Предложить своё», открытая со страницы уже
 * существующего места, события или занятия (?about=place:the-play-barn).
 * Здесь — чистый разбор этого параметра; саму карточку по нему ищет сервис.
 *
 * Дня рождения среди видов нет: праздник — это страница места.
 */

export const ABOUT_KINDS = ["place", "event", "activity"] as const;
export type AboutKind = (typeof ABOUT_KINDS)[number];

export type AboutRef = { kind: AboutKind; slug: string };

/** раздел сайта, где живёт страница карточки */
export const ABOUT_PATH: Record<AboutKind, string> = {
  place: "/places",
  event: "/events",
  activity: "/activities",
};

// slug карточек — латиница, цифры и дефис; всё остальное в адресе — не наше
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 200;

export function parseAbout(value: unknown): AboutRef | null {
  if (typeof value !== "string") {
    return null;
  }
  const separator = value.indexOf(":");
  if (separator < 0) {
    return null;
  }
  const kind = value.slice(0, separator);
  const slug = value.slice(separator + 1);
  if (
    !(ABOUT_KINDS as readonly string[]).includes(kind) ||
    slug.length > MAX_SLUG_LENGTH ||
    !SLUG.test(slug)
  ) {
    return null;
  }
  return { kind: kind as AboutKind, slug };
}

export function formatAbout(ref: AboutRef): string {
  return `${ref.kind}:${ref.slug}`;
}

/** адрес страницы карточки внутри города (без /ru/pattaya) */
export function aboutCardPath(ref: AboutRef): string {
  return `${ABOUT_PATH[ref.kind]}/${ref.slug}`;
}

/** адрес формы «Дополнить карточку»; owner — галочка «я представляю» уже стоит */
export function aboutFormPath(ref: AboutRef, owner = false): string {
  return `/suggest?about=${formatAbout(ref)}${owner ? "&owner=1" : ""}`;
}

/**
 * Ключ черновика: у дополнения — свой на каждую карточку, чтобы оно не
 * затирало начатое «Предложить своё» и не всплывало у чужой карточки.
 */
export function suggestDraftKey(ref: AboutRef | null): string {
  return ref ? `${SUGGEST_DRAFT_KEY}:${formatAbout(ref)}` : SUGGEST_DRAFT_KEY;
}
